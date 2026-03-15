'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { api } from '@/lib/api'
import { useRealtimeSubscription } from '@/hooks/use-realtime'
import type { AnalyticsData, ServiceBreakdown } from '@/types/analytics'

export type AnalyticsPeriod = 'today' | 'week' | 'month'

interface UseAnalyticsReturn {
  data: AnalyticsData | null
  services: ServiceBreakdown[]
  period: AnalyticsPeriod
  setPeriod: (period: AnalyticsPeriod) => void
  isLoading: boolean
}

export function useAnalytics(): UseAnalyticsReturn {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [services, setServices] = useState<ServiceBreakdown[]>([])
  const [period, setPeriod] = useState<AnalyticsPeriod>('today')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    async function fetchAnalytics() {
      setIsLoading(true)

      try {
        const analyticsData = await api.get<AnalyticsData>(`/analytics?period=${period}`)
        if (!cancelled) {
          setData(analyticsData)
        }
      } catch {
        // Analytics fetch failed — will show empty state
      }

      try {
        const serviceData = await api.get<ServiceBreakdown[]>(`/analytics/services?period=${period}`)
        if (!cancelled) {
          setServices(serviceData)
        }
      } catch {
        // Services fetch failed — will show empty table
      }

      if (!cancelled) {
        setIsLoading(false)
      }
    }

    fetchAnalytics()

    return () => {
      cancelled = true
    }
  }, [period])

  // Auto-refresh analytics when new AI activity occurs
  const refreshTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const periodRef = useRef(period)
  periodRef.current = period

  const scheduleRefresh = useCallback(() => {
    // Debounce: refresh at most once every 10 seconds
    if (refreshTimerRef.current) return
    refreshTimerRef.current = setTimeout(async () => {
      refreshTimerRef.current = null
      try {
        const analyticsData = await api.get<AnalyticsData>(`/analytics?period=${periodRef.current}`)
        if (analyticsData) setData(analyticsData)
      } catch {
        // Silently fail
      }
    }, 10_000)
  }, [])

  useRealtimeSubscription<Record<string, unknown>>({
    table: 'ai_audit_log',
    event: 'INSERT',
    onInsert: scheduleRefresh,
  })

  useEffect(() => {
    return () => {
      if (refreshTimerRef.current) clearTimeout(refreshTimerRef.current)
    }
  }, [])

  return { data, services, period, setPeriod, isLoading }
}
