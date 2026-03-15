'use client'

import { useState, useEffect, useMemo } from 'react'
import { Card, Badge, Button } from '@/components/ui'
import { api } from '@/lib/api'
import { useToast } from '@/providers/toast-provider'
import { formatDate } from '@/lib/utils'
import type { Subscription } from '@/types/billing'
import { Lock } from 'lucide-react'

const PLANS = [
  {
    id: 'free',
    name: 'Regent Free',
    price: '0',
    description: 'Personal email intelligence',
    features: [
      { text: '1 email account', live: true },
      { text: '50K AI tokens / day', live: true },
      { text: '10 AI draft replies / day', live: true },
      { text: 'Basic AI categorization', live: true },
      { text: 'AI Memory (10 rules)', live: true },
      { text: 'Token Analytics dashboard', live: true },
      { text: 'Push notification briefings', live: true },
      { text: 'Calendar Intelligence', soon: true },
      { text: 'Task Extraction', soon: true },
    ],
  },
  {
    id: 'attache',
    name: 'Attach\u00e9',
    price: '97',
    description: 'For the professional individual',
    features: [
      { text: '10 email accounts', live: true },
      { text: '500K AI tokens / day', live: true },
      { text: 'Unlimited AI draft replies', live: true },
      { text: 'AI Memory (25 rules) + Context Briefs', live: true },
      { text: 'Behavior Intelligence (basic)', live: true },
      { text: 'All briefing channels', live: true },
      { text: 'Calendar Intelligence', soon: true },
      { text: 'Task Extraction', soon: true },
      { text: 'Contact Intelligence', soon: true },
    ],
  },
  {
    id: 'privy_council',
    name: 'Privy Council',
    price: '297',
    description: 'For those who delegate everything',
    features: [
      { text: '25 email accounts', live: true },
      { text: '2M AI tokens / day', live: true },
      { text: 'Premium AI drafts (gpt-oss:120b)', live: true },
      { text: 'AI Memory (50 rules) + full context', live: true },
      { text: 'Full Behavior Intelligence + wellness', live: true },
      { text: 'Priority support', live: true },
      { text: 'Calendar Intelligence', soon: true },
      { text: 'Task Extraction', soon: true },
      { text: 'Contact Intelligence', soon: true },
      { text: 'Document Vault (10 GB)', soon: true },
    ],
  },
  {
    id: 'estate',
    name: 'Estate',
    price: '697',
    description: 'Family offices & principals',
    features: [
      { text: 'Unlimited accounts & tokens', live: true },
      { text: 'Unlimited premium AI drafts', live: true },
      { text: 'AI Memory (unlimited) + custom models', live: true },
      { text: 'Full Behavior + executive coaching', live: true },
      { text: 'Dedicated infrastructure', live: true },
      { text: 'White-glove onboarding', live: true },
      { text: 'Calendar Intelligence', soon: true },
      { text: 'Task Extraction', soon: true },
      { text: 'Contact Intelligence', soon: true },
      { text: 'Travel Orchestration', soon: true },
      { text: 'Document Vault (Unlimited)', soon: true },
      { text: 'Expense Tracking', soon: true },
    ],
  },
]

function CheckIcon({ size = 12 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}

function ClockIcon({ size = 11 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  )
}

export function PlanCard() {
  const [subscription, setSubscription] = useState<Subscription | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedPlan, setSelectedPlan] = useState<string>('privy_council')
  const { addToast } = useToast()

  useEffect(() => {
    async function load() {
      try {
        const data = await api.get<Subscription>('/billing/subscription')
        setSubscription(data)
        if (data?.plan_id) setSelectedPlan(data.plan_id)
      } catch (err) {
        addToast('error', err instanceof Error ? err.message : 'Failed to load subscription')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [addToast])

  const currentPlanId = subscription?.plan_id || 'free'

  // Calculate days remaining
  const daysRemaining = useMemo(() => {
    if (!subscription?.current_period_end) return null
    const end = new Date(subscription.current_period_end)
    if (isNaN(end.getTime())) return null
    const now = new Date()
    return Math.max(0, Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)))
  }, [subscription?.current_period_end])

  if (loading) {
    return (
      <Card padding="lg">
        <div className="h-40 animate-pulse" style={{ backgroundColor: 'var(--bg-secondary)' }} />
      </Card>
    )
  }

  return (
    <div className="space-y-5">
      {/* Secured by Stripe */}
      <div className="flex items-center gap-2.5">
        <Lock size={13} style={{ color: 'var(--text-muted)' }} />
        <span className="text-[13px]" style={{ color: 'var(--text-muted)' }}>
          Secured by
        </span>
        <span className="text-[13px] font-semibold" style={{ color: 'var(--text-secondary)' }}>
          Stripe
        </span>
      </div>

      {/* Subscription Status Card */}
      {subscription && (
        <Card padding="lg" className="!border-[var(--accent-subtle)]">
          <div className="flex justify-between items-start flex-wrap gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div
                  className="w-2 h-2"
                  style={{
                    backgroundColor:
                      subscription.status === 'active' ? '#6FAD76' :
                      subscription.status === 'trialing' ? '#E8A838' : '#D4645D',
                  }}
                />
                <span
                  className="text-[9px] font-bold tracking-[0.12em] uppercase"
                  style={{
                    color:
                      subscription.status === 'active' ? '#6FAD76' :
                      subscription.status === 'trialing' ? '#E8A838' : '#D4645D',
                  }}
                >
                  {subscription.status === 'active' ? 'Active' :
                   subscription.status === 'trialing' ? 'Trial' :
                   subscription.status === 'past_due' ? 'Past Due' : 'Canceled'}
                </span>
              </div>
              <div
                className="font-display text-[32px] font-normal"
                style={{ color: 'var(--text-primary)' }}
              >
                {subscription.plan_name}
              </div>
              <div className="text-[13px] mt-1.5" style={{ color: 'var(--text-muted)' }}>
                Started {formatDate(subscription.current_period_end, 'MMM d, yyyy')}
              </div>
            </div>
            <div className="text-right">
              <div
                className="text-[10px] font-semibold tracking-[0.1em] uppercase mb-1.5"
                style={{ color: 'var(--text-muted)' }}
              >
                Renews
              </div>
              <div
                className="font-display text-[22px] font-normal"
                style={{
                  color: daysRemaining !== null && daysRemaining <= 7 ? '#D4645D' :
                         daysRemaining !== null && daysRemaining <= 14 ? '#E8A838' :
                         'var(--text-primary)',
                }}
              >
                {formatDate(subscription.current_period_end, 'MMM d, yyyy')}
              </div>
              {daysRemaining !== null && (
                <div
                  className="text-[12px] mt-1"
                  style={{
                    color: daysRemaining <= 7 ? '#D4645D' :
                           daysRemaining <= 14 ? '#E8A838' :
                           'var(--text-muted)',
                  }}
                >
                  {daysRemaining} days remaining
                </div>
              )}
            </div>
          </div>
          {/* Progress bar */}
          {daysRemaining !== null && (
            <div className="mt-4">
              <div className="h-[3px]" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                <div
                  className="h-[3px] transition-all duration-500"
                  style={{
                    width: `${Math.max(100 - ((daysRemaining / 30) * 100), 5)}%`,
                    backgroundColor:
                      daysRemaining <= 7 ? '#D4645D' :
                      daysRemaining <= 14 ? '#E8A838' :
                      'var(--accent)',
                  }}
                />
              </div>
            </div>
          )}
        </Card>
      )}

      {/* Plan Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {PLANS.map((plan) => {
          const isActive = selectedPlan === plan.id
          const isCurrent = currentPlanId === plan.id
          const liveFeatures = plan.features.filter((f) => f.live)
          const soonFeatures = plan.features.filter((f) => f.soon)

          return (
            <Card
              key={plan.id}
              padding="lg"
              hover
              className={`relative cursor-pointer ${isActive ? '!border-[var(--accent-subtle)]' : ''}`}
            >
              {/* Click handler */}
              <div
                className="absolute inset-0"
                onClick={() => setSelectedPlan(plan.id)}
              />
              {/* Current plan indicator bar */}
              {isCurrent && (
                <div
                  className="absolute top-0 left-0 right-0 h-[2px]"
                  style={{ backgroundColor: 'var(--accent)' }}
                />
              )}

              <div className="relative">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div
                      className="text-[22px] font-normal font-display"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      {plan.name}
                    </div>
                    <div
                      className="text-[12px] mt-1 tracking-[0.04em]"
                      style={{ color: 'var(--text-muted)' }}
                    >
                      {plan.description}
                    </div>
                  </div>
                  {isCurrent && (
                    <span
                      className="text-[9px] font-bold tracking-[0.12em] uppercase px-2.5 py-1"
                      style={{
                        color: 'var(--accent)',
                        border: '1px solid var(--accent-subtle)',
                        backgroundColor: 'rgba(201,169,110,0.08)',
                      }}
                    >
                      Current
                    </span>
                  )}
                </div>

                {/* Price */}
                <div
                  className="flex items-baseline gap-1 my-5 pb-5"
                  style={{ borderBottom: '1px solid var(--border-subtle)' }}
                >
                  <span
                    className="text-[48px] font-light font-display"
                    style={{ color: plan.price === '0' ? '#6FAD76' : 'var(--text-primary)' }}
                  >
                    {plan.price === '0' ? 'Free' : `$${plan.price}`}
                  </span>
                  <span className="text-[13px]" style={{ color: 'var(--text-muted)' }}>
                    {plan.price === '0' ? ' forever' : '/month'}
                  </span>
                </div>

                {/* Live features */}
                {liveFeatures.length > 0 && (
                  <div className={soonFeatures.length > 0 ? 'mb-4' : ''}>
                    <div
                      className="text-[9px] font-bold tracking-[0.12em] uppercase mb-2 flex items-center gap-1.5"
                      style={{ color: '#6FAD76' }}
                    >
                      <CheckIcon size={10} />
                      Live
                    </div>
                    {liveFeatures.map((f, i) => (
                      <div
                        key={i}
                        className="text-[13px] flex items-center gap-2 py-[7px]"
                        style={{
                          color: 'var(--text-secondary)',
                          borderBottom: '1px solid var(--border-subtle)',
                        }}
                      >
                        <CheckIcon size={12} />
                        <span>{f.text}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Coming Soon features */}
                {soonFeatures.length > 0 && (
                  <div>
                    <div
                      className="text-[9px] font-bold tracking-[0.12em] uppercase mb-2 mt-1 flex items-center gap-1.5"
                      style={{ color: '#7EA3C2' }}
                    >
                      <ClockIcon size={10} />
                      Coming Soon
                    </div>
                    {soonFeatures.map((f, i) => (
                      <div
                        key={i}
                        className="text-[13px] flex items-center gap-2 py-1.5 opacity-60"
                        style={{
                          color: 'var(--text-muted)',
                          borderBottom: '1px solid var(--border-subtle)',
                        }}
                      >
                        <ClockIcon size={11} />
                        <span className="flex-1">{f.text}</span>
                        <span
                          className="text-[8px] font-bold tracking-[0.06em]"
                          style={{ color: '#7EA3C2' }}
                        >
                          SOON
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {/* CTA Button */}
                <Button
                  variant={isCurrent ? 'primary' : 'secondary'}
                  className="w-full mt-6"
                  disabled={isCurrent}
                >
                  {isCurrent ? 'Current Plan' : 'Select Plan'}
                </Button>
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
