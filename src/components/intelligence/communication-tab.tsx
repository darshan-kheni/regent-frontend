'use client'

import { useState } from 'react'
import { Card, Skeleton } from '@/components/ui'
import { ToneChart } from './tone-chart'
import { HourlyHistogram } from './hourly-histogram'
import { useCommunication } from '@/hooks/use-behavior-data'
import { PlanGateOverlay } from './plan-gate-overlay'

interface CommunicationTabProps {
  planGated?: boolean
}

type Period = 'daily' | 'weekly' | 'monthly'

function CommunicationTab({ planGated }: CommunicationTabProps) {
  const [period, setPeriod] = useState<Period>('daily')
  const { data, isLoading } = useCommunication(period)

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
        <Skeleton height="40px" width="240px" />
        <Skeleton height="200px" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} height="80px" />)}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Period Selector */}
      <div className="flex gap-2">
        {(['daily', 'weekly', 'monthly'] as Period[]).map((p) => (
          <button
            key={p}
            onClick={() => setPeriod(p)}
            className="px-3 py-1.5 text-xs font-medium transition-colors"
            style={{
              borderRadius: 0,
              backgroundColor: p === period ? 'var(--accent)' : 'var(--bg-secondary)',
              color: p === period ? '#1a1a1a' : 'var(--text-muted)',
            }}
          >
            {p.charAt(0).toUpperCase() + p.slice(1)}
          </button>
        ))}
      </div>

      {!data ? (
        <div className="py-8 text-center text-sm" style={{ color: 'var(--text-muted)' }}>
          No communication data yet
        </div>
      ) : (
        <>
          {/* Tone Distribution */}
          <Card>
            <p className="text-xs font-medium mb-3" style={{ color: 'var(--text-muted)' }}>
              Tone Distribution
            </p>
            <ToneChart distribution={data.tone_distribution} />
          </Card>

          {/* Metrics Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card padding="sm">
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Avg Response</p>
              <p className="font-display text-xl" style={{ color: 'var(--text-primary)' }}>
                {data.avg_response_time_minutes > 0 ? `${Math.round(data.avg_response_time_minutes)}m` : '—'}
              </p>
            </Card>
            <Card padding="sm">
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Avg Length</p>
              <p className="font-display text-xl" style={{ color: 'var(--text-primary)' }}>
                {data.avg_email_length_words > 0 ? `${data.avg_email_length_words} words` : '—'}
              </p>
            </Card>
            <Card padding="sm">
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Sent / Received</p>
              <p className="font-display text-xl" style={{ color: 'var(--text-primary)' }}>
                {data.emails_sent} / {data.emails_received}
              </p>
            </Card>
            <Card padding="sm">
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>After Hours</p>
              <p className="font-display text-xl" style={{ color: 'var(--text-primary)' }}>
                {data.after_hours_pct.toFixed(0)}%
              </p>
            </Card>
          </div>

          {/* Peak Hours */}
          <Card>
            <p className="text-xs font-medium mb-3" style={{ color: 'var(--text-muted)' }}>
              Peak Hours
            </p>
            <HourlyHistogram hours={data.peak_hours} />
          </Card>
        </>
      )}
    </div>
  )
}

export { CommunicationTab }
