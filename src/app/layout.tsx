import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";
import Grain from "@/components/Grain";
import Preloader from "@/components/Preloader";
import WhatsAppWidget from "@/components/WhatsAppWidget";
import LeadPopup from "@/components/LeadPopup";
import ScrollProgress from "@/components/ScrollProgress";
import SmoothScroll from "@/components/SmoothScroll";
import { Toaster } from "@/components/ui/toaster";
import AnalyticsTracker from "@/components/AnalyticsTracker";
import SiteOverlays from "@/components/SiteOverlays";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://www.shivkaradigital.com'),
  title: "Shivkara Digital | Premium Web Design & Development Agency",
  description: "Architecting digital excellence for ambitious brands. We merge strategy, design, and technology to build the extraordinary.",
  keywords: [
    "Web Design", "Web Development", "App Development", "Digital Agency", "SEO",
    "Jodhpur", "Custom Software", "Next.js", "React", "Branding", "UI/UX Design",
    "Student Internship Training", "Coding Bootcamps Jodhpur", "Live Project Training",
    "Industrial Training Jodhpur", "Summer Internship 2026", "React Training"
  ],
  openGraph: {
    title: "Shivkara Digital | Premium Web Design & Development Agency",
    description: "Architecting digital excellence for ambitious brands. We merge strategy, design, and technology to build the extraordinary.",
    url: "https://www.shivkaradigital.com",
    siteName: "Shivkara Digital",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Shivkara Digital | Premium Web Design & Development Agency",
    description: "Architecting digital excellence for ambitious brands.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: "https://www.shivkaradigital.com",
    languages: {
      'en-US': 'https://www.shivkaradigital.com',
    },
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Shivkara Digital",
  "url": "https://www.shivkaradigital.com",
  "logo": "https://www.shivkaradigital.com/logo.png",
  "sameAs": [
    "https://www.linkedin.com/company/shivkara-digital",
    "https://www.instagram.com/shivkaradigital/",
    "https://twitter.com/shivkaradigital"
  ],
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+91-9521699090",
    "contactType": "customer service",
    "areaServed": "IN",
    "availableLanguage": "en"
  },
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Mansarovar Plaza",
    "addressLocality": "Jodhpur",
    "addressRegion": "RJ",
    "postalCode": "342001",
    "addressCountry": "IN"
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${outfit.variable} antialiased bg-black text-white`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Suspense fallback={null}>
          <AnalyticsTracker />
        </Suspense>
        <SmoothScroll />
        <SiteOverlays />
        {children}
        <Toaster />
        <script src="https://checkout.razorpay.com/v1/checkout.js" async></script>
      </body>
    </html>
  );
}
