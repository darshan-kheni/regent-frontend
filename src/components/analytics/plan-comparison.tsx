'use client'

import { Card } from '@/components/ui/card'
import { Crown } from 'lucide-react'

interface PlanComparisonProps {
  currentPlan?: string
}

const plans = [
  {
    id: 'free',
    name: 'Free',
    tokenLimit: '50K',
    tokenSuffix: '/ day',
    features: [
      '1 email account',
      '10 AI drafts/day',
      '10 AI memory rules',
    ],
  },
  {
    id: 'attache',
    name: 'Attache',
    tokenLimit: '500K',
    tokenSuffix: '/ day',
    features: [
      '10 email accounts',
      'Unlimited AI drafts',
      '25 AI memory rules',
    ],
  },
  {
    id: 'privy_council',
    name: 'Privy Council',
    tokenLimit: '2M',
    tokenSuffix: '/ day',
    features: [
      '25 email accounts',
      'Premium drafts (gpt-oss)',
      '50 AI memory rules',
    ],
  },
  {
    id: 'estate',
    name: 'Estate',
    tokenLimit: 'Unlimited',
    tokenSuffix: '',
    features: [
      'Unlimited accounts',
      'Full AI coaching',
      'Unlimited rules',
    ],
  },
]

function normalizePlanId(planName?: string | null): string {
  if (!planName) return 'free'
  const lower = planName.toLowerCase().replace(/\s+/g, '_')
  const match = plans.find((p) => p.id === lower || p.name.toLowerCase() === lower)
  return match?.id ?? 'free'
}

export function PlanComparison({ currentPlan }: PlanComparisonProps) {
  const activePlanId = normalizePlanId(currentPlan)

  return (
    <Card padding="lg">
      <h2
        className="font-display text-lg mb-4"
        style={{ color: 'var(--text-primary)' }}
      >
        Token Limits by Plan
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {plans.map((plan) => {
          const isCurrent = plan.id === activePlanId
          return (
            <div
              key={plan.id}
              className="relative p-4"
              style={{
                backgroundColor: isCurrent ? 'rgba(201,169,110,0.06)' : 'var(--bg-secondary)',
                border: isCurrent
                  ? '2px solid var(--accent)'
                  : '1px solid var(--border-subtle)',
                borderRadius: 0,
              }}
            >
              {/* Current plan indicator */}
              {isCurrent && (
                <div
                  className="absolute -top-px -right-px flex items-center gap-1 px-2 py-0.5"
                  style={{
                    backgroundColor: 'var(--accent)',
                    color: '#1a1a1a',
                    fontSize: '10px',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}
                >
                  <Crown size={10} />
                  Current
                </div>
              )}

              <h3
                className="font-display text-base mb-3"
                style={{ color: 'var(--text-primary)' }}
              >
                {plan.name}
              </h3>

              <p
                className="font-display text-3xl font-bold leading-tight"
                style={{ color: isCurrent ? 'var(--accent)' : 'var(--text-primary)' }}
              >
                {plan.tokenLimit}
                {plan.tokenSuffix && (
                  <span
                    className="text-sm font-normal ml-1"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    {plan.tokenSuffix}
                  </span>
                )}
              </p>

              <ul className="mt-3 space-y-1.5">
                {plan.features.map((feature) => (
                  <li
                    key={feature}
                    className="text-xs flex items-start gap-1.5"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    <span
                      className="mt-0.5 flex-shrink-0"
                      style={{ color: 'var(--accent)' }}
                    >
                      +
                    </span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          )
        })}
      </div>
    </Card>
  )
}
