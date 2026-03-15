'use client'

import { Badge } from '@/components/ui/badge'
import type { AuditEntry, AuditEventType } from '@/types/analytics'
import type { BadgeVariant } from '@/components/ui/badge'

interface LogEntryProps {
  entry: AuditEntry
}

const eventTypeConfig: Record<AuditEventType, { label: string; variant: BadgeVariant; color: string }> = {
  categorize: { label: 'Categorize', variant: 'info', color: '#7EA3C2' },
  summarize: { label: 'Summary', variant: 'reading', color: '#9B7EBD' },
  draft: { label: 'Draft', variant: 'success', color: '#6FAD76' },
  draft_reply: { label: 'Draft', variant: 'success', color: '#6FAD76' },
  behavior_analysis: { label: 'Behavior', variant: 'orange', color: '#C9865A' },
}

function formatTime(dateStr: string): string {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  if (isNaN(d.getTime())) return ''
  return d.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })
}

function LogEntry({ entry }: LogEntryProps) {
  const config = eventTypeConfig[entry.event_type] ?? {
    label: entry.event_type,
    variant: 'muted' as BadgeVariant,
    color: '#6E6660',
  }

  const senderSubject = entry.email_sender && entry.email_subject
    ? `${entry.email_sender} - ${entry.email_subject}`
    : entry.email_subject ?? entry.email_sender ?? null

  return (
    <div
      className="px-4 py-3"
      style={{
        backgroundColor: 'var(--bg-card)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 0,
      }}
    >
      <div className="flex items-start gap-3">
        {/* Timestamp */}
        <span
          className="text-xs flex-shrink-0 pt-0.5 font-mono"
          style={{ color: 'var(--text-muted)', minWidth: '72px' }}
        >
          {formatTime(entry.created_at)}
        </span>

        {/* Type badge */}
        <Badge variant={config.variant} className="flex-shrink-0 mt-0.5">
          {config.label}
        </Badge>

        {/* Main content */}
        <div className="flex-1 min-w-0">
          {/* Sender / Subject */}
          <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            {senderSubject ?? '\u2014'}
          </div>

          {/* Decision (gold text, bold) */}
          {entry.decision && (
            <div
              className="text-sm font-semibold mt-0.5"
              style={{ color: '#c9a96e' }}
            >
              {entry.decision}
            </div>
          )}

          {/* Reason / description (smaller) */}
          {(entry.reason || entry.description) && (
            <div
              className="text-xs mt-0.5 leading-relaxed"
              style={{ color: 'var(--text-muted)' }}
            >
              {entry.reason ?? entry.description}
            </div>
          )}
        </div>

        {/* Model + Tokens (right side) */}
        <div className="flex items-center gap-4 flex-shrink-0 pt-0.5">
          {entry.model_used && (
            <span
              className="text-xs font-mono"
              style={{ color: 'var(--text-muted)' }}
            >
              {entry.model_used}
            </span>
          )}
          {entry.tokens_consumed !== null && entry.tokens_consumed !== undefined && (
            <span
              className="text-xs font-mono"
              style={{ color: 'var(--text-muted)', minWidth: '48px', textAlign: 'right' }}
            >
              {entry.tokens_consumed.toLocaleString()} tok
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

export { LogEntry }
