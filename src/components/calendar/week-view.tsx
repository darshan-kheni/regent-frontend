'use client'

import { useMemo } from 'react'
import { useCalendarStore } from '@/stores/calendar-store'
import { useCalendarEvents } from '@/hooks/use-calendar-events'
import { EventDetail } from '@/components/calendar/event-detail'
import {
  format,
  startOfWeek,
  endOfWeek,
  addDays,
  isSameDay,
  startOfDay,
  differenceInMinutes,
} from 'date-fns'
import type { CalendarEvent } from '@/types/calendar'

const HOUR_HEIGHT = 48
const START_HOUR = 6
const END_HOUR = 22
const TOTAL_HOURS = END_HOUR - START_HOUR

const PROVIDER_COLORS: Record<string, string> = {
  google: 'bg-blue-500/90',
  microsoft: 'bg-emerald-500/90',
}

export function WeekView() {
  const { selectedDate, setSelectedDate, setViewMode, selectedEventId, selectEvent } = useCalendarStore()
  const weekStart = startOfWeek(selectedDate, { weekStartsOn: 0 })
  const weekEnd = endOfWeek(selectedDate, { weekStartsOn: 0 })
  const { events, conflicts, isLoading } = useCalendarEvents(weekStart, weekEnd)

  const selectedEvent = useMemo(
    () => (selectedEventId ? events.find((e) => e.id === selectedEventId) ?? null : null),
    [selectedEventId, events]
  )

  const days = useMemo(
    () => Array.from({ length: 7 }, (_, i) => addDays(weekStart, i)),
    [weekStart.getTime()]
  )

  const hours = useMemo(
    () => Array.from({ length: TOTAL_HOURS }, (_, i) => START_HOUR + i),
    []
  )

  const allDayEvents = useMemo(
    () =>
      events.filter((e) => e.is_all_day && e.status !== 'cancelled'),
    [events]
  )

  const handleDayHeaderClick = (day: Date) => {
    setSelectedDate(day)
    setViewMode('day')
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-neutral-400 text-sm">Loading events...</div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      {/* Day headers */}
      <div className="grid grid-cols-[4rem_repeat(7,1fr)] border-b border-neutral-200 dark:border-neutral-800">
        <div /> {/* spacer for time column */}
        {days.map((day) => (
          <div
            key={day.toISOString()}
            onClick={() => handleDayHeaderClick(day)}
            className={`py-2 text-center text-sm cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors ${
              isSameDay(day, new Date())
                ? 'text-[#C9A96E] font-semibold'
                : 'text-neutral-600 dark:text-neutral-400'
            }`}
          >
            <div>{format(day, 'EEE')}</div>
            <div className="text-lg">{format(day, 'd')}</div>
          </div>
        ))}
      </div>

      {/* All-day events row */}
      {allDayEvents.length > 0 && (
        <div className="grid grid-cols-[4rem_repeat(7,1fr)] border-b border-neutral-200 dark:border-neutral-800">
          <div className="text-xs text-neutral-400 pr-2 text-right py-1">
            All day
          </div>
          {days.map((day) => {
            const dayAllDay = allDayEvents.filter((e) =>
              isSameDay(new Date(e.start_time), day)
            )
            return (
              <div
                key={day.toISOString()}
                className="border-l border-neutral-200 dark:border-neutral-800 px-0.5 py-0.5"
              >
                {dayAllDay.map((evt) => (
                  <div
                    key={evt.id}
                    className={`text-[10px] text-white px-1 truncate rounded-none ${
                      PROVIDER_COLORS[evt.provider] || 'bg-neutral-500'
                    }`}
                  >
                    {evt.title}
                  </div>
                ))}
              </div>
            )
          })}
        </div>
      )}

      {/* Time grid */}
      <div className="flex-1 overflow-auto">
        <div
          className="grid grid-cols-[4rem_repeat(7,1fr)] relative"
          style={{ height: TOTAL_HOURS * HOUR_HEIGHT }}
        >
          {/* Time labels */}
          <div className="relative">
            {hours.map((hour) => (
              <div
                key={hour}
                className="absolute left-0 right-0 text-xs text-neutral-400 pr-2 text-right select-none"
                style={{ top: (hour - START_HOUR) * HOUR_HEIGHT - 6 }}
              >
                {format(new Date(2026, 0, 1, hour), 'h a')}
              </div>
            ))}
          </div>

          {/* Day columns */}
          {days.map((day) => {
            const dayEvents = events.filter((e) => {
              const eStart = new Date(e.start_time)
              return (
                isSameDay(eStart, day) &&
                !e.is_all_day &&
                e.status !== 'cancelled'
              )
            })

            return (
              <div
                key={day.toISOString()}
                className="relative border-l border-neutral-200 dark:border-neutral-800"
              >
                {hours.map((hour) => (
                  <div
                    key={hour}
                    className="absolute left-0 right-0 border-t border-neutral-100 dark:border-neutral-900"
                    style={{ top: (hour - START_HOUR) * HOUR_HEIGHT }}
                  />
                ))}

                {dayEvents.map((evt) => {
                  const evtStart = new Date(evt.start_time)
                  const evtEnd = new Date(evt.end_time)
                  const minutesFromStart =
                    differenceInMinutes(evtStart, startOfDay(day)) -
                    START_HOUR * 60
                  const top =
                    Math.max(0, minutesFromStart) * (HOUR_HEIGHT / 60)
                  const height = Math.max(
                    20,
                    differenceInMinutes(evtEnd, evtStart) *
                      (HOUR_HEIGHT / 60)
                  )

                  return (
                    <div
                      key={evt.id}
                      onClick={() => selectEvent(evt.id)}
                      className={`absolute left-0.5 right-0.5 px-1 py-0.5 text-white text-[10px] overflow-hidden cursor-pointer rounded-none
                        ${PROVIDER_COLORS[evt.provider] || 'bg-neutral-500'}
                        hover:opacity-90 transition-opacity`}
                      style={{
                        top: `${top}px`,
                        height: `${height}px`,
                      }}
                    >
                      <div className="font-medium truncate">
                        {evt.title}
                      </div>
                      {height > 30 && (
                        <div className="text-white/70 truncate">
                          {format(evtStart, 'h:mm a')}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
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
