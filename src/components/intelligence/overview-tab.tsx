'use client'

import { Card, Skeleton } from '@/components/ui'
import { ScoreRing } from './score-ring'
import type { OverviewData } from '@/types/behavior'

interface OverviewTabProps {
  data: OverviewData | null
  isLoading: boolean
}

const stressColors: Record<string, string> = {
  ok: '#22c55e',
  warn: '#C9A96E',
  critical: '#ef4444',
}

const metricLabels: Record<string, string> = {
  response_time_trend: 'Response Time',
  late_night_activity: 'Late Night',
  email_volume: 'Email Volume',
  tone_consistency: 'Tone Shift',
  weekend_boundary: 'Weekend',
}

function OverviewTab({ data, isLoading }: OverviewTabProps) {
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex gap-8 justify-center">
          <Skeleton width="120px" height="120px" />
          <Skeleton width="120px" height="120px" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} height="80px" />
          ))}
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="py-12 text-center" style={{ color: 'var(--text-muted)' }}>
        No data yet. Behavior intelligence will appear after a few days of email activity.
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Score Rings */}
      <div className="flex gap-8 justify-center flex-wrap">
        <ScoreRing score={data.ai_understanding_score} label="AI Understanding" />
        <ScoreRing score={data.wlb_score} label="Work-Life Balance" />
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card padding="sm">
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Emails This Week</p>
          <p className="font-display text-2xl" style={{ color: 'var(--text-primary)' }}>
            {data.quick_stats.emails_this_week}
          </p>
        </Card>
        <Card padding="sm">
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Avg Response Time</p>
          <p className="font-display text-2xl" style={{ color: 'var(--text-primary)' }}>
            {data.quick_stats.avg_response_time_minutes > 0
              ? `${Math.round(data.quick_stats.avg_response_time_minutes)}m`
              : '—'}
          </p>
        </Card>
        <Card padding="sm">
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Top Contact</p>
          <p className="text-sm truncate" style={{ color: 'var(--text-primary)' }}>
            {data.quick_stats.top_contact || '—'}
          </p>
        </Card>
        <Card padding="sm">
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Streak Days</p>
          <p className="font-display text-2xl" style={{ color: 'var(--text-primary)' }}>
            {data.quick_stats.streak_days}
          </p>
        </Card>
      </div>

      {/* Wellness Insight */}
      {data.latest_wellness_report && (
        <Card>
          <p className="text-xs font-medium mb-2" style={{ color: 'var(--accent)' }}>
            Wellness Insight
          </p>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            {data.latest_wellness_report}
          </p>
        </Card>
      )}

      {/* Stress Indicators */}
      {data.stress_indicators.length > 0 && (
        <Card>
          <p className="text-xs font-medium mb-3" style={{ color: 'var(--text-muted)' }}>
            Stress Indicators
          </p>
          <div className="flex flex-wrap gap-4">
            {data.stress_indicators.map((si) => (
              <div key={si.metric} className="flex items-center gap-2">
                <div
                  className="w-2.5 h-2.5"
                  style={{
                    backgroundColor: stressColors[si.status] || stressColors.ok,
                    borderRadius: 9999,
                  }}
                />
                <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                  {metricLabels[si.metric] || si.metric}
                </span>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  )
}

export { OverviewTab }
