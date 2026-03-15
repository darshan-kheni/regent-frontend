'use client'

import { useEffect, useState } from 'react'

interface ScoreRingProps {
  score: number
  label: string
  size?: number
}

function getScoreColor(score: number): string {
  if (score >= 70) return '#22c55e'
  if (score >= 50) return '#C9A96E'
  return '#ef4444'
}

function ScoreRing({ score, label, size = 120 }: ScoreRingProps) {
  const [animatedScore, setAnimatedScore] = useState(0)
  const strokeWidth = 8
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (animatedScore / 100) * circumference

  useEffect(() => {
    const timer = setTimeout(() => setAnimatedScore(score), 100)
    return () => clearTimeout(timer)
  }, [score])

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="var(--border-subtle)"
            strokeWidth={strokeWidth}
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={getScoreColor(score)}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="butt"
            style={{ transition: 'stroke-dashoffset 1s ease-out' }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span
            className="font-display text-3xl"
            style={{ color: getScoreColor(score) }}
          >
            {score}
          </span>
        </div>
      </div>
      <span className="text-sm" style={{ color: 'var(--text-muted)' }}>
        {label}
      </span>
    </div>
  )
}

export { ScoreRing }
