'use client'

import { useState, useEffect } from 'react'
import { Brain, PenLine, BookOpen, Clock } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { api } from '@/lib/api'
import { formatRelativeTime } from '@/lib/utils'
import type { MemoryHealthData } from '@/types/analytics'

interface MemoryStat {
  label: string
  value: string | number
  icon: React.ComponentType<{ size?: number; style?: React.CSSProperties; 'aria-hidden'?: boolean | 'true' | 'false' }>
}

function buildMemoryStats(data: MemoryHealthData | null): MemoryStat[] {
  return [
    {
      label: 'Learned Patterns',
      value: (data?.learned_patterns ?? 0).toLocaleString(),
      icon: Brain,
    },
    {
      label: 'User Corrections',
      value: (data?.user_corrections ?? 0).toLocaleString(),
      icon: PenLine,
    },
    {
      label: 'Active Rules',
      value: (data?.active_rules ?? 0).toLocaleString(),
      icon: BookOpen,
    },
  ]
}

export function MemoryHealth() {
  const [data, setData] = useState<MemoryHealthData | null>(null)

  useEffect(() => {
    let cancelled = false

    async function fetchMemoryHealth() {
      try {
        const result = await api.get<MemoryHealthData>('/analytics/memory-health')
        if (!cancelled && result) {
          setData(result)
        }
      } catch {
        // Memory health fetch failed — show zeroes
      }
    }

    fetchMemoryHealth()
    return () => { cancelled = true }
  }, [])

  const memoryStats = buildMemoryStats(data)
  const lastUpdated = data?.last_updated
    ? formatRelativeTime(data.last_updated)
    : null

  return (
    <Card padding="lg">
      <div className="flex items-center justify-between mb-4">
        <h2
          className="font-display text-lg"
          style={{ color: 'var(--text-primary)' }}
        >
          AI Memory Health
        </h2>
        {lastUpdated && (
          <div className="flex items-center gap-1.5">
            <Clock
              size={12}
              style={{ color: 'var(--text-muted)' }}
              aria-hidden="true"
            />
            <span
              className="text-xs"
              style={{ color: 'var(--text-muted)' }}
            >
              Updated {lastUpdated}
            </span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {memoryStats.map(({ label, value, icon: Icon }) => (
          <div
            key={label}
            className="flex items-center gap-4 p-4"
            style={{
              backgroundColor: 'var(--bg-secondary)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 0,
            }}
          >
            <div
              className="flex items-center justify-center w-10 h-10 flex-shrink-0"
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
            <div>
              <p
                className="font-display text-2xl font-bold leading-tight"
                style={{ color: 'var(--text-primary)' }}
              >
                {value}
              </p>
              <p
                className="text-xs mt-0.5 font-medium"
                style={{ color: 'var(--text-muted)' }}
              >
                {label}
              </p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}
