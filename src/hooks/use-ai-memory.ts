'use client'

import { useEffect, useState, useCallback } from 'react'
import { api } from '@/lib/api'
import { useOptimisticMutation } from '@/hooks/use-optimistic-mutation'
import { useToast } from '@/providers/toast-provider'
import type { UserRule, ContextBrief, LearnedPattern } from '@/types/ai-memory'

interface PlanLimit {
  used: number
  max: number
  briefsUsed: number
  briefsMax: number
  patternsMax: number
}

// Plan-based limits from CLAUDE.md billing tiers
const PLAN_LIMITS: Record<string, { rules: number; briefs: number; patterns: number }> = {
  free:          { rules: 10,  briefs: 3,   patterns: 0 },
  attache:       { rules: 25,  briefs: 10,  patterns: 25 },
  privy_council: { rules: 50,  briefs: 25,  patterns: 50 },
  estate:        { rules: 999, briefs: 999, patterns: 999 }, // unlimited
}

interface AddRulePayload {
  scope: UserRule['scope']
  type: string
  instruction: string
  contact_filter: string | null
}

interface AddBriefPayload {
  title: string
  scope: string
  context: string
  keywords: string[]
  expires_at: string | null
}

interface UseAiMemoryReturn {
  rules: UserRule[]
  briefs: ContextBrief[]
  patterns: LearnedPattern[]
  planLimit: PlanLimit
  addRule: (payload: AddRulePayload) => Promise<void>
  toggleRule: (id: string) => Promise<void>
  deleteRule: (id: string) => Promise<void>
  addBrief: (payload: AddBriefPayload) => Promise<void>
  deleteBrief: (id: string) => Promise<void>
  refreshPatterns: () => Promise<void>
  isLoading: boolean
}

export function useAiMemory(): UseAiMemoryReturn {
  const [isLoading, setIsLoading] = useState(true)
  const { addToast } = useToast()

  const [rules, setRules, mutateRules] = useOptimisticMutation<UserRule[]>([])
  const [briefs, setBriefs, mutateBriefs] = useOptimisticMutation<ContextBrief[]>([])
  const [patterns, setPatterns] = useState<LearnedPattern[]>([])
  const [planLimit, setPlanLimit] = useState<PlanLimit>({ used: 0, max: 10, briefsUsed: 0, briefsMax: 3, patternsMax: 0 })

  useEffect(() => {
    let cancelled = false

    async function fetchData() {
      try {
        const [rulesData, briefsData, patternsData, analyticsData] = await Promise.all([
          api.get<UserRule[]>('/user-rules'),
          api.get<ContextBrief[]>('/context-briefs'),
          api.get<LearnedPattern[]>('/learned-patterns'),
          api.get<{ plan_name?: string }>('/analytics?period=today'),
        ])

        if (!cancelled) {
          setRules(rulesData)
          setBriefs(briefsData)
          setPatterns(patternsData)

          const plan = analyticsData?.plan_name || 'free'
          const limits = PLAN_LIMITS[plan] || PLAN_LIMITS.free
          setPlanLimit({
            used: rulesData.length,
            max: limits.rules,
            briefsUsed: briefsData.length,
            briefsMax: limits.briefs,
            patternsMax: limits.patterns,
          })
        }
      } catch {
        if (!cancelled) {
          addToast('error', 'Failed to load AI memory data')
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false)
        }
      }
    }

    fetchData()
    return () => { cancelled = true }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const addRule = useCallback(
    async (payload: AddRulePayload) => {
      try {
        const newRule = await api.post<UserRule>('/user-rules', payload)
        setRules((prev) => [newRule, ...prev])
        setPlanLimit((prev) => ({ ...prev, used: prev.used + 1 }))
        addToast('success', 'Rule added')
      } catch {
        addToast('error', 'Failed to add rule')
      }
    },
    [setRules, addToast]
  )

  const toggleRule = useCallback(
    async (id: string) => {
      try {
        await mutateRules({
          onMutate: (current) =>
            current.map((r) => (r.id === id ? { ...r, active: !r.active } : r)),
          mutationFn: async () => {
            const rule = rules.find((r) => r.id === id)
            if (!rule) return
            await api.put(`/user-rules/${id}`, { active: !rule.active })
          },
        })
      } catch {
        addToast('error', 'Failed to toggle rule')
      }
    },
    [mutateRules, rules, addToast]
  )

  const deleteRule = useCallback(
    async (id: string) => {
      try {
        await mutateRules({
          onMutate: (current) => current.filter((r) => r.id !== id),
          mutationFn: () => api.delete(`/user-rules/${id}`),
        })
        setPlanLimit((prev) => ({ ...prev, used: Math.max(0, prev.used - 1) }))
        addToast('success', 'Rule deleted')
      } catch {
        addToast('error', 'Failed to delete rule')
      }
    },
    [mutateRules, addToast]
  )

  const addBrief = useCallback(
    async (payload: AddBriefPayload) => {
      try {
        const newBrief = await api.post<ContextBrief>('/context-briefs', payload)
        setBriefs((prev) => [newBrief, ...prev])
        addToast('success', 'Context brief added')
      } catch {
        addToast('error', 'Failed to add context brief')
      }
    },
    [setBriefs, addToast]
  )

  const deleteBrief = useCallback(
    async (id: string) => {
      try {
        await mutateBriefs({
          onMutate: (current) => current.filter((b) => b.id !== id),
          mutationFn: () => api.delete(`/context-briefs/${id}`),
        })
        addToast('success', 'Context brief deleted')
      } catch {
        addToast('error', 'Failed to delete context brief')
      }
    },
    [mutateBriefs, addToast]
  )

  const refreshPatterns = useCallback(async () => {
    try {
      const patternsData = await api.get<LearnedPattern[]>('/learned-patterns')
      setPatterns(patternsData)
    } catch {
      // silently fail
    }
  }, [])

  return {
    rules,
    briefs,
    patterns,
    planLimit,
    addRule,
    toggleRule,
    deleteRule,
    addBrief,
    deleteBrief,
    refreshPatterns,
    isLoading,
  }
}
