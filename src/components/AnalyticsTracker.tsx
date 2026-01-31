"use client";

import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { initVisitorTracking, recordPageView } from "@/lib/analytics";

/**
 * AnalyticsTracker
 * Handles client-side tracking for user sessions and page views.
 * Invisible to the user.
 */
export default function AnalyticsTracker() {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [initialized, setInitialized] = useState(false);

    useEffect(() => {
        // Initialize visitor tracking (e.g., generate session ID)
        initVisitorTracking();
        setInitialized(true);
    }, []);

    useEffect(() => {
        if (initialized && pathname) {
            const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : "");
            // Record view after a small delay to ensure path is settled
            const timeout = setTimeout(() => {
                recordPageView(url);
            }, 100);

            return () => clearTimeout(timeout);
        }
    }, [pathname, searchParams, initialized]);

    return null;
}
