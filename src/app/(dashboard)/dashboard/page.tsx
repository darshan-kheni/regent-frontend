'use client'

import { useMemo } from 'react'
import { format } from 'date-fns'
import { useDashboardData } from '@/hooks/use-dashboard-data'
import { useAuthStore } from '@/stores/auth-store'
import { MetricsRow } from '@/components/dashboard/metrics-row'
import { ConnectedAccounts } from '@/components/dashboard/connected-accounts'
import { RequiresAttention } from '@/components/dashboard/requires-attention'
import { ActivityFeed } from '@/components/dashboard/activity-feed'
import { CategoryChart } from '@/components/dashboard/category-chart'

function getGreeting(): string {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
}

export default function DashboardPage() {
  const { stats, activities, isLoading } = useDashboardData()
  const user = useAuthStore((s) => s.user)

  const greeting = useMemo(() => getGreeting(), [])
  const displayDate = useMemo(() => format(new Date(), 'EEEE, MMMM d, yyyy'), [])
  const firstName = user?.name?.split(' ')[0] ?? ''

  return (
    <div className="space-y-6 lg:px-[52px] lg:py-[44px]">
      {/* Greeting */}
      <div>
        <h1
          className="font-display text-3xl lg:text-4xl"
          style={{ color: 'var(--text-primary)' }}
        >
          {greeting}
          {firstName ? `, ${firstName}` : ''}
        </h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
          {stats?.emails_total ?? 0} emails processed | {stats?.pending_replies ?? 0} pending replies | {displayDate}
        </p>
      </div>

      {/* Stats Grid */}
      <MetricsRow stats={stats} isLoading={isLoading} />

      {/* Connected Accounts */}
      <ConnectedAccounts
        accounts={stats?.connected_accounts ?? []}
        isLoading={isLoading}
      />

      {/* Requires Attention + Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RequiresAttention
          emails={stats?.requires_attention ?? []}
          isLoading={isLoading}
        />
        <ActivityFeed activities={activities} isLoading={isLoading} />
      </div>

      {/* Distribution Chart */}
      <CategoryChart
        distribution={stats?.category_distribution}
        isLoading={isLoading}
      />
    </div>
  )
}
