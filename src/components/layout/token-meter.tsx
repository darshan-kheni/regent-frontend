'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import { ProgressBar } from '@/components/ui'
import { useRealtimeSubscription } from '@/hooks/use-realtime'
import { api } from '@/lib/api'
import { formatTokenCount } from '@/lib/utils'

interface AnalyticsResponse {
  tokens_used: number
  tokens_limit: number
  plan_name?: string
}

export function TokenMeter() {
  const [tokensUsed, setTokensUsed] = useState(0)
  const [tokenLimit, setTokenLimit] = useState(0)
  const [planName, setPlanName] = useState('')
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const fetchTokens = useCallback(async () => {
    try {
      const data = await api.get<AnalyticsResponse>('/analytics?period=today')
      if (data) {
        setTokensUsed(data.tokens_used ?? 0)
        if (data.tokens_limit) setTokenLimit(data.tokens_limit)
        if (data.plan_name) setPlanName(data.plan_name)
      }
    } catch {
      // Silently handle
    }
  }, [])

  // Initial fetch + poll every 30 seconds
  useEffect(() => {
    fetchTokens()
    intervalRef.current = setInterval(fetchTokens, 30_000)
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [fetchTokens])

  // Realtime: refresh when new AI audit entries are created
  useRealtimeSubscription<{ id: string }>({
    table: 'ai_audit_log',
    event: 'INSERT',
    onInsert: () => fetchTokens(),
  })

  const isUnlimited = planName === 'estate' || tokenLimit >= 999999999
  const percentage = isUnlimited ? 0 : (tokenLimit > 0 ? (tokensUsed / tokenLimit) * 100 : 0)

  return (
    <div className="space-y-1">
      {!isUnlimited && <ProgressBar value={percentage} />}
      <p
        className="text-xs font-mono tabular-nums"
        style={{ color: !isUnlimited && percentage > 90 ? 'var(--color-critical, #D4645D)' : 'var(--text-muted)' }}
      >
        {formatTokenCount(tokensUsed)} {isUnlimited ? 'tokens (unlimited)' : `/ ${formatTokenCount(tokenLimit)} tokens`}
      </p>
    </div>
  )
}
