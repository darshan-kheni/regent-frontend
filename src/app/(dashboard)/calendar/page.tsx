'use client'

import { useState, useEffect, useCallback } from 'react'
import { useCalendarStore } from '@/stores/calendar-store'
import { CalendarToolbar } from '@/components/calendar/calendar-toolbar'
import { DayView } from '@/components/calendar/day-view'
import { WeekView } from '@/components/calendar/week-view'
import { MonthView } from '@/components/calendar/month-view'
import { SchedulingSidebar } from '@/components/calendar/scheduling-sidebar'
import { CalendarConnections } from '@/components/calendar/calendar-connections'
import { EventCreateModal } from '@/components/calendar/event-create-modal'
import type { CalendarConnection } from '@/types/calendar'

export default function CalendarPage() {
  const { viewMode } = useCalendarStore()
  const [connections, setConnections] = useState<CalendarConnection[]>([])
  const [connectionsLoading, setConnectionsLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)

  const fetchConnections = useCallback(async () => {
    try {
      const res = await fetch('/api/v1/calendar/connections')
      if (res.ok) {
        const data = await res.json()
        setConnections(data.data || [])
      }
    } catch {
      // silently fail
    } finally {
      setConnectionsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchConnections()
  }, [fetchConnections])

  const hasActiveConnection = connections.some((c) => c.status === 'active')

  if (connectionsLoading) {
    return (
      <div className="flex items-center justify-center h-full -m-6">
        <span className="text-sm text-neutral-400">Loading calendar...</span>
      </div>
    )
  }

  if (!hasActiveConnection) {
    return (
      <div className="flex flex-col items-center justify-center h-full -m-6 gap-6">
        <div className="text-center max-w-sm">
          <h1 className="font-serif text-2xl mb-2">Calendar Intelligence</h1>
          <p className="text-sm text-neutral-500">
            Connect a calendar provider to unlock AI-powered scheduling, conflict detection, and meeting prep briefs.
          </p>
        </div>
        <div className="w-full max-w-sm">
          <CalendarConnections onConnectionChange={fetchConnections} />
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-full -m-6">
      <div className="flex-1 flex flex-col overflow-hidden">
        <CalendarToolbar />
        <div className="flex-1 overflow-auto">
          {viewMode === 'day' && <DayView />}
          {viewMode === 'week' && <WeekView />}
          {viewMode === 'month' && <MonthView />}
        </div>
      </div>
      <SchedulingSidebar />

      {showCreateModal && (
        <EventCreateModal
          onClose={() => setShowCreateModal(false)}
          onCreated={fetchConnections}
        />
      )}
    </div>
  )
}
