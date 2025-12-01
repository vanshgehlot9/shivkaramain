"use client";

import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { initVisitorTracking, recordPageView } from "@/lib/analytics";

export default function AnalyticsTracker() {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [initialized, setInitialized] = useState(false);

    useEffect(() => {

        initVisitorTracking();
        setInitialized(true);
    }, []);

    useEffect(() => {
        if (initialized && pathname) {
            const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : "");
            recordPageView(url);
        }
    }, [pathname, searchParams, initialized]);

    return null;
}
