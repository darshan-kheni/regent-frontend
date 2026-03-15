'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { api } from '@/lib/api'
import { useRealtimeSubscription } from '@/hooks/use-realtime'
import type { DashboardStats, AuditEntry } from '@/types/analytics'

interface UseDashboardDataReturn {
  stats: DashboardStats | null
  activities: AuditEntry[]
  isLoading: boolean
}

export function useDashboardData(): UseDashboardDataReturn {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [activities, setActivities] = useState<AuditEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const activitiesRef = useRef(activities)
  activitiesRef.current = activities

  useEffect(() => {
    let cancelled = false

    async function fetchData() {
      try {
        const data = await api.get<DashboardStats>('/dashboard/stats')
        if (!cancelled) {
          setStats({
            emails_today: data?.emails_today ?? 0,
            emails_total: data?.emails_total ?? 0,
            ai_processed: data?.ai_processed ?? 0,
            pending_replies: data?.pending_replies ?? 0,
            active_connections: data?.active_connections ?? 0,
            avg_response_minutes: data?.avg_response_minutes ?? null,
            ai_composed: data?.ai_composed ?? 0,
            category_distribution: data?.category_distribution ?? [],
            connected_accounts: data?.connected_accounts ?? [],
            requires_attention: data?.requires_attention ?? [],
          })
        }
      } catch {
        // Stats fetch failed — will show empty state
      }

      try {
        const entries = await api.get<AuditEntry[]>('/audit-log?limit=20')
        if (!cancelled) {
          setActivities(entries ?? [])
        }
      } catch {
        // Audit log fetch failed — will show empty feed
      }

      if (!cancelled) {
        setIsLoading(false)
      }
    }

    fetchData()

    return () => {
      cancelled = true
    }
  }, [])

  const handleEmailInsert = useCallback(() => {
    setStats((prev) => {
      if (!prev) return prev
      return { ...prev, emails_today: prev.emails_today + 1 }
    })
  }, [])

  const handleAuditInsert = useCallback((entry: AuditEntry) => {
    setActivities((prev) => [entry, ...prev].slice(0, 20))
  }, [])

  useRealtimeSubscription<Record<string, unknown>>({
    table: 'emails',
    event: 'INSERT',
    onInsert: handleEmailInsert,
  })

  useRealtimeSubscription<AuditEntry>({
    table: 'ai_audit_log',
    event: 'INSERT',
    onInsert: handleAuditInsert,
  })

  // Live update when AI finishes processing
  const handleCategoryInsert = useCallback(() => {
    setStats((prev) => {
      if (!prev) return prev
      return { ...prev, ai_processed: prev.ai_processed + 1 }
    })
  }, [])

  const handleDraftInsert = useCallback(() => {
    setStats((prev) => {
      if (!prev) return prev
      return {
        ...prev,
        ai_composed: prev.ai_composed + 1,
        pending_replies: prev.pending_replies + 1,
      }
    })
  }, [])

  useRealtimeSubscription<Record<string, unknown>>({
    table: 'email_categories',
    event: 'INSERT',
    onInsert: handleCategoryInsert,
  })

  useRealtimeSubscription<Record<string, unknown>>({
    table: 'draft_replies',
    event: 'INSERT',
    onInsert: handleDraftInsert,
  })

  return { stats, activities, isLoading }
}
