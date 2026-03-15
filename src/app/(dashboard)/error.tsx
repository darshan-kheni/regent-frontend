'use client'

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="p-8 text-center">
      <h2 className="font-display text-2xl mb-4" style={{ color: 'var(--text-primary)' }}>
        Something went wrong
      </h2>
      <p className="mb-6" style={{ color: 'var(--text-muted)' }}>
        {error.message || 'An unexpected error occurred.'}
      </p>
      <button
        onClick={reset}
        className="px-6 py-2 font-medium"
        style={{
          backgroundColor: 'var(--btn-primary-bg)',
          color: 'var(--btn-primary-text)',
        }}
      >
        Try again
      </button>
    </div>
  )
}
