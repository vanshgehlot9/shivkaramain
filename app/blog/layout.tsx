import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Blog & Insights - Shivkara Digitals',
  description: 'Latest insights on software development, mobile app development, web development trends, and digital transformation strategies from Jodhpur\'s leading tech company.',
  keywords: [
    'software development blog',
    'mobile app development tips',
    'web development tutorials',
    'digital transformation insights',
    'technology trends Jodhpur',
    'software development best practices'
  ],
  openGraph: {
    title: 'Blog & Insights - Shivkara Digitals',
    description: 'Expert insights on software development and digital transformation',
    url: 'https://shivkaradigitals.com/blog',
  }
}

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div>
      {children}
    </div>
  )
}
