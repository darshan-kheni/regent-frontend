'use client'

import Link from 'next/link'
import { Paperclip, Sparkles, AlertCircle } from 'lucide-react'
import { Avatar } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { cn, formatRelativeTime, formatEmailName } from '@/lib/utils'
import type { Email } from '@/types/email'

interface EmailRowProps {
  email: Email
}

function formatCategoryLabel(cat: string): string {
  return cat
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
}

function EmailRow({ email }: EmailRowProps) {
  const senderName = formatEmailName(email.from_name, email.from_address)
  const isUnread = !email.is_read
  const hasCategory = email.category && email.category !== 'uncategorized'
  const hasMeta = hasCategory || email.summary || email.action_required || email.has_attachments

  return (
    <Link
      href={`/inbox/${email.id}`}
      className="block transition-colors"
      style={{
        borderBottom: '1px solid var(--border-subtle)',
        borderLeft: isUnread ? '3px solid var(--accent)' : '3px solid transparent',
        backgroundColor: isUnread ? 'var(--bg-elevated)' : 'var(--bg-card)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = 'var(--accent-subtle)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = isUnread ? 'var(--bg-elevated)' : 'var(--bg-card)'
      }}
    >
      {/* Row 1: Table layout — Avatar | Sender | Subject | Time */}
      <div className="flex items-center px-4 py-0.5" style={{ minHeight: 32 }}>
        {/* Avatar — fixed */}
        <div className="flex-shrink-0 mr-3" style={{ width: 32 }}>
          <Avatar name={senderName} size="sm" />
        </div>

        {/* Sender — fixed width column */}
        <div className="flex-shrink-0 mr-3 overflow-hidden" style={{ width: 180 }}>
          <span
            className={cn(
              'text-sm block truncate',
              isUnread ? 'font-bold' : 'font-medium'
            )}
            style={{ color: 'var(--text-primary)' }}
          >
            {senderName}
          </span>
        </div>

        {/* Category + Subject — fills remaining space */}
        <div className="flex-1 min-w-0 mr-3 flex items-center gap-1.5">
          {hasCategory && (
            <Badge variant={email.category!} className="text-[10px] px-1.5 py-0 flex-shrink-0">
              {formatCategoryLabel(email.category!)}
            </Badge>
          )}
          <span
            className={cn(
              'text-sm truncate',
              isUnread ? 'font-medium' : 'font-normal'
            )}
            style={{ color: isUnread ? 'var(--text-secondary)' : 'var(--text-muted)' }}
          >
            {email.subject}
          </span>
        </div>

        {/* AI icons — before time */}
        {(email.action_required || email.summary || email.has_attachments) && (
          <div className="flex items-center gap-1.5 flex-shrink-0 mr-3">
            {email.action_required && (
              <Badge variant="urgent" className="text-[10px] px-1.5 py-0">
                <AlertCircle className="h-2.5 w-2.5 mr-0.5" />
                Action
              </Badge>
            )}
            {email.summary && (
              <Sparkles
                className="h-3 w-3 flex-shrink-0"
                style={{ color: 'var(--accent)' }}
              />
            )}
            {email.has_attachments && (
              <Paperclip className="h-3 w-3 flex-shrink-0" style={{ color: 'var(--text-muted)' }} />
            )}
          </div>
        )}

        {/* Time — fixed right */}
        <div className="flex-shrink-0 text-right" style={{ width: 64 }}>
          <time
            className={cn('text-xs whitespace-nowrap', isUnread ? 'font-semibold' : 'font-normal')}
            style={{ color: isUnread ? 'var(--text-primary)' : 'var(--text-muted)' }}
            dateTime={email.received_at}
          >
            {formatRelativeTime(email.received_at)}
          </time>
        </div>
      </div>
    </Link>
  )
}

export { EmailRow, type EmailRowProps }
