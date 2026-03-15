'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { api } from '@/lib/api'
import { useRealtimeSubscription } from '@/hooks/use-realtime'
import type { AuditEntry, AuditEventType } from '@/types/analytics'

type AuditFilter = 'all' | AuditEventType

interface Pagination {
  page: number
  limit: number
  total: number
  hasMore: boolean
}

interface UseAuditLogReturn {
  entries: AuditEntry[]
  filters: AuditFilter
  setFilter: (filter: AuditFilter) => void
  search: string
  setSearch: (query: string) => void
  pagination: Pagination
  isLoading: boolean
  goToPage: (page: number) => void
}

export function useAuditLog(): UseAuditLogReturn {
  const [entries, setEntries] = useState<AuditEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filters, setFilter] = useState<AuditFilter>('all')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 50,
    total: 0,
    hasMore: false,
  })
  const fetchIdRef = useRef(0)

  const fetchEntries = useCallback(async () => {
    const currentFetchId = ++fetchIdRef.current
    setIsLoading(true)

    try {
      const params = new URLSearchParams()
      if (filters !== 'all') params.set('type', filters)
      if (search) params.set('search', search)
      params.set('page', String(page))
      params.set('limit', '50')

      const data = await api.get<AuditEntry[]>(`/audit-log?${params.toString()}`)

      if (currentFetchId === fetchIdRef.current) {
        setEntries(data)
        setPagination({
          page,
          limit: 50,
          total: data.length,
          hasMore: data.length === 50,
        })
      }
    } catch {
      if (currentFetchId === fetchIdRef.current) {
        setEntries([])
      }
    } finally {
      if (currentFetchId === fetchIdRef.current) {
        setIsLoading(false)
      }
    }
  }, [filters, search, page])

  useEffect(() => {
    fetchEntries()
  }, [fetchEntries])

  // Reset to page 1 when filter or search changes
  useEffect(() => {
    setPage(1)
  }, [filters, search])

  // Realtime: prepend new audit entries
  useRealtimeSubscription<AuditEntry>({
    table: 'ai_audit_log',
    event: 'INSERT',
    onInsert: (newEntry) => {
      // Only prepend if it matches current filter
      if (filters === 'all' || newEntry.event_type === filters) {
        setEntries((prev) => [newEntry, ...prev])
      }
    },
  })

  const goToPage = useCallback((newPage: number) => {
    setPage(newPage)
  }, [])

  return {
    entries,
    filters,
    setFilter,
    search,
    setSearch,
    pagination,
    isLoading,
    goToPage,
  }
}

export type { AuditFilter }
