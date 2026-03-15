import Link from 'next/link'
import { ArrowLeft, MailX } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function EmailNotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-24">
      <MailX
        className="h-16 w-16 mb-6"
        style={{ color: 'var(--text-muted)' }}
      />
      <h2
        className="font-display text-xl font-semibold mb-2"
        style={{ color: 'var(--text-primary)' }}
      >
        Email not found
      </h2>
      <p
        className="text-sm mb-6"
        style={{ color: 'var(--text-muted)' }}
      >
        This email may have been deleted or you may not have access to it.
      </p>
      <Link href="/inbox">
        <Button variant="secondary" size="sm">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Inbox
        </Button>
      </Link>
    </div>
  )
}
