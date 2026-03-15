'use client'

import { useState, useEffect } from 'react'
import { Card, Select, Button } from '@/components/ui'
import { api } from '@/lib/api'
import { useToast } from '@/providers/toast-provider'

interface AiPrefsData {
  formality: number
  reply_style: string
}

const replyStyleOptions = [
  { value: 'professional', label: 'Professional' },
  { value: 'casual', label: 'Casual' },
  { value: 'formal', label: 'Formal' },
  { value: 'friendly', label: 'Friendly' },
]

const formalityLabels = ['Very Casual', 'Casual', 'Neutral', 'Formal', 'Very Formal']

export function AiPrefs() {
  const [formality, setFormality] = useState(3)
  const [replyStyle, setReplyStyle] = useState('professional')
  const [saving, setSaving] = useState(false)
  const { addToast } = useToast()

  useEffect(() => {
    async function load() {
      try {
        const data = await api.get<AiPrefsData>('/settings/ai-prefs')
        setFormality(data.formality)
        setReplyStyle(data.reply_style)
      } catch {
        // Use defaults
      }
    }
    load()
  }, [])

  async function handleSave() {
    setSaving(true)
    try {
      await api.put('/settings/ai-prefs', { formality, reply_style: replyStyle })
      addToast('success', 'AI preferences saved')
    } catch (err) {
      addToast('error', err instanceof Error ? err.message : 'Failed to save AI preferences')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Card padding="lg">
      <h2
        className="font-display text-xl mb-4"
        style={{ color: 'var(--text-primary)' }}
      >
        AI Preferences
      </h2>
      <div className="space-y-5">
        <div className="flex flex-col gap-2">
          <label
            className="text-sm font-medium"
            style={{ color: 'var(--text-secondary)' }}
          >
            Formality Level
          </label>
          <div className="flex items-center gap-4">
            <input
              type="range"
              min={1}
              max={5}
              step={1}
              value={formality}
              onChange={(e) => setFormality(Number(e.target.value))}
              className="flex-1 h-2 appearance-none cursor-pointer"
              style={{
                borderRadius: 0,
                background: `linear-gradient(to right, var(--accent) 0%, var(--accent) ${((formality - 1) / 4) * 100}%, var(--bg-secondary) ${((formality - 1) / 4) * 100}%, var(--bg-secondary) 100%)`,
              }}
            />
            <span
              className="text-sm font-medium min-w-[90px] text-right"
              style={{ color: 'var(--accent)' }}
            >
              {formalityLabels[formality - 1]}
            </span>
          </div>
        </div>

        <Select
          label="Reply Style"
          options={replyStyleOptions}
          value={replyStyle}
          onChange={setReplyStyle}
        />

        <Button onClick={handleSave} loading={saving}>
          Save AI Preferences
        </Button>
      </div>
    </Card>
  )
}
