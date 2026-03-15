'use client'

import { useState } from 'react'
import { Sparkles, RefreshCw } from 'lucide-react'
import { Button, Select } from '@/components/ui'
import { api } from '@/lib/api'
import { useToast } from '@/providers/toast-provider'

interface AIComposeProps {
  onDraftGenerated: (body: string) => void
  context: string
}

const toneOptions = [
  { value: 'professional', label: 'Professional' },
  { value: 'casual', label: 'Casual' },
  { value: 'formal', label: 'Formal' },
  { value: 'friendly', label: 'Friendly' },
]

export function AICompose({ onDraftGenerated, context }: AIComposeProps) {
  const [tone, setTone] = useState('professional')
  const [formality, setFormality] = useState(3)
  const [loading, setLoading] = useState(false)
  const [hasGenerated, setHasGenerated] = useState(false)
  const { addToast } = useToast()

  async function handleGenerate() {
    setLoading(true)
    try {
      const result = await api.post<{ body: string }>('/compose/ai-draft', {
        context,
        tone,
        formality,
      })
      onDraftGenerated(result.body)
      setHasGenerated(true)
    } catch (err) {
      addToast('error', err instanceof Error ? err.message : 'Failed to generate AI draft')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="p-4 mt-3"
      style={{
        borderRadius: 0,
        backgroundColor: 'var(--bg-elevated)',
        border: '1px solid var(--border-subtle)',
      }}
    >
      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="h-4 w-4" style={{ color: 'var(--accent)' }} />
        <span
          className="text-sm font-medium"
          style={{ color: 'var(--text-primary)' }}
        >
          AI Draft Assistant
        </span>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-end gap-3">
        <div className="w-full sm:w-40">
          <Select
            options={toneOptions}
            value={tone}
            onChange={setTone}
            label="Tone"
          />
        </div>

        <div className="w-full sm:w-48 flex flex-col gap-1.5">
          <label
            className="text-sm font-medium"
            style={{ color: 'var(--text-secondary)' }}
          >
            Formality ({formality}/5)
          </label>
          <div className="flex items-center gap-2 h-10">
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
              1
            </span>
            <input
              type="range"
              min={1}
              max={5}
              step={1}
              value={formality}
              onChange={(e) => setFormality(Number(e.target.value))}
              className="flex-1 h-1.5 appearance-none cursor-pointer"
              style={{
                borderRadius: 0,
                accentColor: '#C9A96E',
              }}
            />
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
              5
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="md"
            onClick={handleGenerate}
            loading={loading}
          >
            <Sparkles className="h-4 w-4 mr-1.5" />
            {hasGenerated ? 'Regenerate' : 'Generate with AI'}
          </Button>

          {hasGenerated && (
            <Button
              variant="ghost"
              size="md"
              onClick={handleGenerate}
              loading={loading}
            >
              <RefreshCw className="h-4 w-4 mr-1.5" />
              Refine
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
