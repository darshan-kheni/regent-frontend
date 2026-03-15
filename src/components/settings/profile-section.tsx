'use client'

import { useState, useRef } from 'react'
import { Card, Input, Button } from '@/components/ui'
import { api } from '@/lib/api'
import { useToast } from '@/providers/toast-provider'

interface ProfileSectionProps {
  initialName: string
  initialAvatarUrl: string | null
}

export function ProfileSection({ initialName, initialAvatarUrl }: ProfileSectionProps) {
  const [name, setName] = useState(initialName)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(initialAvatarUrl)
  const [saving, setSaving] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { addToast } = useToast()

  function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      setAvatarPreview(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  async function handleSave() {
    setSaving(true)
    try {
      await api.put('/settings/profile', { name })
      addToast('success', 'Profile updated successfully')
    } catch (err) {
      addToast('error', err instanceof Error ? err.message : 'Failed to update profile')
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
        Profile
      </h2>
      <div className="flex flex-col sm:flex-row gap-6">
        <div className="flex flex-col items-center gap-3">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="relative overflow-hidden focus:outline-none"
            style={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              backgroundColor: 'var(--bg-secondary)',
              border: '2px solid var(--border-default)',
            }}
          >
            {avatarPreview ? (
              <img
                src={avatarPreview}
                alt="Avatar"
                className="w-full h-full object-cover"
                style={{ borderRadius: '50%' }}
              />
            ) : (
              <span
                className="flex items-center justify-center w-full h-full text-2xl font-medium"
                style={{ color: 'var(--text-muted)' }}
              >
                {name ? name.charAt(0).toUpperCase() : '?'}
              </span>
            )}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleAvatarChange}
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="text-xs font-medium"
            style={{ color: 'var(--accent)' }}
          >
            Change avatar
          </button>
        </div>
        <div className="flex-1 space-y-4">
          <Input
            label="Display Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Button onClick={handleSave} loading={saving}>
            Save Profile
          </Button>
        </div>
      </div>
    </Card>
  )
}
