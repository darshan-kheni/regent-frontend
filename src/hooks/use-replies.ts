'use client'

import { useEffect, useState, useCallback } from 'react'
import { api } from '@/lib/api'
import { useRealtimeSubscription } from '@/hooks/use-realtime'
import { useOptimisticMutation } from '@/hooks/use-optimistic-mutation'
import { useToast } from '@/providers/toast-provider'
import type { DraftReply } from '@/types/email'

interface UseRepliesReturn {
  replies: DraftReply[]
  isLoading: boolean
  approve: (id: string) => Promise<void>
  refine: (id: string, body: string) => Promise<void>
  reject: (id: string) => Promise<void>
}

export function useReplies(): UseRepliesReturn {
  const [isLoading, setIsLoading] = useState(true)
  const { addToast } = useToast()

  const [replies, setReplies, mutate] = useOptimisticMutation<DraftReply[]>([])

  useEffect(() => {
    let cancelled = false
    async function fetchReplies() {
      try {
        const data = await api.get<DraftReply[]>('/drafts?status=pending')
        if (!cancelled) {
          setReplies(data)
        }
      } catch {
        if (!cancelled) {
          addToast('error', 'Failed to load draft replies')
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false)
        }
      }
    }
    fetchReplies()
    return () => { cancelled = true }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useRealtimeSubscription<DraftReply>({
    table: 'draft_replies',
    event: '*',
    onInsert: (draft) => {
      if (draft.status === 'pending') {
        setReplies((prev) => [draft, ...prev])
      }
    },
    onUpdate: (draft) => {
      if (draft.status !== 'pending') {
        setReplies((prev) => prev.filter((r) => r.id !== draft.id))
      } else {
        setReplies((prev) => prev.map((r) => (r.id === draft.id ? draft : r)))
      }
    },
    onDelete: (payload) => {
      setReplies((prev) => prev.filter((r) => r.id !== payload.id))
    },
  })

  const approve = useCallback(
    async (id: string) => {
      try {
        await mutate({
          onMutate: (current) => current.filter((r) => r.id !== id),
          mutationFn: () => api.post<void>(`/drafts/${id}/approve`),
        })
        addToast('success', 'Draft approved and queued for sending')
      } catch {
        addToast('error', 'Failed to approve draft. Please try again.')
      }
    },
    [mutate, addToast]
  )

  const refine = useCallback(
    async (id: string, body: string) => {
      try {
        await api.put(`/drafts/${id}`, { body })
        setReplies((prev) =>
          prev.map((r) => (r.id === id ? { ...r, body } : r))
        )
        addToast('success', 'Draft updated')
      } catch {
        addToast('error', 'Failed to update draft')
      }
    },
    [setReplies, addToast]
  )

  const reject = useCallback(
    async (id: string) => {
      try {
        await mutate({
          onMutate: (current) => current.filter((r) => r.id !== id),
          mutationFn: () => api.post<void>(`/drafts/${id}/reject`),
        })
        addToast('info', 'Draft rejected')
      } catch {
        addToast('error', 'Failed to reject draft')
      }
    },
    [mutate, addToast]
  )

  return { replies, isLoading, approve, refine, reject }
}
