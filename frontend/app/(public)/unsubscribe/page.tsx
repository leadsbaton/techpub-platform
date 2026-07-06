import { Suspense } from 'react'
import { UnsubscribeClient } from './_components/UnsubscribeClient'

export const metadata = {
  title: 'Unsubscribe from Newsletter',
  robots: 'noindex',
}

export default function UnsubscribePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[var(--page-bg)] px-4 py-12">
      <Suspense fallback={<div>Loading...</div>}>
        <UnsubscribeClient />
      </Suspense>
    </div>
  )
}
