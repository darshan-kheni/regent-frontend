'use client'

import { useEffect, useRef } from 'react'
import { api } from '@/lib/api'

/**
 * TimezoneSync auto-detects the user's browser timezone on first load
 * and saves it to their profile if it's not already set or is "UTC".
 * Runs once per session (tracked via sessionStorage).
 */
export function TimezoneSync() {
  const synced = useRef(false)

  useEffect(() => {
    if (synced.current) return
    if (typeof window === 'undefined') return
    if (sessionStorage.getItem('tz_synced')) return

    synced.current = true

    async function syncTimezone() {
      try {
        const browserTZ = Intl.DateTimeFormat().resolvedOptions().timeZone
        if (!browserTZ) return

        // Check current profile timezone
        const profile = await api.get<{ timezone?: string }>('/settings/profile')
        const currentTZ = profile?.timezone

        // Only auto-set if timezone is empty, null, or UTC (default)
        if (!currentTZ || currentTZ === 'UTC') {
          await api.put('/settings/profile', { timezone: browserTZ })
        }

        sessionStorage.setItem('tz_synced', '1')
      } catch {
        // Silently fail — non-critical
      }
    }

    syncTimezone()
  }, [])

  return null
}
