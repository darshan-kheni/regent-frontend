export interface AnalyticsData {
  tokens_used: number
  tokens_limit: number
  plan_name?: string
  ai_calls: number
  avg_latency_ms: number
  cache_hit_rate: number
  draft_acceptance_rate: number
  trend: { date: string; tokens: number }[]
}

export interface MemoryHealthData {
  learned_patterns: number
  user_corrections: number
  active_rules: number
  last_updated: string | null
}

export interface ServiceBreakdown {
  service_name: string
  model: string
  tokens: number
  calls: number
  avg_latency_ms: number
  usage_percent: number
}

export type AuditEventType =
  | 'categorize'
  | 'summarize'
  | 'draft'
  | 'draft_reply'
  | 'behavior_analysis'

export interface AuditEntry {
  id: string
  event_type: AuditEventType
  email_subject: string | null
  email_sender: string | null
  description: string
  decision: string | null
  reason: string | null
  model_used: string | null
  tokens_consumed: number | null
  latency_ms: number | null
  confidence: number | null
  created_at: string
}

export interface DashboardStats {
  emails_today: number
  emails_total: number
  ai_processed: number
  pending_replies: number
  active_connections: number
  avg_response_minutes: number | null
  ai_composed: number
  category_distribution: { category: string; count: number }[]
  connected_accounts: ConnectedAccount[]
  requires_attention: AttentionEmail[]
}

export interface ConnectedAccount {
  id: string
  email_address: string
  display_name?: string
  provider: 'gmail' | 'outlook' | 'imap'
  sync_status: string
}

export interface AttentionEmail {
  id: string
  subject: string
  from_name: string
  from_address: string
  received_at: string
  priority: number
  account_id: string
  snippet: string
}
