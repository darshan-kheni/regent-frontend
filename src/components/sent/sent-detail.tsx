'use client'

import { useRouter } from 'next/navigation'
import type { Email } from '@/types/email'
import { Badge, Button, Card } from '@/components/ui'
import { formatDate, formatRelativeTime, formatAddressWithName } from '@/lib/utils'
import { ArrowLeft, ChevronLeft, ChevronRight, Forward, RefreshCw } from 'lucide-react'

interface SentDetailProps {
  email: Email
  prevId: string | null
  nextId: string | null
}

function getDeliveryStatus(email: Email): 'sent' | 'delivered' | 'failed' {
  if (email.category === 'failed') return 'failed'
  if (email.is_read) return 'delivered'
  return 'sent'
}

const statusVariantMap = {
  sent: 'gold' as const,
  delivered: 'success' as const,
  failed: 'urgent' as const,
}

const statusLabelMap = {
  sent: 'Sent',
  delivered: 'Delivered',
  failed: 'Failed',
}

export function SentDetail({ email, prevId, nextId }: SentDetailProps) {
  const router = useRouter()
  const deliveryStatus = getDeliveryStatus(email)

  return (
    <div className="max-w-4xl mx-auto">
      {/* Navigation bar */}
      <div className="flex items-center justify-between mb-6">
        <Button variant="ghost" size="sm" onClick={() => router.push('/sent')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Sent
        </Button>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            disabled={!prevId}
            onClick={() => prevId && router.push(`/sent/${prevId}`)}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            disabled={!nextId}
            onClick={() => nextId && router.push(`/sent/${nextId}`)}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Email header */}
      <Card padding="lg">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1 min-w-0">
            <h1
              className="font-display text-2xl mb-2"
              style={{ color: 'var(--text-primary)' }}
            >
              {email.subject || '(No subject)'}
            </h1>
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant={statusVariantMap[deliveryStatus]}>
                {statusLabelMap[deliveryStatus]}
              </Badge>
              <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                {formatDate(email.created_at, 'MMM d, yyyy h:mm a')}
              </span>
              <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                ({formatRelativeTime(email.created_at)})
              </span>
            </div>
          </div>
        </div>

        {/* Recipients */}
        <div
          className="py-3 mb-4"
          style={{ borderTop: '1px solid var(--border-subtle)', borderBottom: '1px solid var(--border-subtle)' }}
        >
          <div className="flex items-center gap-2 text-sm">
            <span style={{ color: 'var(--text-muted)' }}>From:</span>
            <span style={{ color: 'var(--text-primary)' }}>
              {email.from_name ? `${email.from_name} <${email.from_address}>` : email.from_address}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm mt-1">
            <span style={{ color: 'var(--text-muted)' }}>To:</span>
            <span style={{ color: 'var(--text-primary)' }}>
              {email.to_addresses.map(formatAddressWithName).join(', ')}
            </span>
          </div>
          {email.cc_addresses.length > 0 && (
            <div className="flex items-center gap-2 text-sm mt-1">
              <span style={{ color: 'var(--text-muted)' }}>CC:</span>
              <span style={{ color: 'var(--text-primary)' }}>
                {email.cc_addresses.map(formatAddressWithName).join(', ')}
              </span>
            </div>
          )}
        </div>

        {/* Body */}
        <div
          className="prose prose-sm max-w-none text-sm leading-relaxed whitespace-pre-wrap"
          style={{ color: 'var(--text-primary)' }}
        >
          {email.body_html ? (
            <div dangerouslySetInnerHTML={{ __html: email.body_html }} />
          ) : (
            <p>{email.body_text}</p>
          )}
        </div>

        {/* Attachments */}
        {email.has_attachments && email.attachments && email.attachments.length > 0 && (
          <div className="mt-4 pt-4" style={{ borderTop: '1px solid var(--border-subtle)' }}>
            <span className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>
              Attachments ({email.attachments.length})
            </span>
            <div className="flex flex-wrap gap-2 mt-2">
              {email.attachments.map((attachment, i) => (
                <a
                  key={i}
                  href={attachment.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-2 py-1 text-xs"
                  style={{
                    borderRadius: 0,
                    border: '1px solid var(--border-default)',
                    color: 'var(--text-secondary)',
                  }}
                >
                  {attachment.filename}
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div
          className="flex items-center gap-3 mt-6 pt-4"
          style={{ borderTop: '1px solid var(--border-subtle)' }}
        >
          <Button variant="secondary" size="sm">
            <Forward className="h-4 w-4 mr-2" />
            Forward
          </Button>
          <Button variant="secondary" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Resend
          </Button>
        </div>
      </Card>
    </div>
  )
}
