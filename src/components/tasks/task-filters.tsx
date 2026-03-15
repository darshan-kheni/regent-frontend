'use client'

import { useTaskStore } from '@/stores/task-store'
import { Search, Filter, X } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import type { TaskPriority, TaskType, TaskStatus } from '@/types/tasks'
import { PRIORITY_LABELS } from '@/types/tasks'

const STATUS_OPTIONS: { value: TaskStatus; label: string }[] = [
  { value: 'to_do', label: 'To Do' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'waiting', label: 'Waiting' },
  { value: 'done', label: 'Done' },
  { value: 'dismissed', label: 'Dismissed' },
]

const PRIORITY_OPTIONS: { value: TaskPriority; label: string }[] = [
  { value: 'p0', label: PRIORITY_LABELS.p0 },
  { value: 'p1', label: PRIORITY_LABELS.p1 },
  { value: 'p2', label: PRIORITY_LABELS.p2 },
  { value: 'p3', label: PRIORITY_LABELS.p3 },
]

const TYPE_OPTIONS: { value: TaskType; label: string }[] = [
  { value: 'explicit_request', label: 'Explicit Request' },
  { value: 'implicit_task', label: 'Implicit Task' },
  { value: 'self_commitment', label: 'Self Commitment' },
  { value: 'recurring', label: 'Recurring' },
]

export function TaskFilters() {
  const { filters, setFilters, sortBy, setSortBy } = useTaskStore()
  const [showFilters, setShowFilters] = useState(false)
  const [searchValue, setSearchValue] = useState(filters.search)
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined)

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [])

  function handleSearchChange(value: string) {
    setSearchValue(value)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      setFilters({ search: value })
    }, 300)
  }

  function toggleStatus(status: TaskStatus) {
    const current = filters.status
    const next = current.includes(status)
      ? current.filter((s) => s !== status)
      : [...current, status]
    setFilters({ status: next })
  }

  function togglePriority(priority: TaskPriority) {
    const current = filters.priority
    const next = current.includes(priority)
      ? current.filter((p) => p !== priority)
      : [...current, priority]
    setFilters({ priority: next })
  }

  function toggleType(type: TaskType) {
    const current = filters.type
    const next = current.includes(type)
      ? current.filter((t) => t !== type)
      : [...current, type]
    setFilters({ type: next })
  }

  function clearFilters() {
    setFilters({
      status: ['to_do', 'in_progress', 'waiting'],
      priority: [],
      type: [],
      search: '',
    })
    setSearchValue('')
  }

  const hasActiveFilters =
    filters.priority.length > 0 ||
    filters.type.length > 0 ||
    filters.search.length > 0

  return (
    <div className="mt-4 space-y-3">
      <div className="flex items-center gap-3 flex-wrap">
        {/* Search */}
        <div
          className="flex items-center gap-2 px-3 py-1.5 flex-1 min-w-[200px] max-w-sm"
          style={{
            backgroundColor: 'var(--bg-secondary)',
            border: '1px solid var(--border-default)',
          }}
        >
          <Search className="h-4 w-4 flex-shrink-0" style={{ color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchValue}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="bg-transparent text-sm outline-none flex-1"
            style={{ color: 'var(--text-primary)' }}
          />
          {searchValue && (
            <button
              type="button"
              onClick={() => handleSearchChange('')}
              style={{ color: 'var(--text-muted)' }}
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Filter toggle */}
        <button
          type="button"
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-1.5 px-3 py-1.5 text-sm transition-colors"
          style={{
            backgroundColor: showFilters ? 'var(--accent-subtle)' : 'var(--bg-secondary)',
            border: '1px solid var(--border-default)',
            color: showFilters ? 'var(--accent)' : 'var(--text-secondary)',
          }}
        >
          <Filter className="h-4 w-4" />
          Filters
          {hasActiveFilters && (
            <span
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: 'var(--accent)' }}
            />
          )}
        </button>

        {/* Sort */}
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as 'priority' | 'deadline' | 'created')}
          className="px-3 py-1.5 text-sm outline-none"
          style={{
            backgroundColor: 'var(--bg-secondary)',
            border: '1px solid var(--border-default)',
            color: 'var(--text-secondary)',
          }}
        >
          <option value="priority">Sort: Priority</option>
          <option value="deadline">Sort: Deadline</option>
          <option value="created">Sort: Newest</option>
        </select>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={clearFilters}
            className="text-xs px-2 py-1 transition-colors"
            style={{ color: 'var(--text-muted)' }}
          >
            Clear all
          </button>
        )}
      </div>

      {/* Expanded filters */}
      {showFilters && (
        <div
          className="p-4 space-y-4"
          style={{
            backgroundColor: 'var(--bg-secondary)',
            border: '1px solid var(--border-default)',
          }}
        >
          {/* Status */}
          <div>
            <span className="text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
              Status
            </span>
            <div className="flex flex-wrap gap-2 mt-2">
              {STATUS_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => toggleStatus(opt.value)}
                  className="px-2.5 py-1 text-xs transition-colors"
                  style={{
                    backgroundColor: filters.status.includes(opt.value)
                      ? 'var(--accent-subtle)'
                      : 'transparent',
                    border: '1px solid var(--border-default)',
                    color: filters.status.includes(opt.value)
                      ? 'var(--accent)'
                      : 'var(--text-secondary)',
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Priority */}
          <div>
            <span className="text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
              Priority
            </span>
            <div className="flex flex-wrap gap-2 mt-2">
              {PRIORITY_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => togglePriority(opt.value)}
                  className="px-2.5 py-1 text-xs transition-colors"
                  style={{
                    backgroundColor: filters.priority.includes(opt.value)
                      ? 'var(--accent-subtle)'
                      : 'transparent',
                    border: '1px solid var(--border-default)',
                    color: filters.priority.includes(opt.value)
                      ? 'var(--accent)'
                      : 'var(--text-secondary)',
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Type */}
          <div>
            <span className="text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
              Type
            </span>
            <div className="flex flex-wrap gap-2 mt-2">
              {TYPE_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => toggleType(opt.value)}
                  className="px-2.5 py-1 text-xs transition-colors"
                  style={{
                    backgroundColor: filters.type.includes(opt.value)
                      ? 'var(--accent-subtle)'
                      : 'transparent',
                    border: '1px solid var(--border-default)',
                    color: filters.type.includes(opt.value)
                      ? 'var(--accent)'
                      : 'var(--text-secondary)',
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
