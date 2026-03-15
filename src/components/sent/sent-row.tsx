'use client'

import Link from 'next/link'
import type { Email } from '@/types/email'
import { Badge } from '@/components/ui'
import { formatRelativeTime, formatEmailName } from '@/lib/utils'

interface SentRowProps {
  email: Email
  accountColor?: string
}

type DeliveryStatus = 'sent' | 'delivered' | 'failed'

function getDeliveryStatus(email: Email): DeliveryStatus {
  // Derive delivery status from email metadata
  // In production this would come from a dedicated field
  if (email.category === 'failed') return 'failed'
  if (email.is_read) return 'delivered'
  return 'sent'
}

const statusVariantMap: Record<DeliveryStatus, 'gold' | 'success' | 'urgent'> = {
  sent: 'gold',
  delivered: 'success',
  failed: 'urgent',
}

const statusLabelMap: Record<DeliveryStatus, string> = {
  sent: 'Sent',
  delivered: 'Delivered',
  failed: 'Failed',
}

export function SentRow({ email, accountColor = '#4A90D9' }: SentRowProps) {
  const recipientAddress = email.to_addresses[0] || 'Unknown'
  const recipientName = formatEmailName(null, recipientAddress)
  const initials = recipientName
    .split(/[\s.@]+/)
    .slice(0, 2)
    .map((s) => s.charAt(0).toUpperCase())
    .join('')
  const deliveryStatus = getDeliveryStatus(email)
  const isAiDrafted = email.category === 'ai_drafted' || !!email.summary

  return (
    <Link href={`/sent/${email.id}`} className="block">
      <div
        className="flex items-center gap-3 px-4 py-3 transition-colors cursor-pointer"
        style={{
          borderBottom: '1px solid var(--border-subtle)',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = 'var(--accent-subtle)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'transparent'
        }}
      >
        {/* Account dot + Avatar */}
        <div className="relative flex-shrink-0">
          <div
            className="w-8 h-8 flex items-center justify-center text-xs font-medium"
            style={{
              backgroundColor: 'var(--bg-secondary)',
              color: 'var(--text-secondary)',
            }}
          >
            {initials}
          </div>
          <span
            className="absolute -top-0.5 -left-0.5 w-2.5 h-2.5 border-2"
            style={{
              backgroundColor: accountColor,
              borderColor: 'var(--bg-card)',
              borderRadius: '50%',
            }}
          />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span
              className="text-sm font-medium truncate"
              style={{ color: 'var(--text-primary)' }}
            >
              To: {recipientName} <span style={{ color: 'var(--text-muted)', fontWeight: 'normal' }}>&lt;{recipientAddress}&gt;</span>
            </span>
            <span
              className="text-sm truncate"
              style={{ color: 'var(--text-secondary)' }}
            >
              {email.subject || '(No subject)'}
            </span>
          </div>
        </div>

        {/* Badges */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <span
            className="px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider"
            style={{
              backgroundColor: isAiDrafted ? 'var(--accent)' : 'var(--bg-secondary)',
              color: isAiDrafted ? 'var(--accent-foreground, #fff)' : 'var(--text-muted)',
            }}
          >
            {isAiDrafted ? 'AI' : 'MANUAL'}
          </span>
          <Badge variant={statusVariantMap[deliveryStatus]}>
            {statusLabelMap[deliveryStatus]}
          </Badge>
        </div>

        {/* Timestamp */}
        <span
          className="text-xs flex-shrink-0"
          style={{ color: 'var(--text-muted)' }}
        >
          {formatRelativeTime(email.created_at)}
        </span>
      </div>
    </Link>
  )
}
