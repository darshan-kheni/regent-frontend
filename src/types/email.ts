export interface Email {
  id: string
  tenant_id: string
  user_id: string
  account_id: string
  message_id: string
  thread_id: string | null
  direction: 'inbound' | 'outbound'
  from_address: string
  from_name: string
  to_addresses: string[]
  cc_addresses: string[]
  subject: string
  body_text: string
  body_html: string | null
  has_attachments: boolean
  attachments: Attachment[] | null
  received_at: string
  is_read: boolean
  is_starred: boolean
  category?: string
  confidence?: number
  priority?: number
  summary?: string
  action_required?: boolean
  tone?: string
  created_at: string
}

export interface Attachment {
  filename: string
  content_type: string
  size: number
  url: string
}

export interface EmailCategory {
  email_id: string
  category: string
  confidence: number
  priority: number
}

export interface EmailSummary {
  email_id: string
  summary: string
  model_used: string
}

export interface DraftEmailInfo {
  id: string
  account_id: string
  subject: string
  from_address: string
  from_name: string
  body_text: string
  category?: string
  priority?: number
}

export interface DraftReply {
  id: string
  email_id: string
  body: string
  variant: string
  model_used: string
  is_premium: boolean
  confidence: number
  status: 'pending' | 'approved' | 'rejected' | 'sent'
  created_at: string
  email?: DraftEmailInfo
}

export interface UserAccount {
  id: string
  provider: 'gmail' | 'outlook' | 'imap'
  email_address: string
  display_name: string
  sync_status: string
  last_sync_at: string | null
  created_at: string
}
