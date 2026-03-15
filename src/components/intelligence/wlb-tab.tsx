'use client'

import Link from 'next/link'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { Card, Skeleton } from '@/components/ui'
import { ScoreRing } from './score-ring'
import { PlanGateOverlay } from './plan-gate-overlay'
import type { WLBData } from '@/types/behavior'

interface WLBTabProps {
  data: WLBData | null
  isLoading: boolean
  planGated?: boolean
}

function WLBTab({ data, isLoading, planGated }: WLBTabProps) {
  if (planGated) {
    return (
      <div className="relative min-h-[400px]">
        <PlanGateOverlay requiredPlan="privy_council" />
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-center"><Skeleton width="160px" height="160px" /></div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} height="80px" />)}
        </div>
        <Skeleton height="200px" />
      </div>
    )
  }

  if (!data) {
    return (
      <div className="py-8 text-center text-sm" style={{ color: 'var(--text-muted)' }}>
        No work-life balance data yet
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Large Score Ring */}
      <div className="flex justify-center">
        <ScoreRing score={data.score} label="Work-Life Balance" size={160} />
      </div>

      {/* Penalty Breakdown */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card padding="sm">
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>After Hours</p>
          <p className="font-display text-xl" style={{ color: data.penalties.after_hours > 15 ? '#ef4444' : 'var(--text-primary)' }}>
            -{data.penalties.after_hours.toFixed(0)}
          </p>
        </Card>
        <Card padding="sm">
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Weekend</p>
          <p className="font-display text-xl" style={{ color: data.penalties.weekend > 10 ? '#ef4444' : 'var(--text-primary)' }}>
            -{data.penalties.weekend.toFixed(0)}
          </p>
        </Card>
        <Card padding="sm">
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Boundary</p>
          <p className="font-display text-xl" style={{ color: data.penalties.boundary > 15 ? '#ef4444' : 'var(--text-primary)' }}>
            -{data.penalties.boundary.toFixed(0)}
          </p>
        </Card>
        <Card padding="sm">
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Volume</p>
          <p className="font-display text-xl" style={{ color: data.penalties.volume > 0 ? '#C9A96E' : 'var(--text-primary)' }}>
            -{data.penalties.volume.toFixed(0)}
          </p>
        </Card>
      </div>

      {/* 7-Day Trend */}
      {data.trend_7d.length > 1 && (
        <Card>
          <p className="text-xs font-medium mb-3" style={{ color: 'var(--text-muted)' }}>
            7-Day Trend
          </p>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={data.trend_7d}>
              <XAxis
                dataKey="date"
                tick={{ fontSize: 10, fill: 'var(--text-muted)' }}
                tickFormatter={(v: string) => v.slice(5)}
              />
              <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: 'var(--text-muted)' }} width={30} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--bg-card)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 0,
                  fontSize: 12,
                }}
              />
              <Line type="monotone" dataKey="score" stroke="#C9A96E" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      )}

      {/* AI Recommendation */}
      {data.latest_recommendation && (
        <Card>
          <p className="text-xs font-medium mb-2" style={{ color: 'var(--accent)' }}>
            AI Recommendation
          </p>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            {data.latest_recommendation}
          </p>
        </Card>
      )}

      {/* Calibration Link */}
      <div className="text-center">
        <Link
          href="/settings"
          className="text-xs underline"
          style={{ color: 'var(--text-muted)' }}
        >
          Adjust WLB calibration in Settings
        </Link>
      </div>
    </div>
  )
}

export { WLBTab }
