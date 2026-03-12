import type { SiteSettings } from '@/lib/types/cms'
import { NewsletterForm } from './NewsletterForm'

export function NewsletterPanel({ settings }: { settings: SiteSettings | null }) {
  if (!settings?.newsletter?.enabled) return null

  return (
    <section className="rounded-[32px] bg-[linear-gradient(135deg,#1e293b,#0f172a)] px-6 py-8 text-white md:px-10">
      <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
        <div className="space-y-3">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-amber-300">Newsletter</p>
          <h2 className="text-3xl font-semibold tracking-tight">
            {settings.newsletter.title || 'Subscribe for weekly insights'}
          </h2>
          {settings.newsletter.description ? (
            <p className="max-w-2xl text-slate-300">{settings.newsletter.description}</p>
          ) : null}
        </div>
        <NewsletterForm submitLabel={settings.newsletter.submitLabel || 'Subscribe'} />
      </div>
    </section>
  )
}
