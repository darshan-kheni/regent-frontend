'use client'

const toneColors: Record<string, string> = {
  professional: '#7EA3C2',
  warm_friendly: '#6FAD76',
  direct_concise: '#6E6660',
  formal_legal: '#9B7EBD',
  casual: '#C9A96E',
  urgent: '#D4645D',
}

const toneLabels: Record<string, string> = {
  professional: 'Professional',
  warm_friendly: 'Warm & Friendly',
  direct_concise: 'Direct & Concise',
  formal_legal: 'Formal / Legal',
  casual: 'Casual',
  urgent: 'Urgent',
}

interface ToneChartProps {
  distribution: Record<string, number>
}

function ToneChart({ distribution }: ToneChartProps) {
  const tones = Object.entries(distribution).sort((a, b) => b[1] - a[1])

  if (tones.length === 0) {
    return (
      <div className="py-8 text-center text-sm" style={{ color: 'var(--text-muted)' }}>
        No tone data yet
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {tones.map(([tone, pct]) => (
        <div key={tone} className="flex items-center gap-3">
          <span
            className="w-28 text-xs text-right flex-shrink-0"
            style={{ color: 'var(--text-secondary)' }}
          >
            {toneLabels[tone] || tone}
          </span>
          <div className="flex-1 h-5 relative" style={{ backgroundColor: 'var(--bg-secondary)' }}>
            <div
              className="h-full"
              style={{
                width: `${Math.min(pct, 100)}%`,
                backgroundColor: toneColors[tone] || 'var(--accent)',
                transition: 'width 0.5s ease-out',
              }}
            />
          </div>
          <span
            className="w-12 text-xs text-right flex-shrink-0"
            style={{ color: 'var(--text-muted)' }}
          >
            {pct.toFixed(0)}%
          </span>
        </div>
      ))}
    </div>
  )
}

export { ToneChart }
