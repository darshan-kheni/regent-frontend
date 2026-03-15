'use client'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { formatDistanceToNow } from 'date-fns'
import {
  Mail,
  Clock,
  X,
  Play,
  Pause,
  RefreshCw,
  CheckCircle,
  Settings,
  AlertTriangle,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useTaskMutations } from '@/hooks/use-tasks'
import { useTaskStore } from '@/stores/task-store'
import type { Task, TaskPriority, TaskType } from '@/types/tasks'
import { PRIORITY_COLORS } from '@/types/tasks'
import type { LucideProps } from 'lucide-react'

const TYPE_ICONS: Record<TaskType, React.ComponentType<LucideProps>> = {
  explicit_request: Mail,
  implicit_task: Settings,
  self_commitment: CheckCircle,
  recurring: RefreshCw,
}

function DeadlineDisplay({ deadline }: { deadline: string }) {
  const date = new Date(deadline)
  const now = new Date()
  const isOverdue = date < now
  const hoursLeft = (date.getTime() - now.getTime()) / (1000 * 60 * 60)
  const isUrgent = !isOverdue && hoursLeft < 24

  const color = isOverdue
    ? '#D4645D'
    : isUrgent
    ? 'var(--accent)'
    : 'var(--text-muted)'

  const text = isOverdue
    ? `${formatDistanceToNow(date)} overdue`
    : `${formatDistanceToNow(date, { addSuffix: false })} left`

  return (
    <span
      className="flex items-center gap-1 text-xs"
      style={{ color }}
    >
      <Clock className="h-3 w-3" />
      {text}
    </span>
  )
}

function PriorityBadge({ priority }: { priority: TaskPriority }) {
  return (
    <span
      className="text-[10px] font-bold px-1.5 py-0.5 uppercase"
      style={{ backgroundColor: PRIORITY_COLORS[priority], color: '#ffffff' }}
    >
      {priority}
    </span>
  )
}

interface TaskCardProps {
  task: Task
  isDragging?: boolean
}

export function TaskCard({ task, isDragging }: TaskCardProps) {
  const { dismissTask } = useTaskMutations()
  const { startTimer, stopTimer, activeTimerTaskId } = useTaskStore()

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: task.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const TypeIcon = TYPE_ICONS[task.type] || Mail
  const isTimerActive = activeTimerTaskId === task.id

  return (
    <div
      ref={setNodeRef}
      style={{
        ...style,
        backgroundColor: 'var(--bg-card)',
        border: '1px solid var(--border-subtle)',
      }}
      {...attributes}
      {...listeners}
      className={cn(
        'p-3 cursor-grab active:cursor-grabbing transition-colors',
        isDragging && 'shadow-lg'
      )}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'var(--accent)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'var(--border-subtle)'
      }}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-1.5 min-w-0">
          <TypeIcon
            className="h-3.5 w-3.5 shrink-0"
            style={{ color: 'var(--text-muted)' } as React.CSSProperties}
          />
          <h4
            className="text-sm line-clamp-2 leading-tight"
            style={{ color: 'var(--text-primary)' }}
          >
            {task.title}
          </h4>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation()
            dismissTask(task.id)
          }}
          className="shrink-0 transition-colors"
          style={{ color: 'var(--text-muted)' }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = '#D4645D'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = 'var(--text-muted)'
          }}
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>

      {task.source_subject && (
        <div
          className="mt-1.5 flex items-center gap-1 text-xs truncate"
          style={{ color: 'var(--text-muted)' }}
        >
          <Mail className="h-3 w-3 shrink-0" />
          <span className="truncate">{task.source_subject}</span>
        </div>
      )}

      <div className="mt-2 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <PriorityBadge priority={task.priority} />
          {task.needs_confirmation && (
            <span
              className="flex items-center gap-0.5 text-[10px] px-1 py-0.5"
              style={{
                color: 'var(--color-warning)',
                backgroundColor: 'var(--accent-subtle)',
              }}
            >
              <AlertTriangle className="h-3 w-3" />
              Confirm
            </span>
          )}
        </div>
        {task.deadline && <DeadlineDisplay deadline={task.deadline} />}
      </div>

      <div className="mt-2 flex items-center justify-between">
        {task.assignee_email ? (
          <div className="flex items-center gap-1">
            <div
              className="h-5 w-5 text-[10px] font-bold flex items-center justify-center shrink-0"
              style={{
                backgroundColor: 'var(--accent)',
                color: 'var(--accent-text)',
              }}
            >
              {task.assignee_email.charAt(0).toUpperCase()}
            </div>
            <span
              className="text-xs truncate max-w-[100px]"
              style={{ color: 'var(--text-muted)' }}
            >
              {task.assignee_email}
            </span>
          </div>
        ) : (
          <div />
        )}
        <button
          onClick={(e) => {
            e.stopPropagation()
            if (isTimerActive) {
              stopTimer()
            } else {
              startTimer(task.id)
            }
          }}
          className="p-0.5 transition-colors"
          style={{ color: 'var(--text-muted)' }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = 'var(--accent)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = 'var(--text-muted)'
          }}
        >
          {isTimerActive ? (
            <Pause className="h-3.5 w-3.5" />
          ) : (
            <Play className="h-3.5 w-3.5" />
          )}
        </button>
      </div>
    </div>
  )
}
