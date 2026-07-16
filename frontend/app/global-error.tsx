'use client'

/**
 * Last-resort error boundary. A `global-error` replaces the root layout, so it
 * must ship its own <html>/<body> and cannot rely on globals.css being applied.
 * Styles are inlined so the recovery screen renders even when the app shell or
 * stylesheet failed to load. Per-section error.tsx boundaries handle the common
 * case; this only fires when the root layout itself throws.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '64px 24px',
          background: '#f4f4f2',
          fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, sans-serif',
          color: '#1f2937',
        }}
      >
        <div style={{ maxWidth: '36rem', textAlign: 'center' }}>
          <p
            style={{
              fontSize: '0.875rem',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.18em',
              color: '#BC0100',
              margin: 0,
            }}
          >
            Error
          </p>
          <h1 style={{ fontSize: '2.25rem', fontWeight: 600, margin: '1rem 0' }}>
            Something went wrong.
          </h1>
          <p style={{ fontSize: '1.125rem', color: '#52606d', margin: '0 0 1.75rem' }}>
            An unexpected error interrupted the page. Try again, or reload if the problem continues.
          </p>
          {error?.digest ? (
            <p style={{ fontSize: '0.75rem', color: '#9aa5b1', margin: '0 0 1.75rem' }}>
              Reference: {error.digest}
            </p>
          ) : null}
          <button
            type="button"
            onClick={() => reset()}
            style={{
              border: 'none',
              cursor: 'pointer',
              borderRadius: '9999px',
              background: '#BC0100',
              color: '#ffffff',
              padding: '0.75rem 1.5rem',
              fontSize: '0.875rem',
              fontWeight: 600,
            }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  )
}
