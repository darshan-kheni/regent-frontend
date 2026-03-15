'use client'

import { useState } from 'react'
import { format } from 'date-fns'

interface EventCreateModalProps {
  defaultDate?: Date
  onClose: () => void
  onCreated?: () => void
}

export function EventCreateModal({ defaultDate, onClose, onCreated }: EventCreateModalProps) {
  const [title, setTitle] = useState('')
  const [date, setDate] = useState(defaultDate ? format(defaultDate, 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd'))
  const [startTime, setStartTime] = useState('09:00')
  const [endTime, setEndTime] = useState('10:00')
  const [location, setLocation] = useState('')
  const [isAllDay, setIsAllDay] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim()) return

    setSubmitting(true)
    try {
      // TODO: POST to create event via provider API
      // For now, just close
      onCreated?.()
      onClose()
    } catch {
      // handle error
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
      <div
        className="bg-white dark:bg-neutral-950 w-full max-w-md border border-neutral-200 dark:border-neutral-800 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-neutral-200 dark:border-neutral-800">
          <h2 className="font-serif text-lg">Create Event</h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-medium text-neutral-500 uppercase tracking-wider mb-1">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Meeting title"
              className="w-full px-3 py-2 text-sm border border-neutral-300 dark:border-neutral-700 bg-transparent focus:outline-none focus:border-[#C9A96E]"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-500 uppercase tracking-wider mb-1">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-neutral-300 dark:border-neutral-700 bg-transparent focus:outline-none focus:border-[#C9A96E]"
            />
          </div>

          <div className="flex items-center gap-2 mb-2">
            <input
              type="checkbox"
              checked={isAllDay}
              onChange={(e) => setIsAllDay(e.target.checked)}
              id="allDay"
              className="accent-[#C9A96E]"
            />
            <label htmlFor="allDay" className="text-sm">All day</label>
          </div>

          {!isAllDay && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-neutral-500 uppercase tracking-wider mb-1">Start</label>
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-neutral-300 dark:border-neutral-700 bg-transparent focus:outline-none focus:border-[#C9A96E]"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-neutral-500 uppercase tracking-wider mb-1">End</label>
                <input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-neutral-300 dark:border-neutral-700 bg-transparent focus:outline-none focus:border-[#C9A96E]"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-neutral-500 uppercase tracking-wider mb-1">Location</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Location or meeting URL"
              className="w-full px-3 py-2 text-sm border border-neutral-300 dark:border-neutral-700 bg-transparent focus:outline-none focus:border-[#C9A96E]"
            />
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="submit"
              disabled={submitting || !title.trim()}
              className="flex-1 py-2 text-sm bg-[#C9A96E] text-white hover:bg-[#b8984f] disabled:opacity-50 transition-colors"
            >
              {submitting ? 'Creating...' : 'Create Event'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
