'use client'

import { useState } from 'react'
import { useAiMemory } from '@/hooks/use-ai-memory'
import { Tabs, Skeleton } from '@/components/ui'
import { RulesTab } from '@/components/behavior/rules-tab'
import { BriefsTab } from '@/components/behavior/briefs-tab'
import { LearnedTab } from '@/components/behavior/learned-tab'

const tabs = [
  { id: 'rules', label: 'Rules' },
  { id: 'briefs', label: 'Context Briefs' },
  { id: 'patterns', label: 'Learned Patterns' },
]

export default function BehaviorPage() {
  const [activeTab, setActiveTab] = useState('rules')
  const {
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
  } = useAiMemory()

  return (
    <div className="space-y-6">
      <h1
        className="font-display text-3xl"
        style={{ color: 'var(--text-primary)' }}
      >
        AI Memory
      </h1>

      {isLoading ? (
        <div className="space-y-4">
          <Skeleton height="48px" />
          <Skeleton height="200px" />
          <Skeleton height="120px" />
          <Skeleton height="120px" />
        </div>
      ) : (
        <Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab}>
          {activeTab === 'rules' && (
            <RulesTab
              rules={rules}
              onAdd={addRule}
              onToggle={toggleRule}
              onDelete={deleteRule}
              planLimit={planLimit}
            />
          )}
          {activeTab === 'briefs' && (
            <BriefsTab
              briefs={briefs}
              onAdd={addBrief}
              onDelete={deleteBrief}
              briefsUsed={planLimit.briefsUsed}
              briefsMax={planLimit.briefsMax}
            />
          )}
          {activeTab === 'patterns' && (
            <LearnedTab patterns={patterns} onRefresh={refreshPatterns} />
          )}
        </Tabs>
      )}
    </div>
  )
}
