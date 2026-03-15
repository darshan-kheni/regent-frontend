'use client'

import { Card, Skeleton } from '@/components/ui'
import { HourlyHistogram } from './hourly-histogram'
import { PlanGateOverlay } from './plan-gate-overlay'
import type { ProductivityMetrics } from '@/types/behavior'

interface ProductivityTabProps {
  data: ProductivityMetrics | null
  isLoading: boolean
  planGated?: boolean
}

function ProductivityTab({ data, isLoading, planGated }: ProductivityTabProps) {
  if (planGated) {
    return (
      <div className="relative min-h-[400px]">
        <PlanGateOverlay requiredPlan="attache" />
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} height="100px" />)}
        </div>
        <Skeleton height="180px" />
      </div>
    )
  }

  if (!data) {
    return (
      <div className="py-8 text-center text-sm" style={{ color: 'var(--text-muted)' }}>
        No productivity data yet
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card padding="sm">
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Peak Day</p>
          <p className="font-display text-2xl" style={{ color: 'var(--accent)' }}>
            {data.peak_day || '—'}
          </p>
        </Card>
        <Card padding="sm">
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Decision Time</p>
          <p className="font-display text-2xl" style={{ color: 'var(--text-primary)' }}>
            {data.avg_decision_time_minutes != null ? `${Math.round(data.avg_decision_time_minutes)}m` : '—'}
          </p>
        </Card>
        <Card padding="sm">
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Delegation Rate</p>
          <p className="font-display text-2xl" style={{ color: 'var(--text-primary)' }}>
            {data.delegation_rate_pct.toFixed(0)}%
          </p>
        </Card>
        <Card padding="sm">
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Inbox Zero Days</p>
          <p className="font-display text-2xl" style={{ color: 'var(--text-primary)' }}>
            {data.inbox_zero_days}
          </p>
        </Card>
      </div>

      {/* Hourly Distribution */}
      <Card>
        <p className="text-xs font-medium mb-3" style={{ color: 'var(--text-muted)' }}>
          Hourly Distribution
        </p>
        <HourlyHistogram hours={data.hourly_distribution} />
      </Card>
    </div>
  )
}

export { ProductivityTab }
