'use client'

import Link from 'next/link'
import { Lock } from 'lucide-react'

interface PlanGateOverlayProps {
  requiredPlan: string
  variant?: 'full' | 'tab'
}

function PlanGateOverlay({ requiredPlan, variant = 'tab' }: PlanGateOverlayProps) {
  const planLabels: Record<string, string> = {
    attache: 'Attache',
    privy_council: 'Privy Council',
    estate: 'Estate',
  }
  const label = planLabels[requiredPlan] || requiredPlan

  return (
    <div
      className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-4"
      style={{
        backdropFilter: 'blur(6px)',
        backgroundColor: 'rgba(0,0,0,0.4)',
      }}
    >
      <Lock size={variant === 'full' ? 48 : 32} style={{ color: '#C9A96E' }} />
      <p
        className={variant === 'full' ? 'text-lg' : 'text-sm'}
        style={{ color: 'var(--text-primary)' }}
      >
        Upgrade to <span className="font-display" style={{ color: '#C9A96E' }}>{label}</span> to unlock
      </p>
      <Link
        href="/billing"
        className="px-6 py-2 text-sm font-medium transition-colors"
        style={{
          backgroundColor: '#C9A96E',
          color: '#1a1a1a',
          borderRadius: 0,
        }}
      >
        Upgrade
      </Link>
    </div>
  )
}

export { PlanGateOverlay }
