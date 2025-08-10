import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL('https://shivkaradigitals.com'),
  title: 'Shivkara Digitals - Professional Software Development Company',
  description: 'Leading software development company in Jodhpur, Rajasthan. We provide custom software solutions, mobile app development, web development, and digital transformation services. ISO 27001 certified with Microsoft, AWS & Google Cloud partnerships.',
  keywords: ['software development', 'mobile app development', 'web development', 'custom software', 'digital transformation', 'Jodhpur', 'Rajasthan', 'India'],
  authors: [{ name: 'Shivkara Digitals Team' }],
  creator: 'Shivkara Digitals',
  publisher: 'Shivkara Digitals',
  robots: 'index, follow',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://shivkaradigitals.com',
    title: 'Shivkara Digitals - Professional Software Development',
    description: 'Transform your business with our custom software solutions. Enterprise-grade development starting from ₹7,000.',
    siteName: 'Shivkara Digitals',
    images: [
      {
        url: '/logo.jpeg',
        width: 1200,
        height: 630,
        alt: 'Shivkara Digitals Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Shivkara Digitals - Professional Software Development',
    description: 'Transform your business with our custom software solutions. Enterprise-grade development starting from ₹7,000.',
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
      </head>
      <body>{children}</body>
    </html>
  )
}
