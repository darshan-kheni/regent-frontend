'use client'

import { KanbanBoard } from '@/components/tasks/kanban-board'
import { TaskFilters } from '@/components/tasks/task-filters'
import { BatchActions } from '@/components/tasks/batch-actions'
import { useTasks } from '@/hooks/use-tasks'

export default function TasksPage() {
  const { isLoading, error, planGated } = useTasks()

  if (planGated) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center">
        <h2
          className="font-display text-2xl mb-2"
          style={{ color: 'var(--text-primary)' }}
        >
          Task Extraction
        </h2>
        <p
          className="text-sm mb-4 max-w-sm"
          style={{ color: 'var(--text-muted)' }}
        >
          Upgrade to Attach&eacute; to unlock AI-powered task extraction from your emails.
        </p>
        <a
          href="/billing"
          className="px-4 py-2 text-sm transition-colors"
          style={{
            backgroundColor: '#C9A96E',
            color: '#ffffff',
          }}
          onMouseEnter={(e) => {
            ;(e.currentTarget as HTMLAnchorElement).style.backgroundColor = '#8A6E3A'
          }}
          onMouseLeave={(e) => {
            ;(e.currentTarget as HTMLAnchorElement).style.backgroundColor = '#C9A96E'
          }}
        >
          Upgrade Plan
        </a>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div>
        <h1
          className="font-display text-3xl mb-4"
          style={{ color: 'var(--text-primary)' }}
        >
          Tasks
        </h1>
        <div className="animate-pulse space-y-4">
          <div
            className="h-10 w-full"
            style={{ backgroundColor: 'var(--bg-secondary)' }}
          />
          <div className="flex gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-64 w-72 flex-shrink-0"
                style={{ backgroundColor: 'var(--bg-secondary)' }}
              />
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div>
        <h1
          className="font-display text-3xl mb-4"
          style={{ color: 'var(--text-primary)' }}
        >
          Tasks
        </h1>
        <div
          className="p-4 text-sm"
          style={{
            backgroundColor: '#EF444415',
            color: '#EF4444',
            border: '1px solid #EF444430',
          }}
        >
          Failed to load tasks: {error}
        </div>
      </div>
    )
  }

  return (
    <div>
      <h1
        className="font-display text-3xl"
        style={{ color: 'var(--text-primary)' }}
      >
        Tasks
      </h1>
      <TaskFilters />
      <KanbanBoard />
      <BatchActions />
    </div>
  )
}
