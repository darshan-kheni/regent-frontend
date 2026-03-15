'use client'

import { useState } from 'react'
import { Brain, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui'
import { PatternGroup } from '@/components/behavior/pattern-group'
import { api } from '@/lib/api'
import { useToast } from '@/providers/toast-provider'
import type { LearnedPattern } from '@/types/ai-memory'

interface LearnedTabProps {
  patterns: LearnedPattern[]
  onRefresh?: () => void
}

function LearnedTab({ patterns, onRefresh }: LearnedTabProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const { addToast } = useToast()

  async function handleGenerate() {
    setIsGenerating(true)
    try {
      await api.post('/learned-patterns/generate')
      addToast('success', 'Patterns generated from your email data')
      onRefresh?.()
    } catch {
      addToast('error', 'Failed to generate patterns')
    } finally {
      setIsGenerating(false)
    }
  }

  if (patterns.length === 0) {
    return (
      <div
        className="flex flex-col items-center justify-center py-16 space-y-4"
        style={{ color: 'var(--text-muted)' }}
      >
        <Brain className="h-12 w-12" style={{ color: 'var(--accent)' }} />
        <div className="text-center space-y-2">
          <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
            No patterns detected yet
          </p>
          <p className="text-sm max-w-md">
            Regent learns your communication preferences over time by analyzing
            your email patterns, categories, and response behavior.
          </p>
          <div className="pt-2">
            <Button onClick={handleGenerate} loading={isGenerating}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Analyze Now
            </Button>
          </div>
        </div>
      </div>
    )
  }

  const grouped = patterns.reduce<Record<string, LearnedPattern[]>>(
    (acc, pattern) => {
      const key = pattern.category
      if (!acc[key]) acc[key] = []
      acc[key].push(pattern)
      return acc
    },
    {}
  )

  const categoryOrder = ['communication', 'priority', 'schedule', 'reply']
  const sortedCategories = Object.keys(grouped).sort(
    (a, b) => categoryOrder.indexOf(a) - categoryOrder.indexOf(b)
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
          {patterns.length} patterns learned (unlimited)
        </p>
        <Button variant="secondary" onClick={handleGenerate} loading={isGenerating}>
          <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
          Re-analyze
        </Button>
      </div>
      {sortedCategories.map((category) => (
        <PatternGroup
          key={category}
          category={category}
          patterns={grouped[category]}
        />
      ))}
    </div>
  )
}

export { LearnedTab }
