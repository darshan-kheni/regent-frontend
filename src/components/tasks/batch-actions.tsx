'use client'

import { useTaskStore } from '@/stores/task-store'
import { useTaskMutations } from '@/hooks/use-tasks'
import { CheckCircle, Trash2, ArrowRight } from 'lucide-react'
import type { TaskStatus } from '@/types/tasks'

export function BatchActions() {
  const { selectedTaskId, tasks, setSelectedTaskId } = useTaskStore()
  const { updateStatus, dismissTask } = useTaskMutations()

  const selectedTask = selectedTaskId
    ? tasks.find((t) => t.id === selectedTaskId)
    : null

  if (!selectedTask) return null

  async function handleMove(status: TaskStatus) {
    if (!selectedTaskId) return
    await updateStatus(selectedTaskId, status)
    setSelectedTaskId(null)
  }

  async function handleDismiss() {
    if (!selectedTaskId) return
    await dismissTask(selectedTaskId)
    setSelectedTaskId(null)
  }

  return (
    <div
      className="fixed bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3 px-4 py-2.5 shadow-lg z-50"
      style={{
        backgroundColor: 'var(--bg-card)',
        border: '1px solid var(--border-default)',
      }}
    >
      <span
        className="text-sm truncate max-w-[200px]"
        style={{ color: 'var(--text-primary)' }}
      >
        {selectedTask.title}
      </span>

      <div
        className="w-px h-5"
        style={{ backgroundColor: 'var(--border-default)' }}
      />

      {selectedTask.status !== 'done' && (
        <button
          type="button"
          onClick={() => handleMove('done')}
          className="flex items-center gap-1.5 text-xs px-2.5 py-1.5 transition-colors"
          style={{
            backgroundColor: '#22C55E15',
            color: '#22C55E',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#22C55E25'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#22C55E15'
          }}
        >
          <CheckCircle className="h-3.5 w-3.5" />
          Done
        </button>
      )}

      {selectedTask.status !== 'in_progress' && selectedTask.status !== 'done' && (
        <button
          type="button"
          onClick={() => handleMove('in_progress')}
          className="flex items-center gap-1.5 text-xs px-2.5 py-1.5 transition-colors"
          style={{
            backgroundColor: 'var(--accent-subtle)',
            color: 'var(--accent)',
          }}
        >
          <ArrowRight className="h-3.5 w-3.5" />
          Start
        </button>
      )}

      <button
        type="button"
        onClick={handleDismiss}
        className="flex items-center gap-1.5 text-xs px-2.5 py-1.5 transition-colors"
        style={{
          backgroundColor: '#EF444415',
          color: '#EF4444',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = '#EF444425'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = '#EF444415'
        }}
      >
        <Trash2 className="h-3.5 w-3.5" />
        Dismiss
      </button>

      <button
        type="button"
        onClick={() => setSelectedTaskId(null)}
        className="text-xs px-2 py-1"
        style={{ color: 'var(--text-muted)' }}
      >
        Cancel
      </button>
    </div>
  )
}
