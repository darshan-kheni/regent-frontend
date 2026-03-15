import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import type { CalendarEvent } from '@/types/calendar'

type ViewMode = 'day' | 'week' | 'month'

interface CalendarState {
  viewMode: ViewMode
  selectedDate: Date
  events: CalendarEvent[]
  selectedEventId: string | null
  isLoading: boolean

  setViewMode: (mode: ViewMode) => void
  setSelectedDate: (date: Date) => void
  setEvents: (events: CalendarEvent[]) => void
  addEvent: (event: CalendarEvent) => void
  updateEvent: (id: string, updates: Partial<CalendarEvent>) => void
  removeEvent: (id: string) => void
  selectEvent: (id: string | null) => void
  setLoading: (loading: boolean) => void
  navigateNext: () => void
  navigatePrev: () => void
  navigateToday: () => void
}

export const useCalendarStore = create<CalendarState>()(
  devtools(
    (set, get) => ({
      viewMode: 'week',
      selectedDate: new Date(),
      events: [],
      selectedEventId: null,
      isLoading: false,

      setViewMode: (mode) => set({ viewMode: mode }),
      setSelectedDate: (date) => set({ selectedDate: date }),
      setEvents: (events) => set({ events }),
      addEvent: (event) => set((state) => ({
        events: [event, ...state.events],
      })),
      updateEvent: (id, updates) => set((state) => ({
        events: state.events.map((e) =>
          e.id === id ? { ...e, ...updates } : e
        ),
      })),
      removeEvent: (id) => set((state) => ({
        events: state.events.filter((e) => e.id !== id),
      })),
      selectEvent: (id) => set({ selectedEventId: id }),
      setLoading: (loading) => set({ isLoading: loading }),

      navigateNext: () => {
        const { viewMode, selectedDate } = get()
        const next = new Date(selectedDate)
        switch (viewMode) {
          case 'day':
            next.setDate(next.getDate() + 1)
            break
          case 'week':
            next.setDate(next.getDate() + 7)
            break
          case 'month':
            next.setMonth(next.getMonth() + 1)
            break
        }
        set({ selectedDate: next })
      },

      navigatePrev: () => {
        const { viewMode, selectedDate } = get()
        const prev = new Date(selectedDate)
        switch (viewMode) {
          case 'day':
            prev.setDate(prev.getDate() - 1)
            break
          case 'week':
            prev.setDate(prev.getDate() - 7)
            break
          case 'month':
            prev.setMonth(prev.getMonth() - 1)
            break
        }
        set({ selectedDate: prev })
      },

      navigateToday: () => set({ selectedDate: new Date() }),
    }),
    { name: 'calendar-store' }
  )
)
