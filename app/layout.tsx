import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Shivkara Digital',
  description: 'Digital Marketing Agency',
  generator: 'Shivkara Digital',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
