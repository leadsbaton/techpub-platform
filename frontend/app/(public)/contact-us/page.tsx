import type { Metadata } from 'next'
import Link from 'next/link'

import { getSiteSettings } from '@/lib/api/cms'

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Get in touch with our team',
}

export default async function ContactPage() {
  const settings = await getSiteSettings()
  const contactInfo = settings?.footerContact ?? {}
  const siteName = settings?.siteName ?? 'TechPub'

  return (
    <div className="relative left-1/2 w-screen -translate-x-1/2 bg-white">
      <div className="site-container py-12 sm:py-16">
        <div className="mx-auto max-w-2xl">
          {/* Header */}
          <div className="mb-12 text-center">
            <h1 className="text-4xl font-bold text-[#111] sm:text-5xl">Get in Touch</h1>
            <p className="mt-4 text-lg text-gray-600">
              Have a question or want to learn more? We&apos;d love to hear from you.
            </p>
          </div>

          {/* Contact Info Grid */}
          <div className="space-y-8">
            {/* Phone */}
            {contactInfo.phone && (
              <div className="flex gap-4">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-red-50">
                  <i className="ri-phone-line text-xl text-[var(--accent-red)]" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="font-semibold text-[#111]">Phone</h3>
                  <a href={`tel:${contactInfo.phone}`} className="text-gray-600 hover:text-[var(--accent-red)]">
                    {contactInfo.phone}
                  </a>
                </div>
              </div>
            )}

            {/* Emails */}
            {contactInfo.emails && contactInfo.emails.length > 0 && (
              <div className="flex gap-4">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-red-50">
                  <i className="ri-mail-line text-xl text-[var(--accent-red)]" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="font-semibold text-[#111]">Email</h3>
                  <div className="space-y-2">
                    {contactInfo.emails.map((email, idx) => (
                      <a
                        key={idx}
                        href={`mailto:${email.email}`}
                        className="block text-gray-600 hover:text-[var(--accent-red)]"
                      >
                        {email.email}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Addresses */}
            {contactInfo.addresses && contactInfo.addresses.length > 0 && (
              <div className="flex gap-4">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-red-50">
                  <i className="ri-map-pin-line text-xl text-[var(--accent-red)]" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="font-semibold text-[#111]">Offices</h3>
                  <div className="space-y-3">
                    {contactInfo.addresses.map((addr, idx) => (
                      <p key={idx} className="text-gray-600">
                        {addr.address}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Hours */}
            {contactInfo.hours && (
              <div className="flex gap-4">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-red-50">
                  <i className="ri-time-line text-xl text-[var(--accent-red)]" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="font-semibold text-[#111]">Hours</h3>
                  <p className="text-gray-600">{contactInfo.hours}</p>
                </div>
              </div>
            )}
          </div>

          {/* CTA */}
          <div className="mt-12 rounded-lg bg-gray-50 p-8 text-center">
            <h2 className="text-2xl font-bold text-[#111]">Subscribe to Updates</h2>
            <p className="mt-2 text-gray-600">
              Stay updated with the latest news and insights from {siteName}.
            </p>
            <Link
              href="#newsletter"
              className="mt-4 inline-block rounded-lg bg-[var(--accent-red)] px-6 py-2 font-semibold text-white transition-colors hover:bg-[var(--accent-red-dark)]"
            >
              Subscribe Now
            </Link>
          </div>

          {/* Back Link */}
          <div className="mt-8 text-center">
            <Link href="/" className="text-gray-600 hover:text-[var(--accent-red)]">
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
