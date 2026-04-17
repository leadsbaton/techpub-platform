import { Epilogue, Inter, Manrope } from 'next/font/google'
import type { Metadata } from 'next'

import './globals.css'

const epilogue = Epilogue({
  subsets: ['latin'],
  variable: '--font-headline',
  weight: ['700', '800', '900'],
})

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-body',
  weight: ['400', '500', '700', '800'],
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-ui',
  weight: ['400', '500', '600', '700'],
})

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ||
      (process.env.NODE_ENV === 'production'
        ? 'https://techpub-platform.vercel.app'
        : 'http://localhost:3000'),
  ),
  title: {
    default: 'LeadsBaton TechPub',
    template: '%s | LeadsBaton TechPub',
  },
  description:
    'Editorial platform for insights, white papers, webinars, and category-led discovery.',
  applicationName: 'LeadsBaton TechPub',
  openGraph: {
    title: 'LeadsBaton TechPub',
    description:
      'Editorial platform for insights, white papers, webinars, and category-led discovery.',
    type: 'website',
    siteName: 'LeadsBaton TechPub',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LeadsBaton TechPub',
    description:
      'Editorial platform for insights, white papers, webinars, and category-led discovery.',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${epilogue.variable} ${manrope.variable} ${inter.variable}`}>
      <body>{children}</body>
    </html>
  )
}
