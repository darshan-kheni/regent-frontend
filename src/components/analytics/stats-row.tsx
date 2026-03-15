'use client'

import { Sparkles, Clock, Database, ThumbsUp } from 'lucide-react'
import { Card } from '@/components/ui/card'
import type { AnalyticsData } from '@/types/analytics'

interface StatsRowProps {
  data: AnalyticsData
}

function formatLatency(ms: number | null | undefined): string {
  const val = ms ?? 0
  if (val >= 1000) return `${(val / 1000).toFixed(1)}s`
  return `${Math.round(val)}ms`
}

const stats = [
  {
    key: 'ai_calls' as const,
    label: 'Total AI Calls',
    icon: Sparkles,
    format: (v: number) => (v ?? 0).toLocaleString(),
  },
  {
    key: 'avg_latency_ms' as const,
    label: 'Avg Latency',
    icon: Clock,
    format: (v: number) => formatLatency(v),
  },
  {
    key: 'cache_hit_rate' as const,
    label: 'Cache Hit Rate',
    icon: Database,
    format: (v: number) => `${Math.round(v ?? 0)}%`,
  },
  {
    key: 'draft_acceptance_rate' as const,
    label: 'Draft Accept Rate',
    icon: ThumbsUp,
    format: (v: number) => `${Math.round(v ?? 0)}%`,
  },
]

export function StatsRow({ data }: StatsRowProps) {
  if (!data) return null

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map(({ key, label, icon: Icon, format }) => (
        <Card key={key} padding="lg">
          <div className="flex items-center justify-between">
            <div>
              <p
                className="font-display text-3xl font-bold"
                style={{ color: 'var(--text-primary)' }}
              >
                {format(data[key] ?? 0)}
              </p>
              <p
                className="text-xs mt-1.5 font-medium uppercase tracking-wide"
                style={{ color: 'var(--text-muted)' }}
              >
                {label}
              </p>
            </div>
            <div
              className="flex items-center justify-center w-10 h-10"
              style={{
                backgroundColor: 'rgba(201,169,110,0.1)',
                borderRadius: 0,
              }}
            >
              <Icon
                size={20}
                style={{ color: 'var(--accent-gold, var(--accent))' }}
                aria-hidden="true"
              />
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}
