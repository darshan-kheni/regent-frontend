'use client'

import { Card } from '@/components/ui'

interface ReplyStatsProps {
  stats: {
    approvalRate: number
    avgEditDistance: number
    pendingCount: number
  }
}

export function ReplyStats({ stats }: ReplyStatsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <Card padding="md">
        <p className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>
          Approval Rate
        </p>
        <p className="mt-1 text-2xl font-display" style={{ color: 'var(--text-primary)' }}>
          {stats.approvalRate}%
        </p>
      </Card>

      <Card padding="md">
        <p className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>
          Avg Edit Distance
        </p>
        <p className="mt-1 text-2xl font-display" style={{ color: 'var(--text-primary)' }}>
          {stats.avgEditDistance}
        </p>
      </Card>

      <Card padding="md">
        <p className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>
          Pending Count
        </p>
        <p className="mt-1 text-2xl font-display" style={{ color: 'var(--text-primary)' }}>
          {stats.pendingCount}
        </p>
      </Card>
    </div>
  )
}
