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
  title: "Shivkara Digital | Premium Web Development & Digital Marketing Agency",
  description: "Shivkara Digital is a leading web development and digital marketing agency in Jodhpur, India. We specialize in custom websites, mobile apps, SEO, and branding for ambitious businesses.",
  keywords: [
    "Web Development", "App Development", "Digital Marketing", "SEO Services",
    "Jodhpur Agency", "Custom Software", "React Development", "Next.js Experts",
    "UI/UX Design", "E-commerce Solutions", "Shivkara Digital", "Website Design India"
  ],
  openGraph: {
    title: "Shivkara Digital | Premium Web Development & Digital Marketing Agency",
    description: "Transform your business with custom software & mobile apps that scale. We build digital legacies.",
    url: "https://shivkaradigital.com",
    siteName: "Shivkara Digital",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Shivkara Digital | Premium Web Development & Digital Marketing Agency",
    description: "Transform your business with custom software & mobile apps that scale.",
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
    canonical: "https://shivkaradigital.com",
    languages: {
      'en-US': 'https://shivkaradigital.com',
    },
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Shivkara Digital",
  "url": "https://shivkaradigital.com",
  "logo": "https://shivkaradigital.com/logo.png",
  "sameAs": [
    "https://www.linkedin.com/company/shivkara-digital",
    "https://www.instagram.com/shivkara.digital",
    "https://twitter.com/shivkaradigital"
  ],
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+91-1234567890", // Placeholder
    "contactType": "customer service",
    "areaServed": "IN",
    "availableLanguage": "en"
  },
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Jodhpur, Rajasthan",
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
