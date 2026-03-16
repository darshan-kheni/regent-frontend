'use client'

import { useState } from 'react'
import { X } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge, type BadgeVariant } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { formatRelativeTime } from '@/lib/utils'
import type { AuditEntry, AuditEventType } from '@/types/analytics'

const VISIBLE_COUNT = 5

interface ActivityFeedProps {
  activities: AuditEntry[]
  isLoading: boolean
}

const eventBadgeMap: Record<AuditEventType, BadgeVariant> = {
  categorize: 'info',
  summarize: 'gold',
  draft: 'success',
  draft_reply: 'success',
  behavior_analysis: 'personal',
}

const eventLabelMap: Record<AuditEventType, string> = {
  categorize: 'Categorize',
  summarize: 'Summary',
  draft: 'Draft',
  draft_reply: 'Draft',
  behavior_analysis: 'Behavior',
}

function ActivityEntry({ entry, index }: { entry: AuditEntry; index: number }) {
  const badgeVariant = eventBadgeMap[entry.event_type] ?? 'muted'
  const badgeLabel = eventLabelMap[entry.event_type] ?? entry.event_type
  const sender = entry.email_sender
  const subject = entry.email_subject
  const model = entry.model_used
  const tokens = entry.tokens_consumed
  const decision = entry.decision

  return (
    <li
      className="flex items-start gap-3 py-2.5"
      style={{
        borderBottom: '1px solid var(--border-subtle)',
        animation: index === 0 ? 'fadeSlideIn 0.3s ease-out' : undefined,
      }}
    >
      <Badge variant={badgeVariant} className="shrink-0 mt-0.5">
        {badgeLabel}
      </Badge>
      <div className="flex-1 min-w-0">
        {(sender || subject) ? (
          <div className="flex items-center gap-1.5 text-sm">
            {sender && (
              <span className="font-medium truncate" style={{ color: 'var(--text-primary)' }}>
                {sender}
              </span>
            )}
            {sender && subject && (
              <span style={{ color: 'var(--text-muted)' }}>—</span>
            )}
            {subject && (
              <span className="truncate" style={{ color: 'var(--text-secondary)' }}>
                {subject}
              </span>
            )}
          </div>
        ) : (
          <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            {entry.description}
          </span>
        )}
        {decision && (
          <div className="text-xs font-medium mt-0.5" style={{ color: 'var(--accent)' }}>
            {decision}
          </div>
        )}
        {(model || (tokens != null && tokens > 0)) && (
          <div className="flex items-center gap-3 mt-0.5">
            {model && (
              <span className="text-[10px] font-mono" style={{ color: 'var(--text-muted)' }}>
                {model}
              </span>
            )}
            {tokens != null && tokens > 0 && (
              <span className="text-[10px] font-mono" style={{ color: 'var(--text-muted)' }}>
                {tokens.toLocaleString()} tok
              </span>
            )}
          </div>
        )}
      </div>
      <span
        className="shrink-0 text-xs whitespace-nowrap mt-0.5"
        style={{ color: 'var(--text-muted)' }}
      >
        {formatRelativeTime(entry.created_at)}
      </span>
    </li>
  )
}

export function ActivityFeed({ activities, isLoading }: ActivityFeedProps) {
  const [showAll, setShowAll] = useState(false)
  const visible = activities.slice(0, VISIBLE_COUNT)
  const hasMore = activities.length > VISIBLE_COUNT

  return (
    <>
    <Card padding="lg">
      <div className="flex items-center justify-between mb-4">
        <h2
          className="font-display text-lg"
          style={{ color: 'var(--text-primary)' }}
        >
          Recent Activity
        </h2>
        {hasMore && (
          <button
            type="button"
            onClick={() => setShowAll(true)}
            className="text-xs font-medium"
            style={{ color: 'var(--accent)' }}
          >
            View All ({activities.length})
          </button>
        )}
      </div>
      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <Skeleton height="20px" width="50px" />
              <Skeleton height="14px" width="100%" />
            </div>
          ))}
        </div>
      ) : activities.length === 0 ? (
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
          No activity yet. Events will appear here as Regent processes your emails.
        </p>
      ) : (
        <ul className="space-y-0">
          {visible.map((entry, index) => (
            <ActivityEntry key={entry.id} entry={entry} index={index} />
          ))}
        </ul>
      )}
    </Card>

    {/* Full Activity Modal */}
    {showAll && (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
        onClick={() => setShowAll(false)}
      >
        <div
          className="w-full max-w-2xl max-h-[80vh] flex flex-col"
          style={{
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border-default)',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Modal header */}
          <div
            className="flex items-center justify-between px-6 py-4 flex-shrink-0"
            style={{ borderBottom: '1px solid var(--border-default)' }}
          >
            <div>
              <h3
                className="font-display text-lg"
                style={{ color: 'var(--text-primary)' }}
              >
                All Recent Activity
              </h3>
              <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                {activities.length} events
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowAll(false)}
              className="p-2 transition-colors"
              style={{ color: 'var(--text-muted)' }}
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Modal body */}
          <div className="overflow-y-auto px-6 py-2">
            <ul className="space-y-0">
              {activities.map((entry, index) => (
                <ActivityEntry key={entry.id} entry={entry} index={index} />
              ))}
            </ul>
          </div>
        </div>
      </div>
    )}
    </>
  )
}
