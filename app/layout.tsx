import type { Metadata } from 'next'
import './globals.css'
import AnalyticsProvider from '../components/AnalyticsProvider'
import ClientEntranceAnimation from '../components/ClientEntranceAnimation';
import { organizationSchema, localBusinessSchema, websiteSchema } from '../lib/structured-data';

export const metadata: Metadata = {
  metadataBase: new URL('https://shivkaradigital.com'),
  title: 'Shivkara Digitals - Professional Software Development & Digital Solutions Company',
  description: 'Leading software development company in Jodhpur, Rajasthan. We provide custom software solutions, mobile app development, web development, e-commerce, and comprehensive digital transformation services. ISO 27001 certified with Microsoft, AWS & Google Cloud partnerships.',
  keywords: [
    'software development', 
    'mobile app development', 
    'web development', 
    'custom software', 
    'digital transformation', 
    'Jodhpur', 
    'Rajasthan', 
    'India', 
    'web design',
    'website development',
    'e-commerce solutions',
    'business software',
    'responsive websites',
    'affordable software development',
    'android app development',
    'iOS app development',
    'UI/UX design',
    'business digitization',
    'cloud solutions',
    'software consulting',
    'enterprise software',
    'technology consulting',
    'IT services',
    'software as a service',
    'digital marketing',
    'best software company in Jodhpur',
    'business automation',
    'custom CRM',
    'ERP solutions',
    'software modernization'
  ],
  authors: [{ name: 'Shivkara Digitals Team' }],
  creator: 'Shivkara Digitals',
  publisher: 'Shivkara Digitals',
  robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
  alternates: {
    canonical: 'https://shivkaradigital.com',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://shivkaradigital.com',
    title: 'Shivkara Digitals - Professional Software Development & Digital Solutions',
    description: 'Transform your business with our custom software solutions. Enterprise-grade development starting from ₹7,000. Mobile apps, websites, e-commerce platforms, and complete digital transformation.',
    siteName: 'Shivkara Digitals',
    images: [
      {
        url: '/logo.jpeg',
        width: 1200,
        height: 630,
        alt: 'Shivkara Digitals - Professional Software Development Company in Jodhpur',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Shivkara Digitals - Professional Software Development & Digital Solutions',
    description: 'Transform your business with our custom software solutions. Enterprise-grade development starting from ₹7,000. Expert team for web, mobile & custom software development.',
    creator: '@ShivkaraDigital',
    images: ['/logo.jpeg'],
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
  },
  manifest: '/site.webmanifest',
  verification: {
    google: 'your-google-verification-code', // Replace with actual Google Search Console verification code
    yandex: 'your-yandex-verification-code',
  },
  category: 'technology',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon-16x16.png" type="image/png" sizes="16x16" />
        <link rel="icon" href="/favicon-32x32.png" type="image/png" sizes="32x32" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#6366f1" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="format-detection" content="telephone=no" />
        
        {/* Google Analytics */}
        <script 
          async 
          src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if (typeof window !== 'undefined') {
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', 'G-XXXXXXXXXX', {
                  page_title: document.title,
                  page_location: window.location.href,
                });
              }
            `,
          }}
        />
        
        {/* Enhanced Structured Data for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema)
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(localBusinessSchema)
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteSchema)
          }}
        />
      </head>
      <body>
        <AnalyticsProvider>
          <ClientEntranceAnimation />
          {children}
        </AnalyticsProvider>
      </body>
    </html>
  )
}
