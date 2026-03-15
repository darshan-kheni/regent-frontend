'use client'

import { Zap, Cpu, Coins } from 'lucide-react'
import { Card } from '@/components/ui'

interface ModuleStatsProps {
  stats: {
    activeCount: number
    totalCount: number
    modelCount: number
    dailyTokens: string
  }
  isLoading: boolean
}

interface StatCardProps {
  icon: React.ReactNode
  label: string
  value: string | number
}

function StatCard({ icon, label, value }: StatCardProps) {
  return (
    <Card>
      <div className="flex items-center gap-3">
        <div
          className="flex items-center justify-center h-10 w-10 flex-shrink-0"
          style={{
            backgroundColor: 'rgba(201,169,110,0.12)',
            color: 'var(--accent)',
          }}
        >
          {icon}
        </div>
        <div>
          <p
            className="text-sm"
            style={{ color: 'var(--text-muted)' }}
          >
            {label}
          </p>
          <p
            className="text-xl font-semibold"
            style={{ color: 'var(--text-primary)' }}
          >
            {value}
          </p>
        </div>
      </div>
    </Card>
  )
}

export function ModuleStats({ stats, isLoading }: ModuleStatsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <div className="h-10 animate-pulse" style={{ backgroundColor: 'var(--bg-secondary)' }} />
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <StatCard
        icon={<Zap className="h-5 w-5" />}
        label="Active Services"
        value={`${stats.activeCount} / ${stats.totalCount}`}
      />
      <StatCard
        icon={<Cpu className="h-5 w-5" />}
        label="AI Models"
        value={stats.modelCount}
      />
      <StatCard
        icon={<Coins className="h-5 w-5" />}
        label="Daily Tokens"
        value={stats.dailyTokens}
      />
    </div>
  )
}
