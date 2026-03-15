'use client'

import { useAnalytics } from '@/hooks/use-analytics'
import { TokenHero } from '@/components/analytics/token-hero'
import { StatsRow } from '@/components/analytics/stats-row'
import { ServiceBreakdown } from '@/components/analytics/service-breakdown'
import { MemoryHealth } from '@/components/analytics/memory-health'
import { PlanComparison } from '@/components/analytics/plan-comparison'
import { ExportButton } from '@/components/analytics/export-button'
import { Skeleton } from '@/components/ui/skeleton'
import type { AnalyticsPeriod } from '@/hooks/use-analytics'

const periodTabs: { id: AnalyticsPeriod; label: string }[] = [
  { id: 'today', label: 'Today' },
  { id: 'week', label: 'Week' },
  { id: 'month', label: 'Month' },
]

export default function AnalyticsPage() {
  const { data, services, period, setPeriod, isLoading } = useAnalytics()

  if (isLoading) {
    return (
      <div className="p-6 lg:p-8 space-y-6">
        <h1
          className="font-display text-3xl"
          style={{ color: 'var(--text-primary)' }}
        >
          Analytics
        </h1>
        <Skeleton height="48px" />
        <Skeleton height="240px" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} height="96px" />
          ))}
        </div>
        <Skeleton height="200px" />
        <Skeleton height="120px" />
        <Skeleton height="120px" />
      </div>
    )
  }

  if (!data) {
    return (
      <div className="p-6 lg:p-8 space-y-6">
        <h1
          className="font-display text-3xl"
          style={{ color: 'var(--text-primary)' }}
        >
          Analytics
        </h1>
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            No usage data yet. Analytics populate as you use Regent.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* Header with title and export */}
      <div className="flex items-center justify-between">
        <h1
          className="font-display text-3xl"
          style={{ color: 'var(--text-primary)' }}
        >
          Analytics
        </h1>
        <ExportButton data={data} services={services} period={period} />
      </div>

      {/* Period Tab Bar */}
      <div
        className="flex gap-0"
        role="tablist"
        style={{ borderBottom: '1px solid var(--border-default)' }}
      >
        {periodTabs.map((tab) => {
          const isActive = tab.id === period
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              className="relative px-5 py-2.5 text-sm font-medium whitespace-nowrap transition-colors focus:outline-none"
              style={{
                color: isActive ? 'var(--accent)' : 'var(--text-muted)',
                backgroundColor: 'transparent',
                borderRadius: 0,
              }}
              onClick={() => setPeriod(tab.id)}
            >
              {tab.label}
              {isActive && (
                <span
                  className="absolute bottom-0 left-0 right-0 h-0.5"
                  style={{ backgroundColor: 'var(--accent)' }}
                />
              )}
            </button>
          )
        })}
      </div>

      {/* Token Usage Hero Card */}
      <TokenHero data={data} period={period} />

      {/* Stats Row */}
      <StatsRow data={data} />

      {/* Service Breakdown */}
      <ServiceBreakdown services={services} />

      {/* AI Memory Health */}
      <MemoryHealth />

      {/* Token Limits by Plan */}
      <PlanComparison currentPlan={data.plan_name} />
    </div>
  )
}
