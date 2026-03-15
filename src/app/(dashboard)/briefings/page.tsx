'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  MessageSquare,
  Phone,
  Shield,
  Bell,
  Mail,
  Clock,
  FileText,
  AlertTriangle,
  BarChart3,
  Reply,
  Users,
  HelpCircle,
} from 'lucide-react'
import { Card, Badge, Toggle, Skeleton } from '@/components/ui'
import { useRealtimeSubscription } from '@/hooks/use-realtime'
import { useToast } from '@/providers/toast-provider'
import { api } from '@/lib/api'
import type { NotificationPrefs } from '@/types/settings'

interface ChannelConfig {
  label: string
  description: string
  icon: React.ReactNode
  prefKey: keyof NotificationPrefs
}

const CHANNELS: ChannelConfig[] = [
  {
    label: 'SMS',
    description: 'Text messages for urgent alerts',
    icon: <Phone className="h-6 w-6" />,
    prefKey: 'sms_enabled',
  },
  {
    label: 'WhatsApp',
    description: 'Rich messages with quick reply buttons',
    icon: <MessageSquare className="h-6 w-6" />,
    prefKey: 'whatsapp_enabled',
  },
  {
    label: 'Signal',
    description: 'End-to-end encrypted notifications',
    icon: <Shield className="h-6 w-6" />,
    prefKey: 'signal_enabled',
  },
  {
    label: 'Regent Push',
    description: 'Native push via mobile and desktop',
    icon: <Bell className="h-6 w-6" />,
    prefKey: 'push_enabled',
  },
  {
    label: 'Email Digest',
    description: 'Consolidated summary delivered to inbox',
    icon: <Mail className="h-6 w-6" />,
    prefKey: 'digest_enabled',
  },
]

interface QuickCommand {
  command: string
  description: string
  icon: React.ReactNode
}

const QUICK_COMMANDS: QuickCommand[] = [
  {
    command: '/digest',
    description: 'Request an immediate digest of unread items',
    icon: <FileText className="h-5 w-5" />,
  },
  {
    command: '/urgent',
    description: 'Show only critical and high-priority items',
    icon: <AlertTriangle className="h-5 w-5" />,
  },
  {
    command: '/stats',
    description: 'View email volume and AI processing stats',
    icon: <BarChart3 className="h-5 w-5" />,
  },
  {
    command: '/reply',
    description: 'List pending draft replies awaiting approval',
    icon: <Reply className="h-5 w-5" />,
  },
  {
    command: '/accounts',
    description: 'Check status of connected email accounts',
    icon: <Users className="h-5 w-5" />,
  },
  {
    command: '/help',
    description: 'Show all available commands and options',
    icon: <HelpCircle className="h-5 w-5" />,
  },
]

function getDigestDate(): string {
  const now = new Date()
  return now.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).toUpperCase()
}

const STUB_DIGEST = `REGENT DIGEST — ${getDigestDate()}
────────────────────────────────
Urgent (2)
  • Board meeting moved to Thursday 3 PM
  • Client contract expires in 48 hours

Work (5)
  • Q4 report draft ready for review
  • New candidate shortlist from recruiter
  • IT requesting security audit sign-off
  • Marketing deck v3 attached
  • Vendor proposal needs approval by EOD

Personal (1)
  • Flight confirmation: JFK → LHR, Mar 14

Drafts Ready: 4 awaiting your approval
────────────────────────────────
Reply /urgent for critical items only`

export default function BriefingsPage() {
  const { addToast } = useToast()

  const [prefs, setPrefs] = useState<NotificationPrefs | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [digest, setDigest] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      try {
        const fetchedPrefs = await api.get<NotificationPrefs>('/settings/notification-prefs')
        setPrefs(fetchedPrefs)
      } catch (err) {
        addToast('error', err instanceof Error ? err.message : 'Failed to load briefings data')
      }

      try {
        const digestData = await api.get<{ content: string }>('/briefings/latest-digest')
        if (digestData?.content) setDigest(digestData.content)
      } catch {
        // No digest available yet - that's fine
      } finally {
        setIsLoading(false)
      }
    }
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useRealtimeSubscription<NotificationPrefs>({
    table: 'notification_channels',
    event: 'UPDATE',
    onUpdate: useCallback((updated: NotificationPrefs) => {
      setPrefs(updated)
    }, []),
  })

  const handleChannelToggle = useCallback(
    async (prefKey: keyof NotificationPrefs, newValue: boolean) => {
      if (!prefs) return
      const previous = { ...prefs }
      const updated = { ...prefs, [prefKey]: newValue }
      setPrefs(updated)
      try {
        await api.put('/settings/notification-prefs', { [prefKey]: newValue })
        addToast('success', `Channel ${newValue ? 'enabled' : 'disabled'}`)
      } catch {
        setPrefs(previous)
        addToast('error', 'Failed to update channel')
      }
    },
    [prefs, addToast]
  )

  const scheduleText = prefs?.digest_time
    ? `Digests at ${prefs.digest_time}`
    : 'Digests at 8:00 AM, 1:00 PM, 6:00 PM'

  return (
    <div className="p-6 lg:p-8 space-y-8">
      {/* Header */}
      <div>
        <h1
          className="font-display text-3xl"
          style={{ color: 'var(--text-primary)' }}
        >
          Private Briefings
        </h1>
        <p
          className="mt-1 text-sm"
          style={{ color: 'var(--text-muted)' }}
        >
          Choose how Regent reaches you with intelligence updates and alerts.
        </p>
      </div>

      {/* Notification Channels Grid */}
      <section className="space-y-3">
        <h2
          className="font-display text-lg"
          style={{ color: 'var(--text-primary)' }}
        >
          Notification Channels
        </h2>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Card key={i} padding="md">
                <div className="space-y-3">
                  <Skeleton height="24px" width="24px" />
                  <Skeleton height="16px" width="100px" />
                  <Skeleton height="12px" width="160px" />
                  <Skeleton height="24px" width="60px" />
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {CHANNELS.map((channel) => {
              const enabled = prefs ? Boolean(prefs[channel.prefKey]) : false
              return (
                <Card key={channel.label} padding="md">
                  <div className="flex flex-col gap-3">
                    <div
                      className="flex items-center justify-between"
                    >
                      <div
                        style={{ color: enabled ? 'var(--accent)' : 'var(--text-muted)' }}
                        className="transition-colors"
                      >
                        {channel.icon}
                      </div>
                      <Badge variant={enabled ? 'success' : 'muted'}>
                        {enabled ? 'Active' : 'Off'}
                      </Badge>
                    </div>
                    <div>
                      <p
                        className="text-sm font-medium"
                        style={{ color: 'var(--text-primary)' }}
                      >
                        {channel.label}
                      </p>
                      <p
                        className="text-xs mt-0.5"
                        style={{ color: 'var(--text-muted)' }}
                      >
                        {channel.description}
                      </p>
                    </div>
                    <div className="mt-auto pt-1">
                      <Toggle
                        checked={enabled}
                        onChange={(val) => handleChannelToggle(channel.prefKey, val)}
                      />
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>
        )}
      </section>

      {/* Briefing Schedule + Digest Preview — side by side on desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Briefing Schedule */}
        <section>
          <Card padding="lg">
            {isLoading ? (
              <div className="space-y-3">
                <Skeleton height="24px" width="180px" />
                <Skeleton height="14px" width="260px" />
              </div>
            ) : (
              <div className="flex items-start gap-4">
                <div
                  className="flex-shrink-0 mt-0.5"
                  style={{ color: 'var(--accent)' }}
                >
                  <Clock className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3
                      className="font-display text-base"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      Briefing Schedule
                    </h3>
                    <Badge variant="gold">Configured</Badge>
                  </div>
                  <p
                    className="text-sm mt-2"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    {scheduleText}
                  </p>
                  <p
                    className="text-xs mt-1"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    Urgent items (priority &gt; 80) are delivered immediately to all active channels.
                    High-priority items (60-80) go to your primary channel. Normal items are batched
                    into scheduled digests.
                  </p>
                </div>
              </div>
            )}
          </Card>
        </section>

        {/* Digest Preview */}
        <section>
          <Card padding="lg">
            <div className="flex items-center justify-between mb-3">
              <h3
                className="font-display text-base"
                style={{ color: 'var(--text-primary)' }}
              >
                Digest Preview
              </h3>
              {!digest && (
                <span
                  className="text-[10px] font-semibold tracking-[0.08em] uppercase px-2 py-0.5"
                  style={{
                    color: 'var(--text-muted)',
                    backgroundColor: 'var(--bg-secondary)',
                    border: '1px solid var(--border-subtle)',
                  }}
                >
                  Example format
                </span>
              )}
            </div>
            <pre
              className="text-xs leading-relaxed whitespace-pre-wrap overflow-x-auto p-4"
              style={{
                fontFamily: 'var(--font-mono)',
                color: 'var(--text-secondary)',
                backgroundColor: 'var(--bg-secondary)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 0,
              }}
            >
              {digest || STUB_DIGEST}
            </pre>
          </Card>
        </section>
      </div>

      {/* Quick Commands */}
      <section className="space-y-3">
        <h2
          className="font-display text-lg"
          style={{ color: 'var(--text-primary)' }}
        >
          Quick Commands
        </h2>
        <p
          className="text-sm"
          style={{ color: 'var(--text-muted)' }}
        >
          Send these commands via any active channel to interact with Regent.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {QUICK_COMMANDS.map((cmd) => (
            <Card key={cmd.command} padding="md" hover>
              <div className="flex items-start gap-3">
                <div
                  className="flex-shrink-0 mt-0.5"
                  style={{ color: 'var(--accent)' }}
                >
                  {cmd.icon}
                </div>
                <div>
                  <p
                    className="text-sm font-semibold"
                    style={{
                      fontFamily: 'var(--font-mono)',
                      color: 'var(--text-primary)',
                    }}
                  >
                    {cmd.command}
                  </p>
                  <p
                    className="text-xs mt-0.5"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    {cmd.description}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>
    </div>
  )
}
