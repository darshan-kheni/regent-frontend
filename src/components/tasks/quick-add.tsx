'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { useTaskMutations } from '@/hooks/use-tasks'

export function QuickAdd() {
  const [isOpen, setIsOpen] = useState(false)
  const [title, setTitle] = useState('')
  const { createTask } = useTaskMutations()

  const handleSubmit = async () => {
    if (!title.trim()) return
    await createTask({ title: title.trim() })
    setTitle('')
    setIsOpen(false)
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-1.5 w-full px-3 py-2 text-sm transition-colors"
        style={{
          color: 'var(--text-muted)',
          border: '1px dashed var(--border-default)',
          borderRadius: 0,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.color = 'var(--accent)'
          e.currentTarget.style.borderColor = 'var(--accent)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = 'var(--text-muted)'
          e.currentTarget.style.borderColor = 'var(--border-default)'
        }}
      >
        <Plus className="h-4 w-4" />
        Add task
      </button>
    )
  }

  return (
    <div
      className="p-2"
      style={{
        border: '1px solid var(--accent)',
        borderRadius: 0,
      }}
    >
      <input
        autoFocus
        type="text"
        placeholder="Task title..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') handleSubmit()
          if (e.key === 'Escape') setIsOpen(false)
        }}
        className="w-full text-sm bg-transparent focus:outline-none"
        style={{
          color: 'var(--text-primary)',
          borderRadius: 0,
        }}
      />
      <div className="flex justify-end gap-2 mt-2">
        <button
          onClick={() => setIsOpen(false)}
          className="text-xs transition-colors"
          style={{ color: 'var(--text-muted)' }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = 'var(--text-primary)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = 'var(--text-muted)'
          }}
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          className="text-xs px-2 py-1 transition-colors"
          style={{
            backgroundColor: 'var(--btn-primary-bg)',
            color: 'var(--btn-primary-text)',
            borderRadius: 0,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--accent-hover)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--btn-primary-bg)'
          }}
        >
          Add
        </button>
      </div>
    </div>
  )
}
