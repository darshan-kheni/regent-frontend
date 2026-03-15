'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { api } from '@/lib/api'
import { useToast } from '@/providers/toast-provider'
import type { ServiceConfig, ServiceGroup } from '@/types/settings'

interface ServiceGroupDef {
  key: ServiceGroup
  title: string
  services: ServiceConfig[]
}

interface ServiceStats {
  activeCount: number
  totalCount: number
  modelCount: number
  dailyTokens: string
}

interface UseServiceConfigReturn {
  groups: ServiceGroupDef[]
  toggleService: (id: string, enabled: boolean) => Promise<void>
  stats: ServiceStats
  isLoading: boolean
}

const GROUP_META: Record<ServiceGroup, string> = {
  email_processing: 'Email Processing',
  intelligence: 'Intelligence',
  ai_behavior: 'AI Behavior',
  notifications: 'Notifications',
}

const GROUP_ORDER: ServiceGroup[] = [
  'email_processing',
  'intelligence',
  'ai_behavior',
  'notifications',
]

/** V12 prototype service definitions */
const DEFAULT_SERVICES: ServiceConfig[] = [
  // Email Processing (6)
  {
    id: 'email_fetching',
    name: 'Email Fetching',
    description: 'IMAP and Gmail API email retrieval',
    group: 'email_processing',
    icon: 'Download',
    model: null,
    enabled: true,
    status: 'active',
    is_coming_soon: false,
  },
  {
    id: 'email_sending',
    name: 'Email Sending',
    description: 'Outbound email delivery via SMTP',
    group: 'email_processing',
    icon: 'Send',
    model: null,
    enabled: true,
    status: 'active',
    is_coming_soon: false,
  },
  {
    id: 'categorization',
    name: 'Categorization',
    description: 'AI-powered email category assignment',
    group: 'email_processing',
    icon: 'Tags',
    model: 'qwen3:4b',
    enabled: true,
    status: 'active',
    is_coming_soon: false,
  },
  {
    id: 'priority_scoring',
    name: 'Priority Scoring',
    description: 'Importance and urgency scoring for emails',
    group: 'email_processing',
    icon: 'ArrowUpDown',
    model: 'qwen3:4b',
    enabled: true,
    status: 'active',
    is_coming_soon: false,
  },
  {
    id: 'tone_classification',
    name: 'Tone Classification',
    description: 'Sentiment and tone analysis of messages',
    group: 'email_processing',
    icon: 'Smile',
    model: 'qwen3:4b',
    enabled: true,
    status: 'active',
    is_coming_soon: false,
  },
  {
    id: 'summarization',
    name: 'Summarization',
    description: 'Executive summary generation for emails',
    group: 'email_processing',
    icon: 'FileText',
    model: 'qwen3:8b',
    enabled: true,
    status: 'active',
    is_coming_soon: false,
  },

  // Intelligence (7)
  {
    id: 'rag_embeddings',
    name: 'RAG Embeddings',
    description: 'Vector embeddings for semantic search',
    group: 'intelligence',
    icon: 'Database',
    model: 'nomic-embed-text',
    enabled: true,
    status: 'active',
    is_coming_soon: false,
  },
  {
    id: 'context_brief_matching',
    name: 'Context Brief Matching',
    description: 'Situational context injection into AI prompts',
    group: 'intelligence',
    icon: 'BookOpen',
    model: null,
    enabled: true,
    status: 'active',
    is_coming_soon: false,
  },
  {
    id: 'contact_enrichment',
    name: 'Contact Enrichment',
    description: 'Auto-populated contact data from email headers',
    group: 'intelligence',
    icon: 'UserPlus',
    model: 'qwen3:4b',
    enabled: true,
    status: 'active',
    is_coming_soon: false,
  },
  {
    id: 'standard_drafts',
    name: 'Standard Draft Replies',
    description: 'AI-generated reply drafts using gemma3:12b',
    group: 'intelligence',
    icon: 'PenLine',
    model: 'gemma3:12b',
    enabled: true,
    status: 'active',
    is_coming_soon: false,
  },
  {
    id: 'premium_drafts',
    name: 'Premium Draft Replies',
    description: 'High-quality drafts for sensitive communications',
    group: 'intelligence',
    icon: 'Crown',
    model: 'gpt-oss:120b',
    enabled: true,
    status: 'active',
    is_coming_soon: false,
  },
  {
    id: 'preference_learning',
    name: 'Preference Learning',
    description: 'Learns writing style and communication preferences',
    group: 'intelligence',
    icon: 'GraduationCap',
    model: 'qwen3:8b',
    enabled: true,
    status: 'active',
    is_coming_soon: false,
  },
  {
    id: 'preference_synthesis',
    name: 'Preference Synthesis',
    description: 'Weekly deep analysis of learned behavior patterns',
    group: 'intelligence',
    icon: 'Sparkles',
    model: 'gpt-oss:120b',
    enabled: true,
    status: 'active',
    is_coming_soon: false,
  },

  // AI Behavior (2)
  {
    id: 'behavior_intelligence',
    name: 'Behavior Intelligence',
    description: 'Communication patterns, productivity, and relationship scoring',
    group: 'ai_behavior',
    icon: 'Brain',
    model: 'qwen3:8b',
    enabled: true,
    status: 'active',
    is_coming_soon: false,
  },
  {
    id: 'wellness_reporting',
    name: 'Wellness Reporting',
    description: 'Weekly work-life balance and stress analysis reports',
    group: 'ai_behavior',
    icon: 'Heart',
    model: 'gpt-oss:120b',
    enabled: true,
    status: 'active',
    is_coming_soon: false,
  },

  // Notifications (2)
  {
    id: 'briefing_delivery',
    name: 'Briefing Delivery',
    description: 'SMS, push, and email digest notifications',
    group: 'notifications',
    icon: 'Bell',
    model: null,
    enabled: true,
    status: 'active',
    is_coming_soon: false,
  },
  {
    id: 'whatsapp_signal',
    name: 'WhatsApp / Signal',
    description: 'Secure messaging channel notifications',
    group: 'notifications',
    icon: 'MessageCircle',
    model: null,
    enabled: false,
    status: 'offline',
    is_coming_soon: false,
  },
]

export function useServiceConfig(): UseServiceConfigReturn {
  const [services, setServices] = useState<ServiceConfig[]>(DEFAULT_SERVICES)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    async function fetchServices() {
      try {
        // Backend returns the full service list with real enabled/status/plan data
        const data = await api.get<Array<{
          id: string; name: string; description: string; group: string;
          icon: string; model?: string; enabled: boolean; status: string;
          min_plan?: string; locked?: boolean;
        }>>('/modules/services')
        if (!cancelled && data && Array.isArray(data)) {
          const mapped: ServiceConfig[] = data.map((d) => ({
            id: d.id,
            name: d.name,
            description: d.description,
            group: (d.group || 'email_processing') as ServiceConfig['group'],
            icon: d.icon || 'Puzzle',
            model: d.model || null,
            enabled: d.enabled,
            status: (d.status === 'locked' ? 'locked' : d.status === 'disabled' ? 'disabled' : d.status === 'active' ? 'active' : 'offline') as ServiceConfig['status'],
            is_coming_soon: false,
            min_plan: d.min_plan,
            locked: d.locked,
          }))
          setServices(mapped)
        }
      } catch {
        // API failed — use defaults
      }
      if (!cancelled) {
        setIsLoading(false)
      }
    }

    fetchServices()

    return () => {
      cancelled = true
    }
  }, [])

  const { addToast } = useToast()

  const toggleService = useCallback(async (id: string, enabled: boolean) => {
    const svc = services.find((s) => s.id === id)
    setServices((prev) =>
      prev.map((s) => (s.id === id ? { ...s, enabled } : s))
    )
    try {
      await api.put(`/modules/services/${id}`, { enabled })
      addToast('success', `${svc?.name || 'Service'} ${enabled ? 'enabled' : 'disabled'}`)
    } catch {
      // Revert on failure
      setServices((prev) =>
        prev.map((s) => (s.id === id ? { ...s, enabled: !enabled } : s))
      )
      addToast('error', `Failed to update ${svc?.name || 'service'}`)
    }
  }, [services, addToast])

  const groups = useMemo<ServiceGroupDef[]>(() => {
    return GROUP_ORDER.map((key) => ({
      key,
      title: GROUP_META[key],
      services: services.filter((s) => s.group === key),
    }))
  }, [services])

  const [dailyTokens, setDailyTokens] = useState('0')

  // Fetch real daily token usage
  useEffect(() => {
    async function fetchTokens() {
      try {
        const data = await api.get<{ tokens_used: number }>('/analytics?period=today')
        if (data?.tokens_used != null) {
          const t = data.tokens_used
          if (t >= 1_000_000) setDailyTokens(`${(t / 1_000_000).toFixed(1)}M`)
          else if (t >= 1_000) setDailyTokens(`${(t / 1_000).toFixed(1)}K`)
          else setDailyTokens(String(t))
        }
      } catch {
        // Will show 0
      }
    }
    fetchTokens()
  }, [])

  const stats = useMemo<ServiceStats>(() => {
    const active = services.filter((s) => s.enabled && !s.is_coming_soon)
    const total = services.filter((s) => !s.is_coming_soon).length
    const models = new Set(
      services
        .filter((s) => s.model !== null && s.enabled)
        .map((s) => s.model)
    )
    return {
      activeCount: active.length,
      totalCount: total,
      modelCount: models.size,
      dailyTokens,
    }
  }, [services, dailyTokens])

  return { groups, toggleService, stats, isLoading }
}
