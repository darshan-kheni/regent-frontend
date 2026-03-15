'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { api } from '@/lib/api'
import { useRealtimeSubscription } from '@/hooks/use-realtime'

export interface PipelineJob {
  email_id: string
  subject: string
  stage: string
  started_at: string
  position?: number
  est_start?: string
}

export interface PipelineRecent {
  email_id: string
  subject: string
  stage: string
  completed_at: string
  has_draft: boolean
}

interface PipelineStats {
  total: number
  complete: number
  processing: number
  queued: number
  error: number
}

export interface PipelineStatus {
  active: PipelineJob[]
  recent: PipelineRecent[]
  queued: PipelineJob[]
  stats: PipelineStats
  queue_depth: number
  avg_secs_per_email: number
  redis_queue_depth: number
  cron_interval_secs: number
  cron_batch_size: number
  next_cron_run?: string
}

export function usePipelineStatus() {
  const [status, setStatus] = useState<PipelineStatus | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const fetchStatus = useCallback(async () => {
    try {
      const data = await api.get<PipelineStatus>('/pipeline/status')
      setStatus(data)
    } catch {
      // silently ignore — widget is informational
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Initial fetch + poll every 5 seconds
  useEffect(() => {
    fetchStatus()
    intervalRef.current = setInterval(fetchStatus, 5000)
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [fetchStatus])

  // Realtime: re-fetch immediately when email_ai_status changes
  useRealtimeSubscription<{ email_id: string; stage: string }>({
    table: 'email_ai_status',
    event: '*',
    onInsert: () => fetchStatus(),
    onUpdate: () => fetchStatus(),
  })

  return { status, isLoading, refetch: fetchStatus }
}
