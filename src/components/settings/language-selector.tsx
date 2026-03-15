'use client'

import { useState, useEffect } from 'react'
import { Card, Select, Button } from '@/components/ui'
import { api } from '@/lib/api'
import { useToast } from '@/providers/toast-provider'

const languageOptions = [
  { value: 'en', label: 'English' },
  { value: 'es', label: 'Spanish' },
  { value: 'fr', label: 'French' },
  { value: 'de', label: 'German' },
  { value: 'pt', label: 'Portuguese' },
  { value: 'ja', label: 'Japanese' },
  { value: 'zh', label: 'Chinese' },
  { value: 'ko', label: 'Korean' },
]

export function LanguageSelector() {
  const [language, setLanguage] = useState('en')
  const [saving, setSaving] = useState(false)
  const { addToast } = useToast()

  useEffect(() => {
    async function load() {
      try {
        const data = await api.get<{ language: string }>('/settings/profile')
        if (data.language) setLanguage(data.language)
      } catch {
        // Use default
      }
    }
    load()
  }, [])

  async function handleSave() {
    setSaving(true)
    try {
      await api.put('/settings/profile', { language })
      addToast('success', 'Language updated')
    } catch (err) {
      addToast('error', err instanceof Error ? err.message : 'Failed to update language')
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
        Language
      </h2>
      <div className="space-y-3">
        <Select
          label="Display Language"
          options={languageOptions}
          value={language}
          onChange={setLanguage}
        />
        <Button onClick={handleSave} loading={saving}>
          Save Language
        </Button>
      </div>
    </Card>
  )
}
