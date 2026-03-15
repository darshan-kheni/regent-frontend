'use client'

import { Card } from '@/components/ui/card'
import { Sparkles } from 'lucide-react'

interface AISummaryProps {
  summary: string
}

function AISummary({ summary }: AISummaryProps) {
  return (
    <Card padding="md" className="mb-6" >
      <div style={{ borderLeft: '3px solid var(--accent)', paddingLeft: '16px' }}>
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="h-4 w-4" style={{ color: 'var(--accent)' }} />
          <span
            className="text-xs font-medium uppercase tracking-wider"
            style={{ color: 'var(--text-muted)' }}
          >
            AI Summary
          </span>
        </div>
        <p
          className="text-sm leading-relaxed"
          style={{ color: 'var(--text-secondary)' }}
        >
          {summary}
        </p>
      </div>
    </Card>
  )
}

export { AISummary, type AISummaryProps }
