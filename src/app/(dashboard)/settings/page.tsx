'use client'

import { useState, useEffect } from 'react'
import { api } from '@/lib/api'
import { ProfileSection } from '@/components/settings/profile-section'
import { ConnectedAccounts } from '@/components/settings/connected-accounts'
import { NotificationPrefs } from '@/components/settings/notification-prefs'
import { AiPrefs } from '@/components/settings/ai-prefs'
import { AiMemory } from '@/components/settings/ai-memory'
import { TimezoneSelector } from '@/components/settings/timezone-selector'
import { LanguageSelector } from '@/components/settings/language-selector'
import type { UserProfile } from '@/types/settings'

export default function SettingsPage() {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const data = await api.get<UserProfile>('/settings/profile')
        setProfile(data)
      } catch {
        // Profile will load with defaults
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (loading) {
    return (
      <div className="p-6 lg:p-8 space-y-6">
        <h1
          className="font-display text-3xl"
          style={{ color: 'var(--text-primary)' }}
        >
          Settings
        </h1>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-48 animate-pulse"
              style={{ backgroundColor: 'var(--bg-secondary)', borderRadius: 0 }}
            />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <h1
        className="font-display text-3xl"
        style={{ color: 'var(--text-primary)' }}
      >
        Settings
      </h1>

      {/* Connected Accounts - full width, most important */}
      <ConnectedAccounts />

      {/* AI Memory - full width, second most important */}
      <AiMemory />

      {/* Profile, Notifications, AI Prefs, Timezone, Language in grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="space-y-6">
          <ProfileSection
            initialName={profile?.name || ''}
            initialAvatarUrl={profile?.avatar_url || null}
          />
          <NotificationPrefs />
        </div>
        <div className="space-y-6">
          <AiPrefs />
          <TimezoneSelector />
          <LanguageSelector />
        </div>
      </div>
    </div>
  )
}
