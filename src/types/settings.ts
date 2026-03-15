export interface UserProfile {
  id: string
  name: string
  email: string
  avatar_url: string | null
  timezone: string
  language: string
}

export interface NotificationPrefs {
  sms_enabled: boolean
  whatsapp_enabled: boolean
  signal_enabled: boolean
  push_enabled: boolean
  digest_enabled: boolean
  primary_channel: string
  digest_frequency: 'daily' | 'twice_daily' | 'weekly' | 'off'
  digest_time: string
  quiet_start: string | null
  quiet_end: string | null
  vip_breaks_quiet: boolean
}

export type ServiceGroup = 'email_processing' | 'intelligence' | 'ai_behavior' | 'notifications'

export interface ServiceConfig {
  id: string
  name: string
  description: string
  group: ServiceGroup
  icon: string
  model: string | null
  enabled: boolean
  status: 'active' | 'degraded' | 'offline' | 'disabled' | 'locked'
  is_coming_soon: boolean
  min_plan?: string
  locked?: boolean
}
