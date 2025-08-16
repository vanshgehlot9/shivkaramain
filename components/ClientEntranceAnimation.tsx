"use client";
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

// Duration for the entrance animation (ms). Exported so it can be changed from one place.
export const ENTRANCE_ANIMATION_MS = 4000;

// Preload the animation to ensure it loads immediately with a loading fallback
const EntranceAnimation = dynamic(() => import('./ui/entrance-animation'), {
  ssr: false,
  loading: () => (
    <div className="fixed inset-0 z-[9999] bg-black flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  )
});

export default function ClientEntranceAnimation() {
  // Show the animation overlay only on first visit to avoid permanently blocking interactions
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const hasSeenAnimation = localStorage.getItem('hasSeenEntryAnimation');

    // If first visit, show animation overlay and lock scroll until it completes
    if (!hasSeenAnimation) {
      setIsVisible(true);
      document.body.style.overflow = 'hidden';
      window.scrollTo(0, 0);

  const timer = setTimeout(() => {
        document.body.style.overflow = '';
        setIsVisible(false);
        try {
          localStorage.setItem('hasSeenEntryAnimation', 'true');
        } catch (e) {
          // ignore storage errors
        }
  }, ENTRANCE_ANIMATION_MS); // Animation duration

      return () => {
        clearTimeout(timer);
        document.body.style.overflow = '';
      };
    }
  }, []);

  // If not visible (either already seen or after timeout), don't render the overlay.
  if (!isVisible) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black"
      style={{ height: '100vh', width: '100vw' }}
      aria-hidden={!isVisible}
    >
      <EntranceAnimation />
    </div>
  );
}
