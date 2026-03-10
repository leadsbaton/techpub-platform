import type { Metadata } from 'next'

import './globals.css'

export const metadata: Metadata = {
  title: 'TechPub Platform',
  description: 'Editorial platform built with Next.js, Payload CMS, and MongoDB Atlas.',
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
