'use client'

import { useState, useEffect, useCallback } from 'react'
import { api } from '@/lib/api'
import { useToast } from '@/providers/toast-provider'
import type {
  OverviewData,
  CommunicationMetrics,
  WLBData,
  StressIndicator,
  RelationshipsResponse,
  ProductivityMetrics,
  WellnessReport,
  UserCalibration,
} from '@/types/behavior'

interface FetchState<T> {
  data: T | null
  isLoading: boolean
  error: string | null
  planGated: boolean
}

function useFetch<T>(path: string | null): FetchState<T> {
  const [state, setState] = useState<FetchState<T>>({
    data: null,
    isLoading: !!path,
    error: null,
    planGated: false,
  })

  useEffect(() => {
    if (!path) return

    let cancelled = false
    setState((s) => ({ ...s, isLoading: true, error: null }))

    api.get<T>(path)
      .then((data) => {
        if (cancelled) return
        setState({ data, isLoading: false, error: null, planGated: false })
      })
      .catch((err) => {
        if (cancelled) return
        const msg = err?.message || 'Request failed'
        const planGated = msg.includes('402') || msg.includes('PLAN_REQUIRED') || msg.includes('plan_limit')
        setState({ data: null, isLoading: false, error: planGated ? null : msg, planGated })
      })

    return () => {
      cancelled = true
    }
  }, [path])

  return state
}

export function useOverview() {
  return useFetch<OverviewData>('/intelligence/overview')
}

export function useCommunication(period: 'daily' | 'weekly' | 'monthly' = 'daily') {
  return useFetch<CommunicationMetrics>(`/intelligence/communication?period=${period}`)
}

export function useWLB() {
  return useFetch<WLBData>('/intelligence/wlb')
}

export function useStress() {
  return useFetch<StressIndicator[]>('/intelligence/stress')
}

export function useRelationships(
  sortBy: string = 'interaction_count',
  limit: number = 20,
  offset: number = 0
) {
  return useFetch<RelationshipsResponse>(
    `/intelligence/relationships?sort_by=${sortBy}&limit=${limit}&offset=${offset}`
  )
}

export function useProductivity() {
  return useFetch<ProductivityMetrics>('/intelligence/productivity')
}

export function useWellnessReports(limit: number = 4) {
  return useFetch<WellnessReport[]>(`/intelligence/wellness-reports?limit=${limit}`)
}

export function useUpdateCalibration() {
  const [isUpdating, setIsUpdating] = useState(false)
  const { addToast } = useToast()

  const update = useCallback(async (calibration: UserCalibration): Promise<boolean> => {
    setIsUpdating(true)
    try {
      await api.put('/settings/behavior', calibration)
      addToast('success', 'Calibration saved')
      return true
    } catch {
      addToast('error', 'Failed to save calibration')
      return false
    } finally {
      setIsUpdating(false)
    }
  }, [addToast])

  return { update, isUpdating }
}
