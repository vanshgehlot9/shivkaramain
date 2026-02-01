import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import SiteOverlays from "@/components/SiteOverlays";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
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
          <SiteOverlays />
        </Suspense>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
