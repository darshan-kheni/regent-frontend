'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { api } from '@/lib/api'
import { useCalendarStore } from '@/stores/calendar-store'
import { useRealtimeSubscription } from '@/hooks/use-realtime'
import type { CalendarEvent, Conflict } from '@/types/calendar'

interface UseCalendarEventsReturn {
  events: CalendarEvent[]
  conflicts: Conflict[]
  isLoading: boolean
  refetch: () => void
}

export function useCalendarEvents(
  start: Date,
  end: Date
): UseCalendarEventsReturn {
  const [conflicts, setConflicts] = useState<Conflict[]>([])
  const { events, setEvents, setLoading, isLoading } = useCalendarStore()
  const fetchIdRef = useRef(0)

  // Stabilize on timestamp values to avoid re-renders from new Date objects
  const startMs = start.getTime()
  const endMs = end.getTime()

  const fetchEvents = useCallback(async () => {
    const currentFetchId = ++fetchIdRef.current
    setLoading(true)

    try {
      const params = new URLSearchParams({
        start: new Date(startMs).toISOString(),
        end: new Date(endMs).toISOString(),
      })

      const [eventsData, conflictsData] = await Promise.all([
        api
          .get<CalendarEvent[]>(`/calendar/events?${params}`)
          .catch(() => [] as CalendarEvent[]),
        api
          .get<Conflict[]>(`/calendar/conflicts?${params}`)
          .catch(() => [] as Conflict[]),
      ])

      if (currentFetchId === fetchIdRef.current) {
        setEvents(eventsData)
        setConflicts(conflictsData)
      }
    } catch {
      if (currentFetchId === fetchIdRef.current) {
        setEvents([])
        setConflicts([])
      }
    } finally {
      if (currentFetchId === fetchIdRef.current) {
        setLoading(false)
      }
    }
  }, [startMs, endMs, setEvents, setLoading])

  useEffect(() => {
    fetchEvents()
  }, [fetchEvents])

  // Realtime subscription for live calendar updates
  useRealtimeSubscription<CalendarEvent>({
    table: 'calendar_events',
    event: '*',
    onInsert: (newEvent) => {
      const eventStart = new Date(newEvent.start_time).getTime()
      if (eventStart >= startMs && eventStart <= endMs) {
        useCalendarStore.getState().addEvent(newEvent)
      }
    },
    onUpdate: (updatedEvent) => {
      useCalendarStore.getState().updateEvent(updatedEvent.id, updatedEvent)
    },
  })

  return {
    events,
    conflicts,
    isLoading,
    refetch: fetchEvents,
  }
}
