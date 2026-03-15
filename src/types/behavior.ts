export interface BehaviorProfile {
  ai_understanding_score: number
  wlb_score: number
  last_computed: string | null
  calibration: UserCalibration | null
}

export interface UserCalibration {
  intentional_late_worker: boolean
  weekend_acceptable: boolean
  custom_active_hours: ActiveHoursRange | null
}

export interface ActiveHoursRange {
  start: string
  end: string
}

export interface QuickStats {
  emails_this_week: number
  avg_response_time_minutes: number
  top_contact: string
  streak_days: number
}

export interface StressIndicator {
  metric: string
  value: string
  delta: string
  status: 'ok' | 'warn' | 'critical'
  detail: string
}

export interface OverviewData {
  ai_understanding_score: number
  wlb_score: number
  last_computed: string | null
  calibration: UserCalibration | null
  quick_stats: QuickStats
  stress_indicators: StressIndicator[]
  latest_wellness_report: string | null
}

export interface CommunicationMetrics {
  period_start: string
  period_type: 'daily' | 'weekly' | 'monthly'
  avg_response_time_minutes: number
  avg_email_length_words: number
  emails_sent: number
  emails_received: number
  tone_distribution: Record<string, number>
  formality_distribution: Record<string, number>
  peak_hours: number[]
  after_hours_pct: number
  weekend_emails: number
}

export interface WLBData {
  score: number
  penalties: WLBPenalties
  trend_7d: WLBSnapshot[]
  trend_30d: WLBSnapshot[]
  latest_recommendation: string | null
  calibration: UserCalibration | null
}

export interface WLBPenalties {
  after_hours: number
  weekend: number
  boundary: number
  volume: number
}

export interface WLBSnapshot {
  date: string
  score: number
}

export interface ContactRelationship {
  contact_email: string
  contact_name: string | null
  interaction_count: number
  avg_response_time_minutes: number | null
  dominant_tone: string | null
  sentiment_trend: 'up' | 'down' | 'stable'
  interaction_frequency: string
  last_interaction: string | null
  is_declining: boolean
}

export interface RelationshipsResponse {
  contacts: ContactRelationship[]
  total: number
  limit: number
  offset: number
}

export interface ProductivityMetrics {
  peak_day: string
  avg_decision_time_minutes: number | null
  delegation_rate_pct: number
  inbox_zero_days: number
  hourly_distribution: number[]
}

export interface WellnessReport {
  week_start: string
  report_text: string
  created_at: string
}
