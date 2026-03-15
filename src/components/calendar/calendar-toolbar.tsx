'use client'

import { useCalendarStore } from '@/stores/calendar-store'
import { format } from 'date-fns'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const VIEWS = ['day', 'week', 'month'] as const

export function CalendarToolbar() {
  const {
    viewMode,
    selectedDate,
    setViewMode,
    navigatePrev,
    navigateNext,
    navigateToday,
  } = useCalendarStore()

  const heading =
    viewMode === 'day'
      ? format(selectedDate, 'EEEE, MMMM d')
      : viewMode === 'week'
        ? `Week of ${format(selectedDate, 'MMMM d')}`
        : format(selectedDate, 'MMMM yyyy')

  return (
    <div
      className="flex items-center justify-between px-6 py-4"
      style={{ borderBottom: '1px solid var(--border-subtle)' }}
    >
      <div className="flex items-center gap-4">
        <h1 className="font-serif text-2xl tracking-tight">{heading}</h1>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={navigateToday}
          className="px-3 py-1.5 text-sm border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors rounded-none"
        >
          Today
        </button>
        <button
          onClick={navigatePrev}
          className="p-1.5 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-none"
          aria-label="Previous"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={navigateNext}
          className="p-1.5 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-none"
          aria-label="Next"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        <div className="flex ml-4 border border-neutral-300 dark:border-neutral-700">
          {VIEWS.map((v) => (
            <button
              key={v}
              onClick={() => setViewMode(v)}
              className={`px-3 py-1.5 text-sm capitalize rounded-none ${
                viewMode === v
                  ? 'bg-[#C9A96E] dark:bg-[#C9A96E] text-white'
                  : 'hover:bg-neutral-50 dark:hover:bg-neutral-800'
              }`}
            >
              {v}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
