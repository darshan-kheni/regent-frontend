export interface Task {
  id: string
  user_id: string
  tenant_id: string
  email_id?: string
  title: string
  description?: string
  type: TaskType
  status: TaskStatus
  priority: TaskPriority
  deadline?: string
  deadline_text?: string
  needs_confirmation: boolean
  assignee_email?: string
  delegated_to?: string
  delegated_at?: string
  confidence: number
  source_subject?: string
  source_sender?: string
  recurrence_rule?: string
  next_recurrence?: string
  snoozed_until?: string
  completed_at?: string
  dismissed_at?: string
  calendar_event_id?: string
  time_tracked_min: number
  is_timing: boolean
  timing_started_at?: string
  created_at: string
}

export type TaskStatus = 'to_do' | 'in_progress' | 'waiting' | 'done' | 'dismissed'
export type TaskPriority = 'p0' | 'p1' | 'p2' | 'p3'
export type TaskType = 'explicit_request' | 'implicit_task' | 'self_commitment' | 'recurring'

export interface TaskDelegation {
  id: string
  task_id: string
  user_id: string
  tenant_id: string
  delegated_to_email: string
  delegated_to_name?: string
  delegation_email_id?: string
  status: 'pending' | 'in_progress' | 'completed' | 'overdue'
  follow_up_date?: string
  follow_up_count: number
  last_follow_up?: string
  completed_at?: string
  created_at: string
}

export interface TaskDigest {
  overdue_count: number
  overdue_tasks: Task[]
  due_today_count: number
  due_today_tasks: Task[]
  due_this_week_count: number
  due_this_week_tasks: Task[]
  new_count: number
  delegated_waiting: number
}

export interface TaskStats {
  completed_this_week: number
  created_this_week: number
  avg_completion_hours: number
  on_time_rate: number
  overdue_carried: number
  time_tracked_min: number
}

export interface BoardColumn {
  id?: string
  column_key: string
  label: string
  color: string
  position: number
  is_default: boolean
}

export interface TaskFilters {
  status: TaskStatus[]
  priority: TaskPriority[]
  type: TaskType[]
  search: string
}

export const DEFAULT_COLUMNS: BoardColumn[] = [
  { column_key: 'to_do', label: 'To Do', color: '#3B82F6', position: 0, is_default: true },
  { column_key: 'in_progress', label: 'In Progress', color: '#C9A96E', position: 1, is_default: true },
  { column_key: 'waiting', label: 'Waiting', color: '#6B7280', position: 2, is_default: true },
  { column_key: 'done', label: 'Done', color: '#22C55E', position: 3, is_default: true },
]

export const PRIORITY_COLORS: Record<TaskPriority, string> = {
  p0: '#EF4444',
  p1: '#C9A96E',
  p2: '#3B82F6',
  p3: '#6B7280',
}

export const PRIORITY_LABELS: Record<TaskPriority, string> = {
  p0: 'P0 - Critical',
  p1: 'P1 - High',
  p2: 'P2 - Medium',
  p3: 'P3 - Low',
}
