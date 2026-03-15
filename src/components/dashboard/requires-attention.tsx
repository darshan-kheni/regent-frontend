'use client'

import { useState } from 'react'
import Link from 'next/link'
import { AlertTriangle, ChevronDown, ChevronUp } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { formatRelativeTime } from '@/lib/utils'
import type { AttentionEmail } from '@/types/analytics'

interface RequiresAttentionProps {
  emails: AttentionEmail[]
  isLoading: boolean
}

const COLLAPSED_COUNT = 3

export function RequiresAttention({ emails, isLoading }: RequiresAttentionProps) {
  const [expanded, setExpanded] = useState(false)

  if (isLoading) {
    return (
      <Card padding="lg">
        <Skeleton height="20px" width="160px" className="mb-4" />
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <Skeleton height="16px" width="16px" />
              <Skeleton height="14px" width="100%" />
            </div>
          ))}
        </div>
      </Card>
    )
  }

  if (!emails || emails.length === 0) {
    return (
      <Card padding="lg">
        <h2
          className="font-display text-lg mb-3"
          style={{ color: 'var(--text-primary)' }}
        >
          Requires Attention
        </h2>
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
          Nothing needs your attention right now.
        </p>
      </Card>
    )
  }

  const visible = expanded ? emails : emails.slice(0, COLLAPSED_COUNT)
  const hasMore = emails.length > COLLAPSED_COUNT

  return (
    <Card padding="lg">
      <div className="flex items-center gap-2 mb-4">
        <AlertTriangle
          size={18}
          style={{ color: 'var(--accent-gold)' }}
          aria-hidden="true"
        />
        <h2
          className="font-display text-lg"
          style={{ color: 'var(--text-primary)' }}
        >
          Requires Attention
        </h2>
        <span
          className="ml-auto text-xs font-medium px-2 py-0.5"
          style={{
            backgroundColor: 'rgba(201,169,110,0.15)',
            color: '#c9a96e',
            borderRadius: 0,
          }}
        >
          {emails.length}
        </span>
      </div>

      <ul className="space-y-0">
        {visible.map((email) => (
          <li key={email.id}>
            <Link
              href={`/inbox/${email.id}`}
              className="flex items-start gap-3 py-3 transition-colors"
              style={{ borderBottom: '1px solid var(--border-subtle)' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--accent-subtle)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent'
              }}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span
                    className="text-sm font-medium truncate"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    {email.from_name || email.from_address}
                  </span>
                  <span
                    className="text-xs shrink-0"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    {formatRelativeTime(email.received_at)}
                  </span>
                </div>
                <p
                  className="text-sm truncate"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  {email.subject}
                </p>
                {email.snippet && (
                  <p
                    className="text-xs mt-0.5 truncate"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    {email.snippet}
                  </p>
                )}
              </div>
              {email.priority >= 80 && (
                <span
                  className="text-xs font-medium px-1.5 py-0.5 shrink-0 mt-0.5"
                  style={{
                    backgroundColor: 'rgba(212,100,93,0.15)',
                    color: '#D4645D',
                    borderRadius: 0,
                  }}
                >
                  Urgent
                </span>
              )}
            </Link>
          </li>
        ))}
      </ul>

      {hasMore && (
        <button
          onClick={() => setExpanded((prev) => !prev)}
          className="flex items-center gap-1 mt-3 text-xs font-medium transition-colors"
          style={{ color: 'var(--accent-gold)' }}
        >
          {expanded ? (
            <>
              Show less <ChevronUp size={14} />
            </>
          ) : (
            <>
              Show {emails.length - COLLAPSED_COUNT} more <ChevronDown size={14} />
            </>
          )}
        </button>
      )}
    </Card>
  )
}
