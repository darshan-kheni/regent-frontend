'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { api } from '@/lib/api'
import { useRealtimeSubscription } from '@/hooks/use-realtime'

export interface SummaryItem {
  email_id: string
  account_id: string
  from_address: string
  from_name: string
  subject: string
  has_attachments: boolean
  received_at: string
  category: string
  confidence: number
  headline: string
  action_required: boolean
  tone: string
}

interface SummariesResponse {
  summaries: SummaryItem[]
  total: number
  page: number
  limit: number
}

interface UseSummariesOptions {
  accountId?: string | null
  category?: string
  date?: string | null      // YYYY-MM-DD for single day
  from?: string | null      // YYYY-MM-DD range start
  to?: string | null        // YYYY-MM-DD range end
  limit?: number
}

interface UseSummariesReturn {
  summaries: SummaryItem[]
  total: number
  page: number
  totalPages: number
  isLoading: boolean
  goToPage: (page: number) => void
  refetch: () => void
}

export function useSummaries(options: UseSummariesOptions = {}): UseSummariesReturn {
  const { accountId, category, date, from, to, limit = 50 } = options
  const [summaries, setSummaries] = useState<SummaryItem[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const fetchIdRef = useRef(0)

  const fetchPage = useCallback(async (p: number) => {
    const currentFetchId = ++fetchIdRef.current
    setIsLoading(true)

    try {
      const params = new URLSearchParams()
      if (accountId) params.set('account_id', accountId)
      if (category && category !== 'all') params.set('category', category)
      if (date) params.set('date', date)
      if (from) params.set('from', from)
      if (to) params.set('to', to)
      params.set('page', String(p))
      params.set('limit', String(limit))

      const resp = await api.get<SummariesResponse>(`/summaries?${params.toString()}`)

      if (currentFetchId === fetchIdRef.current) {
        setSummaries(resp.summaries ?? [])
        setTotal(resp.total ?? 0)
        setPage(p)
      }
    } catch {
      if (currentFetchId === fetchIdRef.current) {
        setSummaries([])
        setTotal(0)
      }
    } finally {
      if (currentFetchId === fetchIdRef.current) {
        setIsLoading(false)
      }
    }
  }, [accountId, category, date, from, to, limit])

  // Reset to page 1 when filters change
  useEffect(() => {
    fetchPage(1)
  }, [fetchPage])

  const goToPage = useCallback((p: number) => {
    const maxPage = Math.max(1, Math.ceil(total / limit))
    fetchPage(Math.max(1, Math.min(p, maxPage)))
  }, [total, limit, fetchPage])

  const refetch = useCallback(() => {
    fetchPage(page)
  }, [fetchPage, page])

  // Realtime: refresh when new summaries are created
  useRealtimeSubscription<{ email_id: string }>({
    table: 'email_summaries',
    event: 'INSERT',
    onInsert: () => refetch(),
  })

  const totalPages = Math.max(1, Math.ceil(total / limit))

  return { summaries, total, page, totalPages, isLoading, goToPage, refetch }
}
