'use client'

import { useState } from 'react'
import { Clock, X } from 'lucide-react'

interface ScheduleSendProps {
  scheduledAt: string | null
  onSchedule: (dateTime: string | null) => void
}

export function ScheduleSend({ scheduledAt, onSchedule }: ScheduleSendProps) {
  const [showPicker, setShowPicker] = useState(false)

  // Get minimum datetime (now + 5 minutes)
  const now = new Date()
  now.setMinutes(now.getMinutes() + 5)
  const minDateTime = now.toISOString().slice(0, 16)

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value
    if (val) {
      onSchedule(new Date(val).toISOString())
      setShowPicker(false)
    }
  }

  function handleClear() {
    onSchedule(null)
    setShowPicker(false)
  }

  if (scheduledAt) {
    const d = new Date(scheduledAt)
    const label = d.toLocaleString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    })

    return (
      <div
        className="flex items-center gap-2 px-3 py-1.5"
        style={{
          backgroundColor: 'var(--accent-subtle)',
          border: '1px solid var(--accent)',
        }}
      >
        <Clock className="h-3.5 w-3.5" style={{ color: 'var(--accent)' }} />
        <span className="text-xs font-medium" style={{ color: 'var(--accent)' }}>
          Scheduled: {label}
        </span>
        <button
          type="button"
          onClick={handleClear}
          className="ml-1 p-0.5"
          style={{ color: 'var(--accent)' }}
        >
          <X className="h-3 w-3" />
        </button>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2">
      {showPicker ? (
        <div className="flex items-center gap-2">
          <input
            type="datetime-local"
            min={minDateTime}
            onChange={handleChange}
            autoFocus
            className="h-8 px-2 text-xs"
            style={{
              borderRadius: 0,
              backgroundColor: 'var(--bg-elevated)',
              border: '1px solid var(--accent)',
              color: 'var(--text-primary)',
            }}
          />
          <button
            type="button"
            onClick={() => setShowPicker(false)}
            className="text-xs"
            style={{ color: 'var(--text-muted)' }}
          >
            Cancel
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setShowPicker(true)}
          className="flex items-center gap-1.5 text-xs font-medium transition-colors"
          style={{ color: 'var(--text-secondary)' }}
          onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--accent)' }}
          onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-secondary)' }}
        >
          <Clock className="h-3.5 w-3.5" />
          Schedule Send
        </button>
      )}
    </div>
  )
}
