export interface CalendarEvent {
  id: string
  provider: 'google' | 'microsoft'
  account_id: string
  title: string
  description: string
  start_time: string // ISO 8601
  end_time: string
  time_zone: string
  location: string
  is_all_day: boolean
  status: 'confirmed' | 'tentative' | 'cancelled'
  attendees: Attendee[] | null
  recurrence_rule: string
  organizer_email: string
  is_online: boolean
  meeting_url: string
  briefed_at: string | null
}

export interface Attendee {
  email: string
  displayName?: string
  name?: string
  responseStatus?: string
}

export interface CalendarEventsQuery {
  start: string
  end: string
}

export interface CalendarConnection {
  provider: 'google' | 'microsoft'
  status: 'active' | 'revoked' | 'error'
  last_sync: string | null
}

export interface Conflict {
  id: string
  event_a_id: string
  event_b_id: string | null
  type: 'hard' | 'soft' | 'preference'
  severity: 'critical' | 'warn' | 'info'
  overlap_min: number | null
  gap_min: number | null
  detail: string
  resolved: boolean
}

export interface CalendarPreference {
  preferred_start_hour: number
  preferred_end_hour: number
  buffer_minutes: number
  no_meeting_days: number[]
  focus_blocks: FocusBlock[]
  home_timezone: string
}

export interface FocusBlock {
  start: string // "14:00"
  end: string   // "16:00"
  label: string
}

export interface SchedulingRequest {
  id: string
  email_id: string | null
  confidence: number
  proposed_times: ProposedTime[]
  duration_hint: number | null
  attendees: string[] | null
  location_preference: 'in_person' | 'virtual' | 'either' | null
  urgency: 'low' | 'medium' | 'high' | null
  status: 'detected' | 'suggested' | 'accepted' | 'declined' | 'expired'
  suggested_slots: SuggestedSlot[] | null
  accepted_slot: SuggestedSlot | null
  created_at: string
}

export interface ProposedTime {
  text: string
  parsed: string | null
}

export interface SuggestedSlot {
  start: string
  end: string
  score: number
  reasoning: string
  attendee_availability?: Record<string, string>
}

export interface SlotRequest {
  attendees: string[]
  duration_minutes: number
  preferred_start: string
  preferred_end: string
  meeting_type: 'call_30m' | 'meeting_1h' | 'workshop_2h' | 'custom'
  location_preference: 'virtual' | 'in_person' | 'either'
}

export interface MeetingBrief {
  id: string
  brief_text: string
  model_used: string
  attendee_context: AttendeeContext[]
  agenda_detected: string
  generated_at: string
}

export interface AttendeeContext {
  name: string
  email: string
  company: string
  interaction_count: number
  dominant_tone: string
  last_interaction: string
  recent_threads: string[]
}

export interface MeetingNote {
  id: string
  event_id: string
  notes: string
  outcome: 'productive' | 'neutral' | 'needs_followup' | 'cancelled'
  followup_items: FollowupItem[]
  created_at: string
}

export interface FollowupItem {
  text: string
  done: boolean
}
