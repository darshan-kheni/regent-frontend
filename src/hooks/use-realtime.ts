'use client'

import { useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { RealtimeChannel } from '@supabase/supabase-js'

type RealtimeEvent = 'INSERT' | 'UPDATE' | 'DELETE' | '*'

interface UseRealtimeOptions<T> {
  table: string
  event?: RealtimeEvent
  schema?: string
  filter?: string
  onInsert?: (payload: T) => void
  onUpdate?: (payload: T) => void
  onDelete?: (payload: { id: string }) => void
  enabled?: boolean
}

export function useRealtimeSubscription<T>(opts: UseRealtimeOptions<T>): void {
  const channelRef = useRef<RealtimeChannel | null>(null)

  useEffect(() => {
    if (opts.enabled === false) return

    const supabase = createClient()
    const channelName = `realtime-${opts.table}-${opts.filter || 'all'}`

    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: opts.event ?? '*',
          schema: opts.schema ?? 'public',
          table: opts.table,
          ...(opts.filter ? { filter: opts.filter } : {}),
        },
        (payload) => {
          if (payload.eventType === 'INSERT') opts.onInsert?.(payload.new as T)
          if (payload.eventType === 'UPDATE') opts.onUpdate?.(payload.new as T)
          if (payload.eventType === 'DELETE')
            opts.onDelete?.(payload.old as { id: string })
        }
      )
      .subscribe()

    channelRef.current = channel

    return () => {
      supabase.removeChannel(channel)
    }
    // Dependencies are minimal to avoid unnecessary re-subscriptions.
    // Callbacks are accessed via closure — consumers should use useEffectEvent
    // or useRef-based patterns if they need latest state in callbacks.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [opts.table, opts.filter, opts.enabled])
}
