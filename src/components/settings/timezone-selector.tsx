'use client'

import { useState, useEffect } from 'react'
import { Card, Select, Button } from '@/components/ui'
import { api } from '@/lib/api'
import { useToast } from '@/providers/toast-provider'

const commonTimezones = [
  { value: 'America/New_York', label: 'Eastern Time (US & Canada)' },
  { value: 'America/Chicago', label: 'Central Time (US & Canada)' },
  { value: 'America/Denver', label: 'Mountain Time (US & Canada)' },
  { value: 'America/Los_Angeles', label: 'Pacific Time (US & Canada)' },
  { value: 'America/Anchorage', label: 'Alaska' },
  { value: 'Pacific/Honolulu', label: 'Hawaii' },
  { value: 'America/Sao_Paulo', label: 'Brasilia' },
  { value: 'America/Argentina/Buenos_Aires', label: 'Buenos Aires' },
  { value: 'Atlantic/Reykjavik', label: 'Reykjavik (GMT)' },
  { value: 'Europe/London', label: 'London (GMT/BST)' },
  { value: 'Europe/Paris', label: 'Paris (CET)' },
  { value: 'Europe/Berlin', label: 'Berlin (CET)' },
  { value: 'Europe/Madrid', label: 'Madrid (CET)' },
  { value: 'Europe/Rome', label: 'Rome (CET)' },
  { value: 'Europe/Zurich', label: 'Zurich (CET)' },
  { value: 'Europe/Moscow', label: 'Moscow (MSK)' },
  { value: 'Europe/Istanbul', label: 'Istanbul' },
  { value: 'Asia/Dubai', label: 'Dubai (GST)' },
  { value: 'Asia/Kolkata', label: 'Mumbai (IST)' },
  { value: 'Asia/Singapore', label: 'Singapore (SGT)' },
  { value: 'Asia/Shanghai', label: 'Shanghai (CST)' },
  { value: 'Asia/Tokyo', label: 'Tokyo (JST)' },
  { value: 'Asia/Seoul', label: 'Seoul (KST)' },
  { value: 'Australia/Sydney', label: 'Sydney (AEST)' },
  { value: 'Pacific/Auckland', label: 'Auckland (NZST)' },
]

export function TimezoneSelector() {
  const detected = Intl.DateTimeFormat().resolvedOptions().timeZone
  const [timezone, setTimezone] = useState(detected)
  const [saving, setSaving] = useState(false)
  const { addToast } = useToast()

  useEffect(() => {
    async function load() {
      try {
        const data = await api.get<{ timezone: string }>('/settings/profile')
        if (data.timezone) setTimezone(data.timezone)
      } catch {
        // Use detected timezone
      }
    }
    load()
  }, [])

  async function handleSave() {
    setSaving(true)
    try {
      await api.put('/settings/profile', { timezone })
      addToast('success', 'Timezone updated')
    } catch (err) {
      addToast('error', err instanceof Error ? err.message : 'Failed to update timezone')
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
        Timezone
      </h2>
      <div className="space-y-3">
        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
          Detected: {detected}
        </p>
        <Select
          label="Timezone"
          options={commonTimezones}
          value={timezone}
          onChange={setTimezone}
        />
        <Button onClick={handleSave} loading={saving}>
          Save Timezone
        </Button>
      </div>
    </Card>
  )
}
