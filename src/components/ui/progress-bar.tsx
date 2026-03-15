'use client'

import { cn } from '@/lib/utils'

interface ProgressBarProps {
  value: number
  label?: string
  showPercent?: boolean
  className?: string
}

function ProgressBar({ value, label, showPercent = false, className }: ProgressBarProps) {
  const clampedValue = Math.max(0, Math.min(100, value))
  const isWarning = clampedValue > 90

  return (
    <div className={cn('w-full', className)}>
      {(label || showPercent) && (
        <div className="mb-1.5 flex items-center justify-between">
          {label && (
            <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
              {label}
            </span>
          )}
          {showPercent && (
            <span className="text-sm tabular-nums" style={{ color: 'var(--text-muted)' }}>
              {Math.round(clampedValue)}%
            </span>
          )}
        </div>
      )}
      <div
        className="h-2 w-full overflow-hidden"
        style={{
          borderRadius: 0,
          backgroundColor: 'var(--bg-secondary)',
        }}
      >
        <div
          className="h-full transition-all duration-300 ease-out"
          style={{
            borderRadius: 0,
            width: `${clampedValue}%`,
            backgroundColor: isWarning ? 'var(--color-critical)' : 'var(--accent)',
          }}
        />
      </div>
    </div>
  )
}

export { ProgressBar, type ProgressBarProps }
