'use client'

import { useState, useCallback } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Brain, RefreshCw } from 'lucide-react'
import { Tabs, Button } from '@/components/ui'
import { OverviewTab } from '@/components/intelligence/overview-tab'
import { CommunicationTab } from '@/components/intelligence/communication-tab'
import { WLBTab } from '@/components/intelligence/wlb-tab'
import { RelationshipsTab } from '@/components/intelligence/relationships-tab'
import { ProductivityTab } from '@/components/intelligence/productivity-tab'
import { PlanGateOverlay } from '@/components/intelligence/plan-gate-overlay'
import { useOverview, useWLB, useProductivity } from '@/hooks/use-behavior-data'
import { api } from '@/lib/api'
import { useToast } from '@/providers/toast-provider'

const tabs = [
  { id: 'overview', label: 'Overview' },
  { id: 'communication', label: 'Communication' },
  { id: 'wlb', label: 'Work-Life Balance' },
  { id: 'relationships', label: 'Relationships' },
  { id: 'productivity', label: 'Productivity' },
]

export default function IntelligencePage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const activeTab = searchParams.get('tab') || 'overview'
  const { addToast } = useToast()

  const overview = useOverview()
  const wlb = useWLB()
  const productivity = useProductivity()

  const [isComputing, setIsComputing] = useState(false)

  // Determine plan gating from API responses
  const isFullyGated = overview.planGated
  const isBasicGated = wlb.planGated

  // Check if data is empty (needs initial computation) — look for any real data, not just the score
  const hasNoData = !overview.isLoading && !overview.data?.last_computed && !overview.planGated

  const handleCompute = useCallback(async () => {
    setIsComputing(true)
    try {
      await api.post('/intelligence/compute')
      addToast('success', 'Behavior intelligence computed. Refreshing...')
      // Reload to refetch all data
      setTimeout(() => window.location.reload(), 1000)
    } catch {
      addToast('error', 'Failed to compute intelligence data')
    } finally {
      setIsComputing(false)
    }
  }, [addToast])

  function handleTabChange(tab: string) {
    const params = new URLSearchParams(searchParams.toString())
    if (tab === 'overview') {
      params.delete('tab')
    } else {
      params.set('tab', tab)
    }
    const query = params.toString()
    router.push(`/intelligence${query ? `?${query}` : ''}`)
  }

  // Free plan: full-page gate
  if (isFullyGated) {
    return (
      <div className="space-y-6">
        <div>
          <h1
            className="font-display text-3xl"
            style={{ color: 'var(--text-primary)' }}
          >
            Behavior Intelligence
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
            AI-powered analysis of your communication patterns, work habits, and well-being
          </p>
        </div>
        <div className="relative min-h-[500px]">
          <PlanGateOverlay requiredPlan="attache" variant="full" />
        </div>
      </div>
    )
  }

  // No data computed yet — show prompt
  if (hasNoData) {
    return (
      <div className="space-y-6">
        <div>
          <h1
            className="font-display text-3xl"
            style={{ color: 'var(--text-primary)' }}
          >
            Behavior Intelligence
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
            AI-powered analysis of your communication patterns, work habits, and well-being
          </p>
        </div>
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <Brain className="h-16 w-16" style={{ color: 'var(--accent)' }} />
          <div className="text-center space-y-2">
            <p className="text-lg font-medium" style={{ color: 'var(--text-primary)' }}>
              Ready to analyze your behavior
            </p>
            <p className="text-sm max-w-md" style={{ color: 'var(--text-muted)' }}>
              Regent will analyze your email patterns, communication style, work-life balance,
              contact relationships, and productivity metrics from your existing data.
            </p>
          </div>
          <Button onClick={handleCompute} loading={isComputing}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Analyze My Behavior
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1
            className="font-display text-3xl"
            style={{ color: 'var(--text-primary)' }}
          >
            Behavior Intelligence
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
            AI-powered analysis of your communication patterns, work habits, and well-being
          </p>
        </div>
        <Button variant="secondary" onClick={handleCompute} loading={isComputing}>
          <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
          Refresh
        </Button>
      </div>

      <Tabs tabs={tabs} activeTab={activeTab} onTabChange={handleTabChange}>
        {activeTab === 'overview' && (
          <OverviewTab data={overview.data} isLoading={overview.isLoading} />
        )}
        {activeTab === 'communication' && (
          <CommunicationTab />
        )}
        {activeTab === 'wlb' && (
          <WLBTab data={wlb.data} isLoading={wlb.isLoading} planGated={isBasicGated} />
        )}
        {activeTab === 'relationships' && (
          <RelationshipsTab planGated={isBasicGated} />
        )}
        {activeTab === 'productivity' && (
          <ProductivityTab data={productivity.data} isLoading={productivity.isLoading} />
        )}
      </Tabs>
    </div>
  )
}
