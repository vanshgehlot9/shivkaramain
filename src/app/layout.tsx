import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import Grain from "@/components/Grain";
import Preloader from "@/components/Preloader";
import WhatsAppWidget from "@/components/WhatsAppWidget";
import LeadPopup from "@/components/LeadPopup";
import { Toaster } from "@/components/ui/toaster";
import AnalyticsTracker from "@/components/AnalyticsTracker";

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
        <AnalyticsTracker />
        <Preloader />
        <Grain />
        <WhatsAppWidget />
        <LeadPopup />
        {children}
        <Toaster />
      </body>
    </html>
  );
}
