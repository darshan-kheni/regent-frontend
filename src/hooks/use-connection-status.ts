'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

export type ConnectionStatus = 'connected' | 'reconnecting' | 'disconnected'

export function useConnectionStatus(): ConnectionStatus {
  const [status, setStatus] = useState<ConnectionStatus>('connected')

  useEffect(() => {
    const supabase = createClient()
    const channel = supabase.channel('connection-monitor')

    channel.subscribe((subscribedStatus) => {
      if (subscribedStatus === 'SUBSCRIBED') {
        setStatus('connected')
      } else if (
        subscribedStatus === 'CLOSED' ||
        subscribedStatus === 'CHANNEL_ERROR'
      ) {
        setStatus('reconnecting')
      } else if (subscribedStatus === 'TIMED_OUT') {
        setStatus('disconnected')
      }
    })

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  return status
}
