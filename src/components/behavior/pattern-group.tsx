'use client'

import { Badge, Card } from '@/components/ui'
import { formatDate } from '@/lib/utils'
import type { LearnedPattern } from '@/types/ai-memory'
import type { BadgeVariant } from '@/components/ui'

interface PatternGroupProps {
  category: string
  patterns: LearnedPattern[]
}

function getConfidenceVariant(confidence: number): BadgeVariant {
  if (confidence > 90) return 'success'
  if (confidence > 70) return 'gold'
  return 'urgent'
}

const categoryLabels: Record<string, string> = {
  communication: 'Communication',
  priority: 'Priority',
  schedule: 'Schedule',
  reply: 'Reply',
}

function PatternGroup({ category, patterns }: PatternGroupProps) {
  const latestSynthesis = patterns
    .map((p) => new Date(p.created_at).getTime())
    .sort((a, b) => b - a)[0]

  return (
    <div className="space-y-3">
      <h3
        className="font-display text-lg"
        style={{ color: 'var(--text-primary)' }}
      >
        {categoryLabels[category] || category}
      </h3>

      <div className="space-y-2">
        {patterns.map((pattern) => (
          <Card key={pattern.id} padding="sm">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0 space-y-1">
                <p
                  className="text-sm"
                  style={{ color: 'var(--text-primary)' }}
                >
                  {pattern.pattern}
                </p>
                <span
                  className="text-xs font-mono"
                  style={{ color: 'var(--text-muted)' }}
                >
                  {pattern.data_source}
                </span>
              </div>
              <Badge variant={getConfidenceVariant(pattern.confidence)}>
                {pattern.confidence}%
              </Badge>
            </div>
          </Card>
        ))}
      </div>

      <Card padding="sm">
        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
          {latestSynthesis
            ? `Last synthesis: ${formatDate(new Date(latestSynthesis).toISOString())}`
            : 'No synthesis run yet'}
        </p>
      </Card>
    </div>
  )
}

export { PatternGroup }
