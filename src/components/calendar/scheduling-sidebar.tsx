'use client'

import { useState, useEffect, useCallback } from 'react'
import { format } from 'date-fns'
import { api } from '@/lib/api'
import { useToast } from '@/providers/toast-provider'
import type { SchedulingRequest, SuggestedSlot } from '@/types/calendar'

export function SchedulingSidebar() {
  const [requests, setRequests] = useState<SchedulingRequest[]>([])
  const [loading, setLoading] = useState(true)

  const fetchRequests = useCallback(async () => {
    setLoading(true)
    try {
      const data = await api.get<SchedulingRequest[]>(
        '/calendar/scheduling-requests?status=detected'
      )
      setRequests(data || [])
    } catch {
      // silently fail
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchRequests()
  }, [fetchRequests])

  if (loading) {
    return (
      <div className="w-80 border-l border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 flex items-center justify-center">
        <span className="text-xs text-neutral-400">Loading requests...</span>
      </div>
    )
  }

  if (requests.length === 0) return null

  return (
    <div className="w-80 border-l border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 overflow-y-auto">
      <div className="p-4 border-b border-neutral-200 dark:border-neutral-800">
        <h2 className="font-serif text-lg">Scheduling Requests</h2>
        <p className="text-xs text-neutral-500 mt-1">{requests.length} pending</p>
      </div>
      <div className="divide-y divide-neutral-200 dark:divide-neutral-800">
        {requests.map((req) => (
          <SchedulingRequestCard
            key={req.id}
            request={req}
            onUpdate={fetchRequests}
          />
        ))}
      </div>
    </div>
  )
}

function SchedulingRequestCard({
  request,
  onUpdate,
}: {
  request: SchedulingRequest
  onUpdate: () => void
}) {
  const [suggesting, setSuggesting] = useState(false)
  const [slots, setSlots] = useState<SuggestedSlot[] | null>(
    request.suggested_slots
  )
  const [approving, setApproving] = useState<number | null>(null)
  const { addToast } = useToast()

  async function suggestSlots() {
    setSuggesting(true)
    try {
      const data = await api.post<SuggestedSlot[]>(
        '/calendar/suggest-slots',
        {
          attendees: request.attendees || [],
          duration_minutes: request.duration_hint || 60,
          meeting_type: 'meeting_1h',
          location_preference: request.location_preference || 'either',
        }
      )
      setSlots(data || [])
      addToast('success', `${(data || []).length} time slots suggested`)
    } catch {
      addToast('error', 'Failed to suggest time slots')
    } finally {
      setSuggesting(false)
    }
  }

  async function approveSlot(index: number) {
    setApproving(index)
    try {
      await api.post('/calendar/approve-slot', {
        request_id: request.id,
        slot_index: index,
      })
      addToast('success', 'Time slot approved')
      onUpdate()
    } catch {
      addToast('error', 'Failed to approve time slot')
    } finally {
      setApproving(null)
    }
  }

  return (
    <div className="p-4">
      <div className="flex items-center gap-2 mb-2">
        <span
          className={`w-2 h-2 ${
            request.confidence > 0.8 ? 'bg-green-500' : 'bg-[#C9A96E]'
          }`}
        />
        <span className="text-xs text-neutral-500">
          {Math.round(request.confidence * 100)}% confidence
        </span>
        {request.urgency && (
          <span
            className={`text-xs px-1.5 py-0.5 ${
              request.urgency === 'high'
                ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                : request.urgency === 'medium'
                  ? 'bg-[#C9A96E]/10 text-[#C9A96E]'
                  : 'bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400'
            }`}
          >
            {request.urgency}
          </span>
        )}
      </div>

      {request.proposed_times.length > 0 && (
        <div className="mb-2">
          <p className="text-xs text-neutral-500 mb-1">Proposed times:</p>
          {request.proposed_times.map((pt, i) => (
            <div key={i} className="text-sm">
              {pt.text}
            </div>
          ))}
        </div>
      )}

      {request.duration_hint && (
        <p className="text-xs text-neutral-500 mb-2">
          Duration: {request.duration_hint} min
        </p>
      )}

      {!slots ? (
        <button
          onClick={suggestSlots}
          disabled={suggesting}
          className="w-full py-2 text-sm bg-[#C9A96E] text-white hover:bg-[#b8984f] disabled:opacity-50 transition-colors"
        >
          {suggesting ? 'Finding slots...' : 'Suggest Times'}
        </button>
      ) : (
        <div className="space-y-2">
          {slots.map((slot, i) => (
            <div
              key={i}
              className="border border-neutral-200 dark:border-neutral-700 p-2"
            >
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-sm font-medium">
                    {format(new Date(slot.start), 'EEE, MMM d')}
                  </div>
                  <div className="text-xs text-neutral-500">
                    {format(new Date(slot.start), 'h:mm a')} &ndash;{' '}
                    {format(new Date(slot.end), 'h:mm a')}
                  </div>
                </div>
                <button
                  onClick={() => approveSlot(i)}
                  disabled={approving !== null}
                  className="px-3 py-1 text-xs bg-[#C9A96E] text-white hover:bg-[#b8984f] disabled:opacity-50"
                >
                  {approving === i ? '...' : 'Approve'}
                </button>
              </div>
              {slot.reasoning && (
                <div className="text-[10px] text-neutral-400 mt-1">
                  {slot.reasoning}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
