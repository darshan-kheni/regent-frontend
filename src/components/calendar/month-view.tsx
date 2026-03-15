'use client'

import { useMemo } from 'react'
import { useCalendarStore } from '@/stores/calendar-store'
import { useCalendarEvents } from '@/hooks/use-calendar-events'
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  isSameDay,
  isSameMonth,
} from 'date-fns'

const PROVIDER_DOT_COLORS: Record<string, string> = {
  google: 'bg-blue-500',
  microsoft: 'bg-emerald-500',
}

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export function MonthView() {
  const { selectedDate, setSelectedDate, setViewMode } = useCalendarStore()
  const monthStart = startOfMonth(selectedDate)
  const monthEnd = endOfMonth(selectedDate)
  const calStart = startOfWeek(monthStart, { weekStartsOn: 0 })
  const calEnd = endOfWeek(monthEnd, { weekStartsOn: 0 })
  const { events, isLoading } = useCalendarEvents(calStart, calEnd)

  const weeks = useMemo(() => {
    const result: Date[][] = []
    let current = calStart
    while (current <= calEnd) {
      const week: Date[] = []
      for (let i = 0; i < 7; i++) {
        week.push(current)
        current = addDays(current, 1)
      }
      result.push(week)
    }
    return result
  }, [calStart.getTime(), calEnd.getTime()])

  const handleDayClick = (day: Date) => {
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
    <div className="p-4">
      <div className="grid grid-cols-7 gap-px bg-neutral-200 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-800">
        {DAY_NAMES.map((name) => (
          <div
            key={name}
            className="bg-white dark:bg-neutral-950 py-2 text-center text-xs font-medium text-neutral-500"
          >
            {name}
          </div>
        ))}
        {weeks.flat().map((day) => {
          const dayEvents = events.filter((e) =>
            isSameDay(new Date(e.start_time), day)
          )
          const isToday = isSameDay(day, new Date())
          const isCurrentMonth = isSameMonth(day, selectedDate)

          return (
            <div
              key={day.toISOString()}
              onClick={() => handleDayClick(day)}
              className={`bg-white dark:bg-neutral-950 min-h-[80px] p-1 cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors ${
                !isCurrentMonth ? 'opacity-40' : ''
              }`}
            >
              <div
                className={`text-sm mb-1 ${
                  isToday ? 'text-[#C9A96E] font-bold' : ''
                }`}
              >
                {format(day, 'd')}
              </div>
              <div className="space-y-0.5">
                {dayEvents.slice(0, 3).map((evt) => (
                  <div
                    key={evt.id}
                    className={`text-[10px] text-white px-1 truncate rounded-none ${
                      PROVIDER_DOT_COLORS[evt.provider] ||
                      'bg-neutral-500'
                    }`}
                  >
                    {evt.title}
                  </div>
                ))}
                {dayEvents.length > 3 && (
                  <div className="text-[10px] text-neutral-400">
                    +{dayEvents.length - 3} more
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
