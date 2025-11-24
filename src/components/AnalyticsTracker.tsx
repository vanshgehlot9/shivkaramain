"use client";

import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { initVisitorTracking, recordPageView } from "@/lib/analytics";

export default function AnalyticsTracker() {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [initialized, setInitialized] = useState(false);

    useEffect(() => {
        // Initialize tracking on mount
        initVisitorTracking();
        setInitialized(true);
    }, []);

    useEffect(() => {
        // Record page view on route change
        // We skip the first run if initVisitorTracking already handles it, 
        // BUT we are going to modify initVisitorTracking to NOT handle it, 
        // so this component is fully responsible.
        if (initialized && pathname) {
            const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : "");
            recordPageView(url);
        }
    }, [pathname, searchParams, initialized]);

    return null;
}
