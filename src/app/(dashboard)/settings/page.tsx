'use client'

import { useState, useEffect } from 'react'
import {
  User,
  Link2,
  Bell,
  Sparkles,
  Brain,
  Globe,
  Languages,
} from 'lucide-react'
import { api } from '@/lib/api'
import { ProfileSection } from '@/components/settings/profile-section'
import { ConnectedAccounts } from '@/components/settings/connected-accounts'
import { NotificationPrefs } from '@/components/settings/notification-prefs'
import { AiPrefs } from '@/components/settings/ai-prefs'
import { AiMemory } from '@/components/settings/ai-memory'
import { TimezoneSelector } from '@/components/settings/timezone-selector'
import { LanguageSelector } from '@/components/settings/language-selector'
import type { UserProfile } from '@/types/settings'

const tabs = [
  { id: 'accounts', label: 'Accounts', icon: Link2 },
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'ai', label: 'AI Preferences', icon: Sparkles },
  { id: 'memory', label: 'AI Memory', icon: Brain },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'regional', label: 'Regional', icon: Globe },
]

export default function SettingsPage() {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('accounts')

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
      <div className="p-6 lg:px-[52px] lg:py-[44px] space-y-6">
        <div>
          <h1
            className="font-display text-3xl"
            style={{ color: 'var(--text-primary)' }}
          >
            Settings
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
            Manage your account, preferences, and integrations
          </p>
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-48 animate-pulse"
              style={{ backgroundColor: 'var(--bg-secondary)' }}
            />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 lg:px-[52px] lg:py-[44px]">
      {/* Header */}
      <div className="mb-8">
        <h1
          className="font-display text-3xl"
          style={{ color: 'var(--text-primary)' }}
        >
          Settings
        </h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
          Manage your account, preferences, and integrations
        </p>
      </div>

      {/* Layout: sidebar tabs + content */}
      <div className="flex gap-8">
        {/* Tab navigation - vertical on desktop, horizontal on mobile */}
        <nav className="hidden lg:block w-52 flex-shrink-0">
          <div className="sticky top-24 space-y-1">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-colors text-left"
                  style={{
                    color: isActive ? 'var(--accent)' : 'var(--text-secondary)',
                    backgroundColor: isActive ? 'var(--accent-subtle)' : 'transparent',
                    borderLeft: isActive ? '3px solid var(--accent)' : '3px solid transparent',
                  }}
                >
                  <Icon className="h-4 w-4 flex-shrink-0" />
                  {tab.label}
                </button>
              )
            })}
          </div>
        </nav>

        {/* Mobile tab bar */}
        <div
          className="lg:hidden fixed bottom-0 left-0 right-0 z-40 flex overflow-x-auto gap-0 px-2 py-2"
          style={{
            backgroundColor: 'var(--bg-sidebar)',
            borderTop: '1px solid var(--border-default)',
          }}
        >
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className="flex flex-col items-center gap-1 px-3 py-1.5 text-[10px] font-medium min-w-0 flex-1"
                style={{
                  color: isActive ? 'var(--accent)' : 'var(--text-muted)',
                }}
              >
                <Icon className="h-4 w-4" />
                <span className="truncate">{tab.label}</span>
              </button>
            )
          })}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 max-w-3xl space-y-6 pb-20 lg:pb-0">
          {activeTab === 'accounts' && (
            <>
              <SectionHeader
                icon={Link2}
                title="Connected Accounts"
                description="Link your email accounts for AI processing. Regent syncs via IMAP or Gmail API."
              />
              <ConnectedAccounts />
            </>
          )}

          {activeTab === 'profile' && (
            <>
              <SectionHeader
                icon={User}
                title="Profile"
                description="Your display name and avatar shown across Regent."
              />
              <ProfileSection
                initialName={profile?.name || ''}
                initialAvatarUrl={profile?.avatar_url || null}
              />
            </>
          )}

          {activeTab === 'ai' && (
            <>
              <SectionHeader
                icon={Sparkles}
                title="AI Preferences"
                description="Control how Regent drafts replies and communicates on your behalf."
              />
              <AiPrefs />
            </>
          )}

          {activeTab === 'memory' && (
            <>
              <SectionHeader
                icon={Brain}
                title="AI Memory"
                description="Rules, context briefs, and learned patterns that shape how AI understands you."
              />
              <AiMemory />
            </>
          )}

          {activeTab === 'notifications' && (
            <>
              <SectionHeader
                icon={Bell}
                title="Notification Preferences"
                description="Configure how and when Regent reaches you with briefings and alerts."
              />
              <NotificationPrefs />
            </>
          )}

          {activeTab === 'regional' && (
            <>
              <SectionHeader
                icon={Globe}
                title="Regional Settings"
                description="Timezone and language affect all date calculations and AI output."
              />
              <div className="space-y-6">
                <TimezoneSelector />
                <LanguageSelector />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

function SectionHeader({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ComponentType<{ className?: string }>
  title: string
  description: string
}) {
  return (
    <div className="flex items-start gap-3 pb-4 mb-2" style={{ borderBottom: '1px solid var(--border-default)' }}>
      <div
        className="flex items-center justify-center w-10 h-10 flex-shrink-0 mt-0.5"
        style={{ backgroundColor: 'var(--accent-subtle)', color: 'var(--accent)' }}
      >
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <h2
          className="font-display text-xl font-medium"
          style={{ color: 'var(--text-primary)' }}
        >
          {title}
        </h2>
        <p className="text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>
          {description}
        </p>
      </div>
    </div>
  )
}
