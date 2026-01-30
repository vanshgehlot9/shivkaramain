import { db, app } from './firebase';
import {
  doc,
  setDoc,
  increment,
  collection,
  serverTimestamp,
  addDoc
} from 'firebase/firestore';
import { getAnalytics, logEvent } from 'firebase/analytics';

// Initialize session ID
let sessionId = '';

// Generate a unique session ID
const generateSessionId = () => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

// Initialize visitor tracking
export const initVisitorTracking = () => {
  if (typeof window !== 'undefined') {
    // Check if session already exists
    sessionId = sessionStorage.getItem('session_id') || '';

    if (!sessionId) {
      // Create new session
      sessionId = generateSessionId();
      sessionStorage.setItem('session_id', sessionId);

      // Record new visitor
      recordNewVisitor();
    }
  }
};

// Record new visitor
const recordNewVisitor = async () => {
  try {
    // Get device and browser info
    const userAgent = navigator.userAgent;
    const isMobile = /iPhone|iPad|iPod|Android/i.test(userAgent);
    const browser = detectBrowser(userAgent);
    const referrer = document.referrer || 'direct';

    // Get approximate location based on language/timezone (non-intrusive)
    const language = navigator.language || 'en-US';
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'Unknown';

    await addDoc(collection(db, 'visitors'), {
      sessionId,
      timestamp: serverTimestamp(),
      date: new Date().toISOString().split('T')[0],
      device: isMobile ? 'mobile' : 'desktop',
      browser,
      language,
      timezone,
      referrer,
      landingPage: window.location.pathname
    });

    // Update daily stats
    const today = new Date().toISOString().split('T')[0];
    const statsRef = doc(db, 'visitorStats', today);

    await setDoc(statsRef, {
      date: today,
      visitors: increment(1),
      views: increment(1),
      mobileCount: isMobile ? increment(1) : increment(0),
      desktopCount: !isMobile ? increment(1) : increment(0)
    }, { merge: true });

    // Firebase Analytics event if available
    try {
      const analytics = getAnalytics(app);
      if (analytics) {
        logEvent(analytics, 'new_visitor', {
          device: isMobile ? 'mobile' : 'desktop',
          landing_page: window.location.pathname
        });
      }
    } catch (e) {
      console.warn('Firebase Analytics not available:', e);
    }
  } catch (error) {
    console.error('Error recording visitor:', error);
  }
};

// Record page view
export const recordPageView = async (path: string) => {
  // If no session ID yet (e.g. first load), try to get it or init
  if (!sessionId && typeof window !== 'undefined') {
    sessionId = sessionStorage.getItem('session_id') || '';
    if (!sessionId) {
      // If still no session, init tracking (which creates session)
      initVisitorTracking();
    }
  }

  if (!sessionId) return;

  try {
    // Record in page views collection
    await addDoc(collection(db, 'pageViews'), {
      sessionId,
      path,
      timestamp: serverTimestamp()
    });

    // Update daily stats
    const today = new Date().toISOString().split('T')[0];
    const statsRef = doc(db, 'visitorStats', today);

    await setDoc(statsRef, {
      date: today,
      views: increment(1)
    }, { merge: true });

    // Firebase Analytics event if available
    try {
      const analytics = getAnalytics(app);
      if (analytics) {
        logEvent(analytics, 'page_view', {
          page_path: path
        });
      }
    } catch (e) {
      console.warn('Firebase Analytics not available:', e);
    }
  } catch (error) {
    console.error('Error recording page view:', error);
  }
};

// Track link clicks
export const trackLinkClick = async (linkUrl: string, linkText: string, category: string = 'internal') => {
  if (!sessionId) return;

  try {
    // Record in link clicks collection
    await addDoc(collection(db, 'linkClicks'), {
      sessionId,
      linkUrl,
      linkText,
      category,
      timestamp: serverTimestamp(),
      currentPage: window.location.pathname
    });

    // Firebase Analytics event if available
    try {
      const analytics = getAnalytics(app);
      if (analytics) {
        logEvent(analytics, 'link_click', {
          link_url: linkUrl,
          link_text: linkText,
          link_category: category,
          current_page: window.location.pathname
        });
      }
    } catch (e) {
      console.warn('Firebase Analytics not available:', e);
    }
  } catch (error) {
    console.error('Error tracking link click:', error);
  }
};

// Track external link clicks
export const trackExternalLinkClick = (linkUrl: string, linkText: string) => {
  trackLinkClick(linkUrl, linkText, 'external');
};

// Track CTA button clicks
export const trackCTAClick = (ctaText: string, ctaLocation: string) => {
  trackLinkClick('#CTA', ctaText, 'CTA-' + ctaLocation);
};

// Helper function to detect browser
const detectBrowser = (userAgent: string): string => {
  if (userAgent.indexOf('Chrome') > -1) return 'Chrome';
  if (userAgent.indexOf('Safari') > -1) return 'Safari';
  if (userAgent.indexOf('Firefox') > -1) return 'Firefox';
  if (userAgent.indexOf('MSIE') > -1 || userAgent.indexOf('Trident/') > -1) return 'Internet Explorer';
  if (userAgent.indexOf('Edge') > -1) return 'Edge';
  return 'Unknown';
};
