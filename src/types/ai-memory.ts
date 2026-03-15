export interface UserRule {
  id: string
  scope: 'email' | 'calendar' | 'tasks' | 'all'
  type: string
  instruction: string
  text?: string
  contact_filter: string | null
  active: boolean
  created_at: string
}

export interface ContextBrief {
  id: string
  title: string
  scope: string
  context: string
  keywords: string[]
  expires_at: string | null
  created_at: string
}

export interface LearnedPattern {
  id: string
  category: 'communication' | 'priority' | 'schedule' | 'reply'
  pattern: string
  confidence: number
  data_source: string
  created_at: string
}
