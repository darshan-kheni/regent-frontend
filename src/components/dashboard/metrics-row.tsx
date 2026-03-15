'use client'

import { Mail, Clock, Sparkles, MessageSquareReply } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import type { DashboardStats } from '@/types/analytics'

interface MetricsRowProps {
  stats: DashboardStats | null
  isLoading: boolean
}

interface MetricDef {
  key: 'emails_today' | 'pending_replies' | 'ai_composed' | 'avg_response_minutes'
  label: string
  icon: typeof Mail
  format: (v: number | null) => string
}

const metrics: MetricDef[] = [
  {
    key: 'emails_today',
    label: 'Processed',
    icon: Mail,
    format: (v) => String(v ?? 0),
  },
  {
    key: 'pending_replies',
    label: 'Pending',
    icon: Clock,
    format: (v) => String(v ?? 0),
  },
  {
    key: 'ai_composed',
    label: 'AI Composed',
    icon: Sparkles,
    format: (v) => String(v ?? 0),
  },
  {
    key: 'avg_response_minutes',
    label: 'Avg AI Speed',
    icon: MessageSquareReply,
    format: (v) => {
      if (v == null || v === 0) return '--'
      if (v < 1) return `${Math.round(v * 1000)}ms`
      return `${Number(v).toFixed(1)}s`
    },
  },
]

export function MetricsRow({ stats, isLoading }: MetricsRowProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map(({ key, label, icon: Icon, format }) => (
        <Card key={key} padding="lg">
          <div className="flex items-center justify-between">
            <div>
              {isLoading ? (
                <>
                  <Skeleton height="40px" width="72px" className="mb-2" />
                  <Skeleton height="14px" width="100px" />
                </>
              ) : (
                <>
                  <p
                    className="font-display text-4xl"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    {format(stats ? stats[key] : null)}
                  </p>
                  <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
                    {label}
                  </p>
                </>
              )}
            </div>
            <Icon
              size={24}
              style={{ color: 'var(--accent-gold)' }}
              aria-hidden="true"
            />
          </div>
        </Card>
      ))}
    </div>
  )
}
