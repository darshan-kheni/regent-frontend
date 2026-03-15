'use client'

import { Card } from '@/components/ui/card'
import { ProgressBar } from '@/components/ui/progress-bar'
import { formatTokenCount } from '@/lib/utils'
import type { AnalyticsData } from '@/types/analytics'
import type { AnalyticsPeriod } from '@/hooks/use-analytics'

interface TokenHeroProps {
  data: AnalyticsData
  period: AnalyticsPeriod
}

const periodLabels: Record<AnalyticsPeriod, string> = {
  today: 'Today',
  week: 'This Week',
  month: 'This Month',
}

function MiniBarChart({ trend }: { trend?: { date: string; tokens: number }[] }) {
  const safeData = trend ?? []
  if (safeData.length === 0) return null

  const maxVal = Math.max(...safeData.map((d) => d?.tokens ?? 0), 1)

  return (
    <div className="flex items-end gap-1.5" style={{ height: 80 }}>
      {safeData.slice(-7).map((entry, i) => {
        const tokens = entry?.tokens ?? 0
        const height = maxVal > 0 ? (tokens / maxVal) * 100 : 0
        const isLast = i === safeData.slice(-7).length - 1
        return (
          <div
            key={entry?.date ?? i}
            className="flex-1 flex flex-col items-center justify-end gap-1"
            style={{ height: '100%' }}
          >
            {tokens > 0 && (
              <span
                className="text-[8px] font-mono leading-none"
                style={{ color: 'var(--text-muted)' }}
              >
                {tokens >= 1000 ? `${(tokens / 1000).toFixed(1)}K` : tokens}
              </span>
            )}
            <div
              className="w-full transition-all duration-300"
              style={{
                height: tokens > 0 ? `${Math.max(height, 8)}%` : 3,
                backgroundColor: tokens > 0 ? 'var(--accent)' : 'var(--border-default)',
                borderRadius: 0,
                opacity: isLast ? 1 : tokens > 0 ? 0.7 : 0.3,
              }}
            />
            <span
              className="text-[9px] leading-none"
              style={{ color: isLast ? 'var(--text-secondary)' : 'var(--text-muted)' }}
            >
              {(entry?.date ?? '').slice(-2)}
            </span>
          </div>
        )
      })}
    </div>
  )
}

export function TokenHero({ data, period }: TokenHeroProps) {
  const tokensUsed = data?.tokens_used ?? 0
  const tokensLimit = data?.tokens_limit ?? 0
  const planName = data?.plan_name ?? 'Free'
  const usagePercent = tokensLimit > 0
    ? (tokensUsed / tokensLimit) * 100
    : 0

  return (
    <Card padding="lg">
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
        {/* Left: token count and progress */}
        <div className="flex-1">
          <p
            className="text-sm font-medium mb-1"
            style={{ color: 'var(--text-muted)' }}
          >
            Token Usage — {periodLabels[period] ?? 'Today'}
          </p>

          <p
            className="font-display text-5xl lg:text-6xl font-bold leading-tight"
            style={{ color: 'var(--text-primary)' }}
          >
            {formatTokenCount(tokensUsed)}
          </p>

          <div className="flex items-center gap-2 mt-1">
            <span
              className="text-sm"
              style={{ color: 'var(--text-muted)' }}
            >
              of {formatTokenCount(tokensLimit)}
            </span>
            <span
              className="text-xs font-medium px-2 py-0.5"
              style={{
                backgroundColor: 'rgba(201,169,110,0.15)',
                color: 'var(--accent)',
                borderRadius: 0,
              }}
            >
              {planName}
            </span>
          </div>

          <div className="mt-4">
            <ProgressBar
              value={usagePercent}
              showPercent
            />
          </div>
        </div>

        {/* Right: mini 7-day bar chart */}
        <div className="lg:w-48 flex-shrink-0">
          <p
            className="text-xs font-medium mb-1"
            style={{ color: 'var(--text-secondary)' }}
          >
            7-Day Trend
          </p>
          <MiniBarChart trend={data?.trend} />
        </div>
      </div>
    </Card>
  )
}
