'use client'

import { useState, useEffect } from 'react'
import { Card, Select, Button, Toggle } from '@/components/ui'
import { api } from '@/lib/api'
import { useToast } from '@/providers/toast-provider'
import type { NotificationPrefs as NotificationPrefsType } from '@/types/settings'

const channelOptions = [
  { value: 'sms', label: 'SMS' },
  { value: 'whatsapp', label: 'WhatsApp' },
  { value: 'signal', label: 'Signal' },
  { value: 'push', label: 'Push' },
  { value: 'email', label: 'Email' },
]

const frequencyOptions = [
  { value: 'daily', label: 'Daily' },
  { value: 'twice_daily', label: 'Twice Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'off', label: 'Off' },
]

export function NotificationPrefs() {
  const [prefs, setPrefs] = useState<NotificationPrefsType>({
    sms_enabled: false,
    whatsapp_enabled: false,
    signal_enabled: false,
    push_enabled: false,
    digest_enabled: true,
    primary_channel: 'email',
    digest_frequency: 'daily',
    digest_time: '08:00',
    quiet_start: '22:00',
    quiet_end: '07:00',
    vip_breaks_quiet: true,
  })
  const [saving, setSaving] = useState(false)
  const { addToast } = useToast()

  useEffect(() => {
    async function load() {
      try {
        const data = await api.get<NotificationPrefsType>('/settings/notification-prefs')
        setPrefs(data)
      } catch {
        // Use defaults
      }
    }
    load()
  }, [])

  async function handleSave() {
    setSaving(true)
    try {
      await api.put('/settings/notification-prefs', prefs)
      addToast('success', 'Notification preferences saved')
    } catch (err) {
      addToast('error', err instanceof Error ? err.message : 'Failed to save preferences')
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
        Notification Preferences
      </h2>
      <div className="space-y-4">
        <Select
          label="Primary Channel"
          options={channelOptions}
          value={prefs.primary_channel}
          onChange={(val) => setPrefs((p) => ({ ...p, primary_channel: val }))}
        />

        <Select
          label="Digest Frequency"
          options={frequencyOptions}
          value={prefs.digest_frequency}
          onChange={(val) =>
            setPrefs((p) => ({
              ...p,
              digest_frequency: val as NotificationPrefsType['digest_frequency'],
            }))
          }
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label
              className="text-sm font-medium"
              style={{ color: 'var(--text-secondary)' }}
            >
              Quiet Hours Start
            </label>
            <input
              type="time"
              value={prefs.quiet_start || ''}
              onChange={(e) => setPrefs((p) => ({ ...p, quiet_start: e.target.value }))}
              className="h-10 w-full px-3 text-sm focus:outline-none"
              style={{
                borderRadius: 0,
                backgroundColor: 'var(--bg-elevated)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border-default)',
              }}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label
              className="text-sm font-medium"
              style={{ color: 'var(--text-secondary)' }}
            >
              Quiet Hours End
            </label>
            <input
              type="time"
              value={prefs.quiet_end || ''}
              onChange={(e) => setPrefs((p) => ({ ...p, quiet_end: e.target.value }))}
              className="h-10 w-full px-3 text-sm focus:outline-none"
              style={{
                borderRadius: 0,
                backgroundColor: 'var(--bg-elevated)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border-default)',
              }}
            />
          </div>
        </div>

        <div
          className="flex items-center justify-between py-3 px-1"
          style={{ borderTop: '1px solid var(--border-default)' }}
        >
          <div>
            <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
              VIP Override
            </p>
            <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
              Allow VIP contacts to break through quiet hours
            </p>
          </div>
          <Toggle
            checked={prefs.vip_breaks_quiet}
            onChange={(val) => setPrefs((p) => ({ ...p, vip_breaks_quiet: val }))}
          />
        </div>

        <div className="pt-2">
          <Button onClick={handleSave} loading={saving}>
            Save Preferences
          </Button>
        </div>
      </div>
    </Card>
  )
}
