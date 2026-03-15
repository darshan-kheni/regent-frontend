'use client'

import { useState, useEffect } from 'react'
import { format } from 'date-fns'
import { api } from '@/lib/api'
import { useToast } from '@/providers/toast-provider'
import { Modal } from '@/components/ui/modal'
import type { CalendarEvent, MeetingBrief, Conflict } from '@/types/calendar'

interface EventDetailProps {
  event: CalendarEvent
  conflicts: Conflict[]
  open: boolean
  onClose: () => void
}

export function EventDetail({ event, conflicts, open, onClose }: EventDetailProps) {
  const [brief, setBrief] = useState<MeetingBrief | null>(null)
  const [sendingLate, setSendingLate] = useState(false)
  const [lateSent, setLateSent] = useState(false)
  const { addToast } = useToast()

  useEffect(() => {
    if (!open) {
      setBrief(null)
      setLateSent(false)
      return
    }
    fetchBrief()
  }, [event.id, open])

  async function fetchBrief() {
    try {
      const data = await api.get<MeetingBrief>(
        `/calendar/meeting-briefs/${event.id}`
      )
      setBrief(data)
    } catch {
      // No brief available
    }
  }

  async function sendRunningLate() {
    setSendingLate(true)
    try {
      await api.post(`/calendar/running-late/${event.id}`)
      setLateSent(true)
      addToast('success', 'Running late notification sent')
    } catch {
      addToast('error', 'Failed to send notification')
    } finally {
      setSendingLate(false)
    }
  }

  const eventConflicts = conflicts.filter(
    (c) => c.event_a_id === event.id || c.event_b_id === event.id
  )

  const attendees = event.attendees || []

  const footer = (
    <>
      {event.meeting_url && (
        <a
          href={event.meeting_url}
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 text-sm bg-[#C9A96E] text-white hover:bg-[#b8984f] transition-colors inline-block"
        >
          Join Meeting
        </a>
      )}
      <button
        onClick={sendRunningLate}
        disabled={sendingLate || lateSent}
        className="px-4 py-2 text-sm border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800 disabled:opacity-50 transition-colors"
      >
        {lateSent ? 'Sent!' : sendingLate ? 'Sending...' : 'Running Late'}
      </button>
    </>
  )

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={event.title || 'Untitled Event'}
      footer={footer}
      className="max-w-lg"
    >
      <div className="space-y-4">
        {/* Provider + Status */}
        <div className="flex items-center gap-2">
          <span
            className={`w-2 h-2 ${
              event.provider === 'google' ? 'bg-blue-500' : 'bg-emerald-500'
            }`}
          />
          <span className="text-sm text-neutral-500 capitalize">
            {event.provider}
          </span>
          {event.status === 'tentative' && (
            <span className="text-xs px-1.5 py-0.5 bg-[#C9A96E]/10 text-[#C9A96E]">
              Tentative
            </span>
          )}
        </div>

        {/* Time */}
        <div>
          <p className="text-sm font-medium">
            {event.is_all_day
              ? `${format(new Date(event.start_time), 'EEEE, MMMM d, yyyy')} (All day)`
              : `${format(new Date(event.start_time), 'EEEE, MMMM d, yyyy')} \u00B7 ${format(new Date(event.start_time), 'h:mm a')} \u2013 ${format(new Date(event.end_time), 'h:mm a')}`}
          </p>
          {event.time_zone && (
            <p className="text-xs text-neutral-500">{event.time_zone}</p>
          )}
        </div>

        {/* Location / Meeting URL */}
        {(event.location || event.meeting_url) && (
          <div>
            {event.location && <p className="text-sm">{event.location}</p>}
            {event.meeting_url && (
              <a
                href={event.meeting_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-[#C9A96E] hover:underline"
              >
                Join Meeting
              </a>
            )}
          </div>
        )}

        {/* Attendees */}
        {attendees.length > 0 && (
          <div>
            <h3 className="text-xs font-medium text-neutral-500 uppercase tracking-wider mb-2">
              Attendees
            </h3>
            <div className="space-y-1">
              {attendees.map((a, i) => (
                <div key={i} className="flex items-center gap-2 text-sm">
                  <div className="w-6 h-6 bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center text-[10px] font-medium">
                    {(a.displayName || a.name || a.email || '?')[0].toUpperCase()}
                  </div>
                  <span>{a.displayName || a.name || a.email}</span>
                  {a.responseStatus && (
                    <span
                      className={`text-xs ${
                        a.responseStatus === 'accepted'
                          ? 'text-green-600'
                          : a.responseStatus === 'declined'
                            ? 'text-red-500'
                            : 'text-neutral-400'
                      }`}
                    >
                      {a.responseStatus}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Conflict Warnings */}
        {eventConflicts.length > 0 && (
          <div>
            <h3 className="text-xs font-medium text-neutral-500 uppercase tracking-wider mb-2">
              Conflicts
            </h3>
            {eventConflicts.map((c) => (
              <div
                key={c.id}
                className={`text-sm p-2 mb-1 ${
                  c.type === 'hard'
                    ? 'bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-400 border-l-2 border-red-500'
                    : c.type === 'soft'
                      ? 'bg-[#C9A96E]/5 text-[#C9A96E] border-l-2 border-[#C9A96E]'
                      : 'bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400 border-l-2 border-blue-500'
                }`}
              >
                {c.detail}
              </div>
            ))}
          </div>
        )}

        {/* Meeting Brief */}
        {brief && (
          <div>
            <h3 className="text-xs font-medium text-neutral-500 uppercase tracking-wider mb-2">
              Meeting Prep
            </h3>
            <div className="bg-neutral-50 dark:bg-neutral-900 p-3 text-sm whitespace-pre-line">
              {brief.brief_text}
            </div>
          </div>
        )}

        {/* Description */}
        {event.description && (
          <div>
            <h3 className="text-xs font-medium text-neutral-500 uppercase tracking-wider mb-2">
              Description
            </h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 whitespace-pre-line">
              {event.description}
            </p>
          </div>
        )}
      </div>
    </Modal>
  )
}
