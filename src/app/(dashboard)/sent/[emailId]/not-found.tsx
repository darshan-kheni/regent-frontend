import Link from 'next/link'

export default function SentEmailNotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-24">
      <h2
        className="font-display text-2xl mb-2"
        style={{ color: 'var(--text-primary)' }}
      >
        Sent email not found
      </h2>
      <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>
        The email you are looking for does not exist or has been removed.
      </p>
      <Link
        href="/sent"
        className="inline-flex items-center h-10 px-4 text-sm font-medium"
        style={{
          borderRadius: 0,
          backgroundColor: 'var(--btn-primary-bg)',
          color: 'var(--btn-primary-text)',
        }}
      >
        Back to Sent
      </Link>
    </div>
  )
}
