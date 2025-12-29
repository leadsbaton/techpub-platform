'use client'

export default function InsightDetailError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <h2 className="text-2xl font-bold mb-4">Failed to load insight</h2>
      <p className="text-base-content/70 mb-6">{error.message}</p>
      <button onClick={reset} className="btn btn-primary">
        Try again
      </button>
    </div>
  )
}

