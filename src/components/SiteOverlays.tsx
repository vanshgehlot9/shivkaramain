"use client";

import { usePathname } from "next/navigation";
import dynamic from 'next/dynamic';

// Dynamically import components to reduce initial bundle size
const WhatsAppWidget = dynamic(() => import("@/components/WhatsAppWidget"), { ssr: false });
const LeadPopup = dynamic(() => import("@/components/LeadPopup"), { ssr: false });
const Preloader = dynamic(() => import("@/components/Preloader"), { ssr: false });
const ScrollProgress = dynamic(() => import("@/components/ScrollProgress"), { ssr: false });
const Grain = dynamic(() => import("@/components/Grain"), { ssr: false });
const AnalyticsTracker = dynamic(() => import("@/components/AnalyticsTracker"), { ssr: false });
const SmoothScroll = dynamic(() => import("@/components/SmoothScroll"), { ssr: false });

export default function SiteOverlays() {
    const pathname = usePathname();
    const isAdmin = pathname?.startsWith("/admin");

    if (isAdmin) return null;

    return (
        <>
            <SmoothScroll />
            <AnalyticsTracker />
            <Preloader />
            <Grain />
            <ScrollProgress />
            <WhatsAppWidget />
            <LeadPopup />
        </>
    );
}
