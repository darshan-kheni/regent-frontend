'use client'

import { Card } from '@/components/ui/card'
import { Badge, type BadgeVariant } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { formatRelativeTime } from '@/lib/utils'
import type { AuditEntry, AuditEventType } from '@/types/analytics'

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

export function ActivityFeed({ activities, isLoading }: ActivityFeedProps) {
  return (
    <Card padding="lg">
      <h2
        className="font-display text-lg mb-4"
        style={{ color: 'var(--text-primary)' }}
      >
        Recent Activity
      </h2>
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
        <ul className="space-y-3">
          {activities.map((entry, index) => {
            const badgeVariant = eventBadgeMap[entry.event_type] ?? 'muted'
            const badgeLabel = eventLabelMap[entry.event_type] ?? entry.event_type
            return (
              <li
                key={entry.id}
                className="flex items-start gap-3 text-sm"
                style={{
                  animation: index === 0 ? 'fadeSlideIn 0.3s ease-out' : undefined,
                }}
              >
                <Badge variant={badgeVariant} className="shrink-0 mt-0.5">
                  {badgeLabel}
                </Badge>
                <span className="flex-1" style={{ color: 'var(--text-secondary)' }}>
                  {entry.description}
                </span>
                <span
                  className="shrink-0 text-xs whitespace-nowrap"
                  style={{ color: 'var(--text-muted)' }}
                >
                  {formatRelativeTime(entry.created_at)}
                </span>
              </li>
            )
          })}
        </ul>
      )}
    </Card>
  )
}
