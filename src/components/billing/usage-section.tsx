'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui'
import { api } from '@/lib/api'

interface ProcessRow {
  name: string
  model: string
  calls: number
  tokens: string
  quota: string
  percent: number
  category: 'ai' | 'infra'
}

interface SummaryCard {
  label: string
  value: string
  limit: string
  percent: number
  unit: string
}

interface UsageResponse {
  processes: ProcessRow[]
  summary: SummaryCard[]
}

export function UsageSection() {
  const [period, setPeriod] = useState<'today' | 'month'>('today')
  const [loading, setLoading] = useState(true)
  const [processes, setProcesses] = useState<ProcessRow[]>([])
  const [summary, setSummary] = useState<SummaryCard[]>([])

  useEffect(() => {
    let cancelled = false
    async function load() {
      setLoading(true)
      try {
        const data = await api.get<UsageResponse>(`/analytics/usage?period=${period}`)
        if (!cancelled && data) {
          setProcesses(data.processes ?? [])
          setSummary(data.summary ?? [])
        }
      } catch {
        if (!cancelled) {
          setProcesses([])
          setSummary([])
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [period])

  return (
    <div>
      {/* Period tabs */}
      <div className="flex gap-0 mb-4" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
        {([
          { id: 'today' as const, label: 'Today' },
          { id: 'month' as const, label: 'This Month' },
        ]).map((tab) => (
          <div
            key={tab.id}
            onClick={() => setPeriod(tab.id)}
            className="cursor-pointer transition-all"
            style={{
              padding: '9px 18px',
              fontSize: 12,
              fontWeight: period === tab.id ? 600 : 400,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: period === tab.id ? 'var(--accent)' : 'var(--text-muted)',
              borderBottom: period === tab.id ? '2px solid var(--accent)' : '2px solid transparent',
              marginBottom: -1,
            }}
          >
            {tab.label}
          </div>
        ))}
      </div>

      {loading ? (
        <div className="space-y-3">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {[1, 2, 3, 4].map((n) => (
              <Card key={n} padding="md">
                <div className="h-20 animate-pulse" style={{ backgroundColor: 'var(--bg-secondary)' }} />
              </Card>
            ))}
          </div>
          <Card className="!p-0">
            <div className="h-64 animate-pulse" style={{ backgroundColor: 'var(--bg-secondary)' }} />
          </Card>
        </div>
      ) : processes.length === 0 && summary.length === 0 ? (
        <Card padding="md">
          <div className="py-12 text-center">
            <span className="text-sm" style={{ color: 'var(--text-muted)' }}>
              No usage data available yet
            </span>
          </div>
        </Card>
      ) : (
        <>
          {/* Summary cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
            {summary.map((card) => (
              <Card key={card.label} padding="md">
                <div
                  className="text-[8px] font-semibold tracking-[0.12em] uppercase mb-2"
                  style={{ color: 'var(--text-muted)' }}
                >
                  {card.label}
                </div>
                <div className="flex items-baseline gap-1 mt-2">
                  <span
                    className="font-display text-[26px] font-light"
                    style={{ color: card.percent > 85 ? '#E8A838' : 'var(--text-primary)' }}
                  >
                    {card.value}
                  </span>
                  {card.limit !== '\u221e' && (
                    <span className="text-[12px]" style={{ color: 'var(--text-muted)' }}>
                      / {card.limit}
                    </span>
                  )}
                </div>
                {/* Mini progress bar */}
                <div className="mt-2" style={{ height: 3, backgroundColor: 'var(--bg-secondary)' }}>
                  <div
                    style={{
                      height: 3,
                      width: `${Math.min(card.percent, 100)}%`,
                      backgroundColor: card.percent > 85 ? '#E8A838' : 'var(--accent)',
                    }}
                  />
                </div>
                <div className="flex justify-between items-center mt-1.5">
                  <span
                    className="text-[11px] font-semibold"
                    style={{ color: card.percent > 85 ? '#E8A838' : 'var(--accent)' }}
                  >
                    {card.percent}%
                  </span>
                  <span className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
                    {card.limit === '\u221e' ? 'Unlimited' : card.limit + card.unit}
                  </span>
                </div>
              </Card>
            ))}
          </div>

          {/* Full process breakdown */}
          <Card className="!p-0">
            {/* Header */}
            <div
              className="flex items-center px-5 py-3"
              style={{
                borderBottom: '1px solid var(--border-subtle)',
                backgroundColor: 'var(--bg-secondary)',
              }}
            >
              <span className="flex-1 text-[10px] font-semibold tracking-[0.1em] uppercase" style={{ color: 'var(--text-muted)' }}>
                Process
              </span>
              <span className="hidden md:block w-[140px] text-[10px] font-semibold tracking-[0.1em] uppercase" style={{ color: 'var(--text-muted)' }}>
                Usage
              </span>
              <span className="w-[80px] text-right text-[10px] font-semibold tracking-[0.1em] uppercase" style={{ color: 'var(--text-muted)' }}>
                Calls
              </span>
              <span className="w-[80px] text-right text-[10px] font-semibold tracking-[0.1em] uppercase" style={{ color: 'var(--text-muted)' }}>
                Tokens
              </span>
            </div>

            {/* Rows */}
            {processes.map((row, i) => {
              const isUnlimited = row.quota === '\u221e'
              const isInactive = row.calls === 0

              return (
                <div
                  key={i}
                  className="px-5 py-3"
                  style={{ borderBottom: '1px solid var(--border-subtle)' }}
                >
                  <div className="flex items-center mb-1.5">
                    {/* Name + model */}
                    <div className="flex-1 flex items-center gap-2 min-w-0">
                      <div
                        className="w-1.5 h-1.5 flex-shrink-0"
                        style={{
                          backgroundColor: row.category === 'ai' ? 'var(--accent)' : '#7EA3C2',
                        }}
                      />
                      <div className="min-w-0">
                        <span
                          className="text-[13px]"
                          style={{
                            color: isInactive ? 'var(--text-muted)' : 'var(--text-secondary)',
                            fontWeight: isInactive ? 400 : 500,
                          }}
                        >
                          {row.name}
                        </span>
                        <span className="text-[10px] ml-2" style={{ color: 'var(--text-muted)' }}>
                          {row.model}
                        </span>
                      </div>
                    </div>

                    {/* Usage percentage */}
                    <div className="hidden md:flex w-[140px] items-center gap-1.5">
                      {row.percent > 0 ? (
                        <span
                          className="text-[11px] font-semibold min-w-[28px]"
                          style={{
                            color: row.percent > 85 ? '#E8A838' :
                                   row.percent > 60 ? 'var(--accent)' :
                                   'var(--text-secondary)',
                          }}
                        >
                          {row.percent}%
                        </span>
                      ) : (
                        <span
                          className="min-w-[28px]"
                          style={{
                            fontSize: isUnlimited ? 20 : 11,
                            color: isUnlimited ? 'var(--accent)' : 'var(--text-muted)',
                            fontWeight: 400,
                          }}
                        >
                          {isUnlimited ? '\u221e' : '0%'}
                        </span>
                      )}
                      <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                        of {isUnlimited ? (
                          <span style={{ fontSize: 20, color: 'var(--accent)', fontWeight: 400 }}>
                            {'\u221e'}
                          </span>
                        ) : row.quota}
                      </span>
                    </div>

                    {/* Calls */}
                    <span
                      className="w-[80px] text-right text-[13px] font-medium"
                      style={{ color: isInactive ? 'var(--text-muted)' : 'var(--text-secondary)' }}
                    >
                      {row.calls.toLocaleString()}
                    </span>

                    {/* Tokens */}
                    <span
                      className="w-[80px] text-right text-[13px]"
                      style={{
                        color: !row.tokens || row.tokens === '0' ? 'var(--text-muted)' : 'var(--text-secondary)',
                      }}
                    >
                      {row.tokens}
                    </span>
                  </div>

                  {/* Per-row progress bar */}
                  <div className="flex items-center gap-2 ml-3.5">
                    <div className="flex-1" style={{ height: 2, backgroundColor: 'var(--bg-secondary)' }}>
                      <div
                        className="transition-all duration-300"
                        style={{
                          height: 2,
                          width: row.percent > 0 && !isUnlimited
                            ? `${Math.min(row.percent, 100)}%`
                            : (row.calls > 0 && isUnlimited ? '100%' : '0%'),
                          backgroundColor: isUnlimited
                            ? 'rgba(201,169,110,0.25)'
                            : row.percent > 85 ? '#E8A838'
                            : row.percent > 60 ? 'var(--accent)'
                            : '#6FAD76',
                        }}
                      />
                    </div>
                  </div>
                </div>
              )
            })}

            {/* Legend */}
            <div
              className="flex gap-5 px-5 py-2.5 flex-wrap"
              style={{ fontSize: 11, color: 'var(--text-muted)' }}
            >
              <span className="flex items-center gap-2.5">
                <div className="w-1.5 h-1.5" style={{ backgroundColor: 'var(--accent)' }} />
                AI Process
              </span>
              <span className="flex items-center gap-2.5">
                <div className="w-1.5 h-1.5" style={{ backgroundColor: '#7EA3C2' }} />
                Infrastructure
              </span>
              <span className="flex items-center gap-2.5">
                <div className="w-3 h-0.5" style={{ backgroundColor: 'rgba(201,169,110,0.25)' }} />
                Unlimited
              </span>
              <span className="ml-auto">0% = module not yet active</span>
            </div>
          </Card>
        </>
      )}
    </div>
  )
}
