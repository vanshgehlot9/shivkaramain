'use client';

import { ReactNode, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { initVisitorTracking, recordPageView } from '../lib/analytics';

interface AnalyticsProviderProps {
  children: ReactNode;
}

export default function AnalyticsProvider({ children }: AnalyticsProviderProps) {
  const pathname = usePathname();
  
  // Initialize visitor tracking on first load
  useEffect(() => {
    initVisitorTracking();
  }, []);
  
  // Record page view when pathname changes
  useEffect(() => {
    recordPageView(pathname);
  }, [pathname]);
  
  return <>{children}</>;
}
