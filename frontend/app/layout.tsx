import { Epilogue, Inter, Manrope } from 'next/font/google'
import type { Metadata } from 'next'

import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from '@/lib/site'

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
  metadataBase: new URL(SITE_URL),
  // Tells Google which URL is the real one for every page, so the live domain is
  // what gets indexed rather than any preview or IP host serving the same content.
  alternates: {
    canonical: '/',
  },
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  // No `icons` key on purpose. Setting it here overrides Next's file convention,
  // and the old value pointed at the full 3584x2832 logo — Google only shows a
  // site's favicon when it is square, so it fell back to the generic globe.
  // app/icon.png and app/apple-icon.png are square crops of the LB mark and are
  // picked up automatically.
  openGraph: {
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    type: 'website',
    siteName: SITE_NAME,
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
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
