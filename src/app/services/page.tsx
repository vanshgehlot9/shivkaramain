import Navbar from "@/components/Navbar";
import Services from "@/components/Services";
import CoreCapabilities from "@/components/CoreCapabilities";
import TechStack from "@/components/TechStack";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import NoiseBackground from "@/components/ui/NoiseBackground";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Services | Shivkara Digital | Web Development, App Design & SEO",
    description: "Explore our premium digital services including Custom Web Development, Mobile App Design, SEO Optimization, and Brand Strategy.",
    alternates: {
        canonical: "https://www.shivkaradigital.com/services",
    },
    openGraph: {
        title: "Services | Shivkara Digital | Web Development, App Design & SEO",
        description: "Explore our premium digital services including Custom Web Development, Mobile App Design, SEO Optimization, and Brand Strategy.",
        url: "https://www.shivkaradigital.com/services",
        images: [
            {
                url: "/shivkaralogo.jpg",
                width: 1200,
                height: 630,
                alt: "Shivkara Digital Services",
            },
        ],
    }
};

export default function ServicesPage() {
    const jsonLd = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "Service",
                "serviceType": "Custom Web Development",
                "provider": {
                    "@type": "Organization",
                    "name": "Shivkara Digital",
                    "url": "https://www.shivkaradigital.com"
                },
                "areaServed": {
                    "@type": "City",
                    "name": "Jodhpur"
                },
                "hasOfferCatalog": {
                    "@type": "OfferCatalog",
                    "name": "Web Development Services",
                    "itemListElement": [
                        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Next.js Applications" } },
                        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "E-Commerce Solutions" } }
                    ]
                }
            },
            {
                "@type": "Service",
                "serviceType": "Mobile App Engineering",
                "provider": {
                    "@type": "Organization",
                    "name": "Shivkara Digital"
                },
                "areaServed": {
                    "@type": "City",
                    "name": "Jodhpur"
                }
            }
        ]
    };

    return (
        <main className="bg-black min-h-screen text-white selection:bg-shivkara-orange selection:text-black">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <NoiseBackground />
            <Navbar />
            <div className="pt-32">
                <Services />
                <CoreCapabilities />
                <TechStack />
            </div>
            <Contact />
            <Footer />
        </main>
    );
}
