'use client'

import { useMemo } from 'react'
import { useCalendarStore } from '@/stores/calendar-store'
import { useCalendarEvents } from '@/hooks/use-calendar-events'
import { EventDetail } from '@/components/calendar/event-detail'
import {
  format,
  startOfDay,
  endOfDay,
  differenceInMinutes,
} from 'date-fns'
import type { CalendarEvent, Conflict } from '@/types/calendar'

const HOUR_HEIGHT = 60 // px per hour
const START_HOUR = 6
const END_HOUR = 22
const TOTAL_HOURS = END_HOUR - START_HOUR

const PROVIDER_COLORS: Record<string, string> = {
  google: 'bg-blue-500/90',
  microsoft: 'bg-emerald-500/90',
}

export function DayView() {
  const { selectedDate, selectedEventId, selectEvent } = useCalendarStore()
  const start = startOfDay(selectedDate)
  const end = endOfDay(selectedDate)
  const { events, conflicts, isLoading } = useCalendarEvents(start, end)

  const selectedEvent = useMemo(
    () => (selectedEventId ? events.find((e) => e.id === selectedEventId) ?? null : null),
    [selectedEventId, events]
  )

  const hours = useMemo(
    () => Array.from({ length: TOTAL_HOURS }, (_, i) => START_HOUR + i),
    []
  )

  const positionedEvents = useMemo(
    () => positionEvents(events, start),
    [events, start]
  )

  const allDayEvents = useMemo(
    () => events.filter((e) => e.is_all_day && e.status !== 'cancelled'),
    [events]
  )

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-neutral-400 text-sm">Loading events...</div>
      </div>
    )
  }

  return (
    <div className="flex flex-col">
      {/* All-day events */}
      {allDayEvents.length > 0 && (
        <div className="px-6 py-2 border-b border-neutral-200 dark:border-neutral-800">
          <div className="text-xs text-neutral-400 mb-1">All day</div>
          <div className="flex flex-wrap gap-1">
            {allDayEvents.map((evt) => (
              <div
                key={evt.id}
                className={`px-2 py-0.5 text-xs text-white rounded-none ${
                  PROVIDER_COLORS[evt.provider] || 'bg-neutral-500'
                }`}
              >
                {evt.title}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Timed events grid */}
      <div
        className="relative px-6"
        style={{ height: TOTAL_HOURS * HOUR_HEIGHT }}
      >
        {/* Hour grid lines */}
        {hours.map((hour) => (
          <div
            key={hour}
            className="absolute left-0 right-0 border-t border-neutral-200 dark:border-neutral-800"
            style={{ top: (hour - START_HOUR) * HOUR_HEIGHT }}
          >
            <span className="absolute -top-3 left-2 text-xs text-neutral-400 select-none">
              {format(new Date(2026, 0, 1, hour), 'h a')}
            </span>
          </div>
        ))}

        {/* Events */}
        <div className="ml-16 relative">
          {positionedEvents.map((pe) => {
            const conflict = conflicts.find(
              (c) =>
                c.event_a_id === pe.event.id || c.event_b_id === pe.event.id
            )
            return (
              <EventBlock
                key={pe.event.id}
                event={pe.event}
                top={pe.top}
                height={pe.height}
                left={pe.left}
                width={pe.width}
                conflict={conflict}
                onClick={() => selectEvent(pe.event.id)}
              />
            )
          })}
        </div>
      </div>

      {selectedEvent && (
        <EventDetail
          event={selectedEvent}
          conflicts={conflicts}
          open={!!selectedEvent}
          onClose={() => selectEvent(null)}
        />
      )}
    </div>
  )
}

interface PositionedEvent {
  event: CalendarEvent
  top: number
  height: number
  left: number
  width: number
}

function positionEvents(
  events: CalendarEvent[],
  dayStart: Date
): PositionedEvent[] {
  const timed = events.filter(
    (e) => !e.is_all_day && e.status !== 'cancelled'
  )

  const sorted = [...timed].sort(
    (a, b) =>
      new Date(a.start_time).getTime() - new Date(b.start_time).getTime()
  )

  const positioned: PositionedEvent[] = []

  for (let i = 0; i < sorted.length; i++) {
    const evt = sorted[i]
    const evtStart = new Date(evt.start_time)
    const evtEnd = new Date(evt.end_time)
    const minutesFromStart =
      differenceInMinutes(evtStart, dayStart) - START_HOUR * 60
    const top = Math.max(0, minutesFromStart)
    const height = Math.max(30, differenceInMinutes(evtEnd, evtStart))

    // Count overlapping events for width distribution
    let overlapCount = 1
    let overlapIndex = 0
    for (let j = 0; j < i; j++) {
      const other = sorted[j]
      const otherEnd = new Date(other.end_time)
      if (otherEnd > evtStart) {
        overlapCount++
        overlapIndex++
      }
    }

    positioned.push({
      event: evt,
      top,
      height,
      left: (overlapIndex / overlapCount) * 100,
      width: 100 / overlapCount,
    })
  }

  return positioned
}

function EventBlock({
  event,
  top,
  height,
  left,
  width,
  conflict,
  onClick,
}: {
  event: CalendarEvent
  top: number
  height: number
  left: number
  width: number
  conflict?: Conflict
  onClick: () => void
}) {
  const borderClass = conflict
    ? conflict.type === 'hard'
      ? 'border-2 border-red-500'
      : conflict.type === 'soft'
        ? 'border-2 border-[#C9A96E]'
        : 'border-2 border-blue-400'
    : ''

  return (
    <div
      onClick={onClick}
      className={`absolute px-2 py-1 text-white text-xs overflow-hidden cursor-pointer rounded-none
        ${PROVIDER_COLORS[event.provider] || 'bg-neutral-500'}
        ${borderClass}
        hover:opacity-90 transition-opacity`}
      style={{
        top: `${top}px`,
        height: `${height}px`,
        left: `${left}%`,
        width: `${width}%`,
      }}
    >
      <div className="font-medium truncate">{event.title}</div>
      {height > 40 && (
        <div className="text-white/70 truncate">
          {format(new Date(event.start_time), 'h:mm a')} –{' '}
          {format(new Date(event.end_time), 'h:mm a')}
        </div>
      )}
      {height > 60 && event.location && (
        <div className="text-white/60 truncate">{event.location}</div>
      )}
    </div>
  )
}
