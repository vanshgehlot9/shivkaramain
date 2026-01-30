"use client";

import { usePathname } from "next/navigation";
import WhatsAppWidget from "@/components/WhatsAppWidget";
import LeadPopup from "@/components/LeadPopup";
import Preloader from "@/components/Preloader";
import ScrollProgress from "@/components/ScrollProgress";
import Grain from "@/components/Grain";

export default function SiteOverlays() {
    const pathname = usePathname();
    const isAdmin = pathname?.startsWith("/admin");

    if (isAdmin) return null;

    return (
        <>
            <Preloader />
            <Grain />
            <ScrollProgress />
            <WhatsAppWidget />
            <LeadPopup />
        </>
    );
}
