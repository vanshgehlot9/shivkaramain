import type { Metadata } from 'next'
import './globals.css'
import AnalyticsProvider from '../components/AnalyticsProvider'
import ClientEntranceAnimation from '../components/ClientEntranceAnimation';

export const metadata: Metadata = {
  metadataBase: new URL('https://shivkaradigitals.com'),
  title: {
    default: 'Shivkara Digitals - Professional Software Development Company in Jodhpur, Rajasthan',
    template: '%s | Shivkara Digitals - Software Development Company Jodhpur'
  },
  description: 'Leading software development company in Jodhpur, Rajasthan, India. Expert mobile app development, web development, custom software solutions, e-commerce platforms, and digital transformation services. ISO 27001 certified with 75+ successful projects and 40+ happy clients.',
  keywords: [
    // Primary keywords
    'software development company Jodhpur',
    'mobile app development Jodhpur', 
    'web development Jodhpur',
    'custom software solutions Rajasthan',
    'digital transformation services India',
    
    // Local SEO keywords
    'best software company Jodhpur',
    'IT services Rajasthan',
    'software development services Jodhpur',
    'app development company Rajasthan',
    'web design company Jodhpur',
    
    // Service-specific keywords
    'React Native app development',
    'Flutter app development', 
    'Next.js web development',
    'e-commerce development',
    'custom CRM development',
    'ERP software solutions',
    
    // Long-tail keywords
    'affordable software development India',
    'outsource app development Jodhpur',
    'enterprise software development Rajasthan',
    'startup software solutions India',
    'digital marketing services Jodhpur',
    
    // Technology keywords
    'Python development',
    'JavaScript development',
    'React development',
    'Node.js development',
    'AWS cloud solutions',
    'DevOps services'
  ],
  authors: [{ name: 'Shivkara Digitals Team' }],
  creator: 'Shivkara Digitals',
  publisher: 'Shivkara Digitals',
  robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
  alternates: {
    canonical: 'https://shivkaradigitals.com',
  },
  category: 'technology',
  classification: 'Software Development Company',
  other: {
    'business:contact_data:locality': 'Jodhpur',
    'business:contact_data:region': 'Rajasthan', 
    'business:contact_data:country_name': 'India',
    'geo.region': 'IN-RJ',
    'geo.placename': 'Jodhpur',
    'ICBM': '26.2389, 73.0243', // Jodhpur coordinates
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://shivkaradigitals.com',
    title: 'Shivkara Digitals - Leading Software Development Company in Jodhpur, Rajasthan',
    description: 'Transform your business with our custom software solutions. Enterprise-grade development starting from ₹7,000. Mobile apps, websites, e-commerce platforms, and complete digital transformation services in Jodhpur, Rajasthan.',
    siteName: 'Shivkara Digitals',
    images: [
      {
        url: '/logo.jpeg',
        width: 1200,
        height: 630,
        alt: 'Shivkara Digitals - Professional Software Development Company in Jodhpur, Rajasthan, India',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Shivkara Digitals - Software Development Company in Jodhpur, Rajasthan',
    description: 'Expert software development services in Jodhpur. Custom mobile apps, websites, e-commerce solutions starting from ₹7,000. 75+ projects completed, ISO 27001 certified team.',
    creator: '@ShivkaraDigital',
    site: '@ShivkaraDigital',
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
  },
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
        
        {/* Structured Data for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "Shivkara Digitals",
              "url": "https://shivkaradigitals.com",
              "logo": "https://shivkaradigitals.com/logo.jpeg",
              "description": "Leading software development company in Jodhpur, Rajasthan, India. Specializing in custom software solutions, mobile app development, web development, and digital transformation services.",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "Business District",
                "addressLocality": "Jodhpur",
                "addressRegion": "Rajasthan",
                "postalCode": "342001",
                "addressCountry": "IN"
              },
              "geo": {
                "@type": "GeoCoordinates",
                "latitude": 26.2389,
                "longitude": 73.0243
              },
              "contactPoint": {
                "@type": "ContactPoint",
                "telephone": "+91-9999999999",
                "contactType": "customer service",
                "availableLanguage": ["English", "Hindi"]
              },
              "sameAs": [
                "https://www.facebook.com/shivkaradigitals",
                "https://www.instagram.com/shivkaradigitals",
                "https://www.linkedin.com/company/shivkara-digitals",
                "https://twitter.com/shivkaradigital"
              ]
            })
          }}
        />
        
        {/* Local Business Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              "name": "Shivkara Digitals",
              "image": "https://shivkaradigitals.com/logo.jpeg",
              "telephone": "+91-9999999999",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "Business District",
                "addressLocality": "Jodhpur",
                "addressRegion": "Rajasthan",
                "postalCode": "342001",
                "addressCountry": "IN"
              },
              "geo": {
                "@type": "GeoCoordinates",
                "latitude": 26.2389,
                "longitude": 73.0243
              },
              "url": "https://shivkaradigitals.com",
              "openingHours": "Mo-Fr 09:00-18:00",
              "priceRange": "₹₹"
            })
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
