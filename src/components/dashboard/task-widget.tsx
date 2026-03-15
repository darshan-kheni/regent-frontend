'use client'

import { AlertTriangle, CheckSquare, Clock } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useTaskDigest } from '@/hooks/use-tasks'

export function TaskWidget() {
  const { digest, isLoading } = useTaskDigest()

  if (isLoading) {
    return (
      <Card padding="lg">
        <Skeleton height="20px" width="60px" className="mb-3" />
        <div className="space-y-2">
          <Skeleton height="16px" width="120px" />
          <Skeleton height="16px" width="100px" />
          <Skeleton height="16px" width="140px" />
        </div>
      </Card>
    )
  }

  if (!digest) return null

  return (
    <Card padding="lg">
      <h3
        className="font-display text-base mb-3"
        style={{ color: 'var(--text-primary)' }}
      >
        Tasks
      </h3>
      <div className="space-y-2">
        {digest.overdue_count > 0 && (
          <div className="flex items-center gap-2 text-sm">
            <AlertTriangle
              className="h-4 w-4"
              style={{ color: 'var(--color-critical)' } as React.CSSProperties}
            />
            <span
              className="font-medium"
              style={{ color: 'var(--color-critical)' }}
            >
              {digest.overdue_count} overdue
            </span>
          </div>
        )}
        <div className="flex items-center gap-2 text-sm">
          <Clock
            className="h-4 w-4"
            style={{ color: 'var(--accent)' } as React.CSSProperties}
          />
          <span style={{ color: 'var(--text-primary)' }}>
            {digest.due_today_count} due today
          </span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <CheckSquare
            className="h-4 w-4"
            style={{ color: 'var(--text-muted)' } as React.CSSProperties}
          />
          <span style={{ color: 'var(--text-muted)' }}>
            {digest.due_this_week_count} this week
          </span>
        </div>
        {digest.delegated_waiting > 0 && (
          <div className="flex items-center gap-2 text-sm">
            <span
              className="h-4 w-4 text-center text-xs"
              style={{ color: 'var(--text-muted)' }}
            >
              &rarr;
            </span>
            <span style={{ color: 'var(--text-muted)' }}>
              {digest.delegated_waiting} delegated
            </span>
          </div>
        )}
      </div>
    </Card>
  )
}
