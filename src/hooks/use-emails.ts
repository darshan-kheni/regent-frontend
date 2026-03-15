'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { api } from '@/lib/api'
import { useRealtimeSubscription } from '@/hooks/use-realtime'
import { useEmailStore } from '@/stores/email-store'
import type { Email } from '@/types/email'

interface UseEmailsOptions {
  accountId?: string | null
  category?: string
  limit?: number
}

interface EmailListResponse {
  emails: Email[]
  total: number
  page: number
  limit: number
  category_counts?: Record<string, number>
}

interface UseEmailsReturn {
  emails: Email[]
  total: number
  page: number
  totalPages: number
  isLoading: boolean
  isPageLoading: boolean
  categoryCounts: Record<string, number>
  goToPage: (page: number) => void
  refetch: () => void
}

export function useEmails(options: UseEmailsOptions = {}): UseEmailsReturn {
  const { accountId, category, limit = 50 } = options
  const [isLoading, setIsLoading] = useState(true) // first load only
  const [isPageLoading, setIsPageLoading] = useState(false) // page switches
  const [page, setPage] = useState(1)
  const fetchIdRef = useRef(0)
  const hasLoadedOnce = useRef(false)

  const [total, setTotal] = useState(0)
  const [categoryCounts, setCategoryCounts] = useState<Record<string, number>>({})
  const { setEmails, addEmail, updateEmail, emails } = useEmailStore()

  const fetchPage = useCallback(async (p: number, isFilterChange = false) => {
    const currentFetchId = ++fetchIdRef.current

    // Only show full skeleton on first load or filter change
    if (!hasLoadedOnce.current || isFilterChange) {
      setIsLoading(true)
    } else {
      setIsPageLoading(true)
    }

    try {
      const params = new URLSearchParams()
      if (accountId) params.set('account_id', accountId)
      if (category && category !== 'all') params.set('category', category)
      params.set('page', String(p))
      params.set('limit', String(limit))

      const resp = await api.get<EmailListResponse>(`/emails?${params.toString()}`)

      if (currentFetchId === fetchIdRef.current) {
        setEmails(resp.emails ?? [])
        setTotal(resp.total ?? 0)
        if (resp.category_counts) {
          setCategoryCounts(resp.category_counts)
        }
        setPage(p)
        hasLoadedOnce.current = true
      }
    } catch {
      if (currentFetchId === fetchIdRef.current) {
        setEmails([])
        setTotal(0)
      }
    } finally {
      if (currentFetchId === fetchIdRef.current) {
        setIsLoading(false)
        setIsPageLoading(false)
      }
    }
  }, [accountId, category, limit, setEmails])

  // Reset to page 1 when filters change
  useEffect(() => {
    hasLoadedOnce.current = false
    fetchPage(1, true)
  }, [fetchPage])

  const goToPage = useCallback((p: number) => {
    const maxPage = Math.max(1, Math.ceil(total / limit))
    const target = Math.max(1, Math.min(p, maxPage))
    fetchPage(target)
  }, [total, limit, fetchPage])

  const refetch = useCallback(() => {
    fetchPage(page)
  }, [fetchPage, page])

  // Realtime subscription for live email updates
  useRealtimeSubscription<Email>({
    table: 'emails',
    event: '*',
    filter: accountId ? `account_id=eq.${accountId}` : undefined,
    onInsert: (newEmail) => {
      if (!category || category === 'all' || newEmail.category === category) {
        addEmail(newEmail)
      }
    },
    onUpdate: (updatedEmail) => {
      updateEmail(updatedEmail.id, updatedEmail)
    },
  })

  const totalPages = Math.max(1, Math.ceil(total / limit))

  return {
    emails,
    total,
    page,
    totalPages,
    isLoading,
    isPageLoading,
    categoryCounts,
    goToPage,
    refetch,
  }
}
