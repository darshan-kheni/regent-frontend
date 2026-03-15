import type { ServiceBreakdown } from './analytics'

export interface Subscription {
  plan_name: string
  plan_id: string
  status: 'active' | 'trialing' | 'past_due' | 'canceled'
  current_period_end: string
  features: string[]
}

export interface UsageData {
  daily_tokens: number
  daily_limit: number
  monthly_tokens: number
  monthly_limit: number
  breakdown: ServiceBreakdown[]
}

export interface Invoice {
  id: string
  amount_cents: number
  currency: string
  status: string
  period_start: string
  period_end: string
  pdf_url: string | null
  created_at: string
}

export interface PromoResult {
  valid: boolean
  type: 'discount' | 'trial' | null
  message: string
  discount_percent: number | null
  trial_days: number | null
}
