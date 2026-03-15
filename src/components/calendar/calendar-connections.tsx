'use client'

import { useState, useEffect } from 'react'
import type { CalendarConnection } from '@/types/calendar'

interface CalendarConnectionsProps {
  onConnectionChange?: () => void
}

const PROVIDERS = [
  { id: 'google', name: 'Google Calendar', color: 'bg-blue-500', connectUrl: '/api/v1/auth/connect/google-calendar' },
  { id: 'microsoft', name: 'Outlook Calendar', color: 'bg-emerald-500', connectUrl: '/api/v1/auth/connect/microsoft-calendar' },
] as const

export function CalendarConnections({ onConnectionChange }: CalendarConnectionsProps) {
  const [connections, setConnections] = useState<CalendarConnection[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchConnections()
  }, [])

  async function fetchConnections() {
    try {
      const res = await fetch('/api/v1/calendar/connections')
      if (res.ok) {
        const data = await res.json()
        setConnections(data.data || [])
      }
    } catch {
      // silently fail
    } finally {
      setLoading(false)
    }
  }

  function handleConnect(connectUrl: string) {
    window.location.href = connectUrl
  }

  if (loading) {
    return (
      <div className="p-6 text-center text-sm text-neutral-400">Loading connections...</div>
    )
  }

  return (
    <div className="border border-neutral-200 dark:border-neutral-800 p-4">
      <h3 className="font-serif text-sm font-medium mb-3">Calendar Connections</h3>
      <div className="space-y-2">
        {PROVIDERS.map((provider) => {
          const conn = connections.find((c) => c.provider === provider.id)
          return (
            <div key={provider.id} className="flex items-center justify-between py-2">
              <div className="flex items-center gap-2">
                <span className={`w-3 h-3 ${provider.color}`} />
                <span className="text-sm">{provider.name}</span>
              </div>
              {conn ? (
                <span className={`text-xs px-2 py-0.5 ${
                  conn.status === 'active' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                  conn.status === 'revoked' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                  'bg-[#C9A96E]/10 text-[#C9A96E]'
                }`}>
                  {conn.status}
                </span>
              ) : (
                <button
                  onClick={() => handleConnect(provider.connectUrl)}
                  className="text-xs text-[#C9A96E] hover:underline"
                >
                  Connect
                </button>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
