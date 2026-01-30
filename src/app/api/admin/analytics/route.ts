import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin-config';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { verifyAuth, unauthorizedResponse } from '@/lib/auth-admin';

// GET - Fetch analytics data
export async function GET(request: NextRequest) {
  const auth = await verifyAuth(request);
  if (!auth) {
    return unauthorizedResponse();
  }

  try {
    if (!db) {
      return NextResponse.json(
        { success: false, error: 'Database not initialized' },
        { status: 500 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const metric = searchParams.get('metric'); // 'overview', 'pages', 'sources', 'devices', 'locations'

    const start = startDate ? new Date(startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const end = endDate ? new Date(endDate) : new Date();

    let analyticsData: any = {};

    switch (metric) {
      case 'overview':
        analyticsData = await getOverviewAnalytics(start, end);
        break;
      case 'pages':
        analyticsData = await getPageAnalytics(start, end);
        break;
      case 'sources':
        analyticsData = await getSourceAnalytics(start, end);
        break;
      case 'devices':
        analyticsData = await getDeviceAnalytics(start, end);
        break;
      case 'locations':
        analyticsData = await getLocationAnalytics(start, end);
        break;
      default:
        // Return all analytics if no specific metric requested
        analyticsData = {
          overview: await getOverviewAnalytics(start, end),
          pages: await getPageAnalytics(start, end),
          sources: await getSourceAnalytics(start, end),
          devices: await getDeviceAnalytics(start, end),
          locations: await getLocationAnalytics(start, end),
        };
    }

    return NextResponse.json({
      success: true,
      startDate: start.toISOString(),
      endDate: end.toISOString(),
      data: analyticsData,
    });
  } catch (error: any) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// POST - Record page view
export async function POST(request: NextRequest) {
  try {
    if (!db) {
      return NextResponse.json(
        { success: false, error: 'Database not initialized' },
        { status: 500 }
      );
    }

    const body = await request.json();
    const {
      path,
      referrer,
      userAgent,
      country,
      city,
      sessionId,
    } = body;

    if (!path) {
      return NextResponse.json(
        { success: false, error: 'Path is required' },
        { status: 400 }
      );
    }

    // Parse user agent to get device type
    const deviceType = getDeviceType(userAgent);
    const source = getTrafficSource(referrer);

    // Record page view
    const pageViewData = {
      path,
      referrer: referrer || 'direct',
      source,
      deviceType,
      country: country || 'Unknown',
      city: city || 'Unknown',
      sessionId: sessionId || null,
      timestamp: new Date(),
      createdAt: new Date(),
    };

    await db.collection(COLLECTIONS.PAGE_VIEWS).add(pageViewData);

    // Update daily stats
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dateKey = today.toISOString().split('T')[0];

    const statsRef = db.collection(COLLECTIONS.VISITOR_STATS).doc(dateKey);
    const statsDoc = await statsRef.get();

    if (statsDoc.exists) {
      // Increment counters
      await statsRef.update({
        pageViews: (statsDoc.data()?.pageViews || 0) + 1,
        updatedAt: new Date(),
      });
    } else {
      // Create new stats document
      await statsRef.set({
        date: today,
        pageViews: 1,
        uniqueVisitors: 0, // Will be calculated separately
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Page view recorded',
    }, { status: 201 });
  } catch (error: any) {
    console.error('Error recording page view:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// Helper functions

function getDeviceType(userAgent: string): string {
  if (!userAgent) return 'unknown';

  const ua = userAgent.toLowerCase();
  if (ua.includes('mobile') || ua.includes('android') || ua.includes('iphone')) {
    return 'mobile';
  } else if (ua.includes('tablet') || ua.includes('ipad')) {
    return 'tablet';
  }
  return 'desktop';
}

function getTrafficSource(referrer: string): string {
  if (!referrer || referrer === '') return 'direct';

  const ref = referrer.toLowerCase();
  if (ref.includes('google')) return 'google';
  if (ref.includes('facebook')) return 'facebook';
  if (ref.includes('twitter') || ref.includes('t.co')) return 'twitter';
  if (ref.includes('linkedin')) return 'linkedin';
  if (ref.includes('instagram')) return 'instagram';
  if (ref.includes('youtube')) return 'youtube';

  return 'referral';
}

// Analytics query functions

async function getOverviewAnalytics(startDate: Date, endDate: Date) {
  const pageViewsSnapshot = await db!
    .collection(COLLECTIONS.PAGE_VIEWS)
    .where('timestamp', '>=', startDate)
    .where('timestamp', '<=', endDate)
    .get();

  const pageViews = pageViewsSnapshot.docs.map((doc: any) => doc.data());
  const totalPageViews = pageViews.length;

  // Count unique sessions
  const uniqueSessions = new Set(pageViews.map(pv => pv.sessionId).filter(Boolean));
  const uniqueVisitors = uniqueSessions.size;

  // Calculate bounce rate (sessions with only 1 page view)
  const sessionPageCounts = pageViews.reduce((acc: any, pv) => {
    if (pv.sessionId) {
      acc[pv.sessionId] = (acc[pv.sessionId] || 0) + 1;
    }
    return acc;
  }, {});

  const bouncedSessions = Object.values(sessionPageCounts).filter((count: any) => count === 1).length;
  const bounceRate = uniqueVisitors > 0 ? ((bouncedSessions / uniqueVisitors) * 100).toFixed(2) : 0;

  // Daily breakdown
  const dailyStats = pageViews.reduce((acc: any, pv) => {
    // Validate timestamp exists and is valid
    if (!pv.timestamp) return acc;

    const date = new Date(pv.timestamp);

    // Check if date is valid
    if (isNaN(date.getTime())) return acc;

    const dateKey = date.toISOString().split('T')[0];

    if (!acc[dateKey]) {
      acc[dateKey] = { date: dateKey, pageViews: 0, sessions: new Set() };
    }

    acc[dateKey].pageViews++;
    if (pv.sessionId) {
      acc[dateKey].sessions.add(pv.sessionId);
    }

    return acc;
  }, {});

  const dailyBreakdown = Object.values(dailyStats).map((stat: any) => ({
    date: stat.date,
    pageViews: stat.pageViews,
    uniqueVisitors: stat.sessions.size,
  }));

  return {
    totalPageViews,
    uniqueVisitors,
    bounceRate: `${bounceRate}%`,
    avgPageViewsPerVisitor: uniqueVisitors > 0 ? (totalPageViews / uniqueVisitors).toFixed(2) : 0,
    dailyBreakdown,
  };
}

async function getPageAnalytics(startDate: Date, endDate: Date) {
  const pageViewsSnapshot = await db!
    .collection(COLLECTIONS.PAGE_VIEWS)
    .where('timestamp', '>=', startDate)
    .where('timestamp', '<=', endDate)
    .get();

  const pageViews = pageViewsSnapshot.docs.map((doc: any) => doc.data());

  // Group by path
  const pageStats = pageViews.reduce((acc: any, pv) => {
    const path = pv.path || '/';

    if (!acc[path]) {
      acc[path] = {
        path,
        views: 0,
        uniqueVisitors: new Set(),
      };
    }

    acc[path].views++;
    if (pv.sessionId) {
      acc[path].uniqueVisitors.add(pv.sessionId);
    }

    return acc;
  }, {});

  const topPages = Object.values(pageStats)
    .map((stat: any) => ({
      path: stat.path,
      views: stat.views,
      uniqueVisitors: stat.uniqueVisitors.size,
    }))
    .sort((a, b) => b.views - a.views)
    .slice(0, 20);

  return {
    totalPages: Object.keys(pageStats).length,
    topPages,
  };
}

async function getSourceAnalytics(startDate: Date, endDate: Date) {
  const pageViewsSnapshot = await db!
    .collection(COLLECTIONS.PAGE_VIEWS)
    .where('timestamp', '>=', startDate)
    .where('timestamp', '<=', endDate)
    .get();

  const pageViews = pageViewsSnapshot.docs.map((doc: any) => doc.data());

  // Group by source
  const sourceStats = pageViews.reduce((acc: any, pv) => {
    const source = pv.source || 'direct';
    acc[source] = (acc[source] || 0) + 1;
    return acc;
  }, {});

  const totalViews = pageViews.length;
  const sources = Object.entries(sourceStats)
    .map(([source, count]: [string, any]) => ({
      source,
      visitors: count,
      percentage: totalViews > 0 ? ((count / totalViews) * 100).toFixed(2) : 0,
    }))
    .sort((a, b) => b.visitors - a.visitors);

  return {
    sources,
  };
}

async function getDeviceAnalytics(startDate: Date, endDate: Date) {
  const pageViewsSnapshot = await db!
    .collection(COLLECTIONS.PAGE_VIEWS)
    .where('timestamp', '>=', startDate)
    .where('timestamp', '<=', endDate)
    .get();

  const pageViews = pageViewsSnapshot.docs.map((doc: any) => doc.data());

  // Group by device type
  const deviceStats = pageViews.reduce((acc: any, pv) => {
    const device = pv.deviceType || 'unknown';
    acc[device] = (acc[device] || 0) + 1;
    return acc;
  }, {});

  const totalViews = pageViews.length;

  return {
    desktop: deviceStats.desktop || 0,
    mobile: deviceStats.mobile || 0,
    tablet: deviceStats.tablet || 0,
    unknown: deviceStats.unknown || 0,
    percentages: {
      desktop: totalViews > 0 ? ((deviceStats.desktop || 0) / totalViews * 100).toFixed(2) : 0,
      mobile: totalViews > 0 ? ((deviceStats.mobile || 0) / totalViews * 100).toFixed(2) : 0,
      tablet: totalViews > 0 ? ((deviceStats.tablet || 0) / totalViews * 100).toFixed(2) : 0,
    },
  };
}

async function getLocationAnalytics(startDate: Date, endDate: Date) {
  const pageViewsSnapshot = await db!
    .collection(COLLECTIONS.PAGE_VIEWS)
    .where('timestamp', '>=', startDate)
    .where('timestamp', '<=', endDate)
    .get();

  const pageViews = pageViewsSnapshot.docs.map((doc: any) => doc.data());

  // Group by country
  const countryStats = pageViews.reduce((acc: any, pv) => {
    const country = pv.country || 'Unknown';
    if (!acc[country]) {
      acc[country] = { country, visitors: 0, cities: {} };
    }
    acc[country].visitors++;

    const city = pv.city || 'Unknown';
    acc[country].cities[city] = (acc[country].cities[city] || 0) + 1;

    return acc;
  }, {});

  const locations = Object.values(countryStats)
    .map((stat: any) => ({
      country: stat.country,
      visitors: stat.visitors,
      topCities: Object.entries(stat.cities)
        .map(([city, count]: [string, any]) => ({ city, visitors: count }))
        .sort((a, b) => b.visitors - a.visitors)
        .slice(0, 5),
    }))
    .sort((a, b) => b.visitors - a.visitors);

  return {
    locations,
  };
}
