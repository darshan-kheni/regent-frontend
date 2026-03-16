'use client'

import { useState, useEffect, useCallback } from 'react'
import { Card, Button, Badge } from '@/components/ui'
import { api } from '@/lib/api'
import { useToast } from '@/providers/toast-provider'
import { useRealtimeSubscription } from '@/hooks/use-realtime'
import type { UserAccount } from '@/types/email'

const providerLabels: Record<string, string> = {
  gmail: 'Gmail',
  outlook: 'Outlook',
  imap: 'IMAP',
}

const syncStatusVariant: Record<string, 'success' | 'gold' | 'urgent' | 'muted'> = {
  active: 'success',
  syncing: 'gold',
  error: 'urgent',
  pending: 'gold',
  disconnected: 'muted',
}

const PROVIDER_PRESETS: Record<string, { imapHost: string; imapPort: number; smtpHost: string; smtpPort: number; provider: string }> = {
  'gmail.com': { imapHost: 'imap.gmail.com', imapPort: 993, smtpHost: 'smtp.gmail.com', smtpPort: 587, provider: 'gmail' },
  'googlemail.com': { imapHost: 'imap.gmail.com', imapPort: 993, smtpHost: 'smtp.gmail.com', smtpPort: 587, provider: 'gmail' },
  'outlook.com': { imapHost: 'outlook.office365.com', imapPort: 993, smtpHost: 'smtp.office365.com', smtpPort: 587, provider: 'outlook' },
  'hotmail.com': { imapHost: 'outlook.office365.com', imapPort: 993, smtpHost: 'smtp.office365.com', smtpPort: 587, provider: 'outlook' },
  'live.com': { imapHost: 'outlook.office365.com', imapPort: 993, smtpHost: 'smtp.office365.com', smtpPort: 587, provider: 'outlook' },
  'yahoo.com': { imapHost: 'imap.mail.yahoo.com', imapPort: 993, smtpHost: 'smtp.mail.yahoo.com', smtpPort: 587, provider: 'imap' },
  'icloud.com': { imapHost: 'imap.mail.me.com', imapPort: 993, smtpHost: 'smtp.mail.me.com', smtpPort: 587, provider: 'imap' },
}

function formatRelativeTime(dateStr: string): string {
  const date = new Date(dateStr)
  if (isNaN(date.getTime())) return 'Unknown'
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)

  let relative: string
  if (diffMins < 1) relative = 'Just now'
  else if (diffMins < 60) relative = `${diffMins}m ago`
  else {
    const diffHours = Math.floor(diffMins / 60)
    if (diffHours < 24) relative = `${diffHours}h ago`
    else {
      const diffDays = Math.floor(diffHours / 24)
      if (diffDays < 7) relative = `${diffDays}d ago`
      else relative = date.toLocaleDateString()
    }
  }

  // Also show the actual local time
  const timeStr = date.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit', hour12: true })
  return `${relative} (${timeStr})`
}

function getDomainFromEmail(email: string): string {
  const parts = email.split('@')
  return parts.length === 2 ? parts[1].toLowerCase() : ''
}

export function ConnectedAccounts() {
  const [accounts, setAccounts] = useState<UserAccount[]>([])
  const [loading, setLoading] = useState(true)
  const [removingId, setRemovingId] = useState<string | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [showAdvanced, setShowAdvanced] = useState(false)
  const { addToast } = useToast()

  // Form state
  const [formEmail, setFormEmail] = useState('')
  const [formPassword, setFormPassword] = useState('')
  const [formDisplayName, setFormDisplayName] = useState('')
  const [formImapHost, setFormImapHost] = useState('')
  const [formImapPort, setFormImapPort] = useState(993)
  const [formSmtpHost, setFormSmtpHost] = useState('')
  const [formSmtpPort, setFormSmtpPort] = useState(587)

  const fetchAccounts = useCallback(async () => {
    try {
      const data = await api.get<UserAccount[]>('/accounts')
      setAccounts(data)
    } catch (err) {
      addToast('error', err instanceof Error ? err.message : 'Failed to load accounts')
    } finally {
      setLoading(false)
    }
  }, [addToast])

  useEffect(() => {
    fetchAccounts()
  }, [fetchAccounts])

  // Realtime subscription for live account status updates
  useRealtimeSubscription<UserAccount>({
    table: 'user_accounts',
    event: 'UPDATE',
    onUpdate: (updated) => {
      setAccounts((prev) =>
        prev.map((a) =>
          a.id === updated.id
            ? { ...a, sync_status: updated.sync_status, last_sync_at: updated.last_sync_at }
            : a
        )
      )
    },
  })

  // Auto-detect mail settings when email changes
  useEffect(() => {
    const domain = getDomainFromEmail(formEmail)
    if (domain) {
      const preset = PROVIDER_PRESETS[domain]
      if (preset) {
        setFormImapHost(preset.imapHost)
        setFormImapPort(preset.imapPort)
        setFormSmtpHost(preset.smtpHost)
        setFormSmtpPort(preset.smtpPort)
      }
    }
  }, [formEmail])

  function resetForm() {
    setFormEmail('')
    setFormPassword('')
    setFormDisplayName('')
    setFormImapHost('')
    setFormImapPort(993)
    setFormSmtpHost('')
    setFormSmtpPort(587)
    setShowAdvanced(false)
  }

  async function handleAddAccount(e: React.FormEvent) {
    e.preventDefault()
    if (!formEmail || !formPassword) return

    setSubmitting(true)
    try {
      const domain = getDomainFromEmail(formEmail)
      const preset = PROVIDER_PRESETS[domain]
      const provider = preset?.provider || 'imap'

      const result = await api.post<UserAccount>('/accounts', {
        email_address: formEmail,
        password: formPassword,
        display_name: formDisplayName || formEmail,
        provider,
        imap_host: formImapHost || undefined,
        imap_port: formImapPort || undefined,
        smtp_host: formSmtpHost || undefined,
        smtp_port: formSmtpPort || undefined,
      })

      setAccounts((prev) => [result, ...prev])
      addToast('success', `Account ${formEmail} connected`)
      resetForm()
      setShowAddForm(false)
    } catch (err) {
      addToast('error', err instanceof Error ? err.message : 'Failed to connect account')
    } finally {
      setSubmitting(false)
    }
  }

  async function handleRemove(accountId: string) {
    const confirmed = window.confirm('Are you sure you want to remove this account? All synced emails will be deleted.')
    if (!confirmed) return

    setRemovingId(accountId)
    try {
      await api.delete(`/accounts/${accountId}`)
      setAccounts((prev) => prev.filter((a) => a.id !== accountId))
      addToast('success', 'Account removed')
    } catch (err) {
      addToast('error', err instanceof Error ? err.message : 'Failed to remove account')
    } finally {
      setRemovingId(null)
    }
  }

  // Open a popup window for OAuth consent flow.
  // The popup navigates to the backend, which redirects to the provider.
  // After consent, the backend returns an HTML page that sends tokens
  // to this window via postMessage, then the popup closes itself.
  function openOAuthPopup(provider: 'google' | 'microsoft') {
    const width = 500
    const height = 700
    const left = window.screenX + (window.outerWidth - width) / 2
    const top = window.screenY + (window.outerHeight - height) / 2

    window.open(
      `/api/v1/oauth/start?provider=${provider}`,
      'oauth-popup',
      `width=${width},height=${height},left=${left},top=${top},popup=yes`
    )
  }

  // Listen for postMessage from the OAuth popup
  useEffect(() => {
    function handleMessage(event: MessageEvent) {
      if (event.origin !== window.location.origin) return
      if (event.data?.type !== 'oauth-callback') return

      const { provider, access_token, refresh_token, email, error: oauthError } = event.data
      if (oauthError) {
        addToast('error', oauthError)
        return
      }

      // Store tokens and create email account via the authenticated backend endpoint
      api.post(`/auth/connect/${provider}`, {
        provider_token: access_token,
        provider_refresh_token: refresh_token,
        scopes: provider === 'google'
          ? ['https://mail.google.com/']
          : ['Mail.Read', 'Mail.Send', 'IMAP.AccessAsUser.All'],
        provider_email: email,
      }).then(() => {
        addToast('success', `${provider === 'google' ? 'Gmail' : 'Outlook'} account connected`)
        fetchAccounts()
      }).catch((err: unknown) => {
        addToast('error', err instanceof Error ? err.message : 'Failed to connect account')
      })
    }

    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [addToast, fetchAccounts])

  const domain = getDomainFromEmail(formEmail)
  const detectedProvider = domain ? (PROVIDER_PRESETS[domain]?.provider || 'IMAP') : null

  return (
    <Card padding="lg">
      <h2
        className="font-display text-xl mb-4"
        style={{ color: 'var(--text-primary)' }}
      >
        Connected Accounts
      </h2>

      {loading ? (
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="h-14 animate-pulse"
              style={{ backgroundColor: 'var(--bg-secondary)' }}
            />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {accounts.map((account) => {
            const isConnected = account.sync_status === 'active' || account.sync_status === 'syncing'
            const isExpired = account.sync_status === 'error' || account.sync_status === 'disconnected'
            const statusLabel = isExpired ? 'Auth expired' : isConnected ? 'Connected' : account.sync_status
            const lastSync = account.last_sync_at
              ? formatRelativeTime(account.last_sync_at)
              : 'Never synced'

            return (
              <div
                key={account.id}
                className="flex items-center justify-between p-3"
                style={{
                  backgroundColor: 'var(--bg-elevated)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 0,
                }}
              >
                <div className="flex items-center gap-3 min-w-0">
                  {/* Status dot */}
                  <span
                    className="shrink-0"
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      backgroundColor: isExpired ? '#EF4444' : isConnected ? '#22C55E' : '#9CA3AF',
                      display: 'inline-block',
                    }}
                  />
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className="text-sm font-medium truncate"
                        style={{ color: 'var(--text-primary)' }}
                      >
                        {account.display_name || account.email_address}
                      </span>
                      <span
                        className="text-xs font-semibold uppercase px-2 py-0.5 shrink-0"
                        style={{
                          backgroundColor: 'var(--bg-secondary)',
                          color: 'var(--text-muted)',
                          borderRadius: 0,
                        }}
                      >
                        {providerLabels[account.provider] || account.provider}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>
                        {account.email_address}
                      </span>
                      <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                        &middot;
                      </span>
                      <Badge variant={syncStatusVariant[account.sync_status] || 'muted'}>
                        {statusLabel}
                      </Badge>
                      <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                        &middot;
                      </span>
                      <span className="text-xs shrink-0" style={{ color: 'var(--text-muted)' }}>
                        {lastSync}
                      </span>
                    </div>
                  </div>
                </div>
                <Button
                  variant="danger"
                  size="sm"
                  loading={removingId === account.id}
                  onClick={() => handleRemove(account.id)}
                >
                  Remove
                </Button>
              </div>
            )
          })}

          {accounts.length === 0 && !showAddForm && (
            <p className="text-sm py-4 text-center" style={{ color: 'var(--text-muted)' }}>
              No accounts connected yet. Add your email account below.
            </p>
          )}
        </div>
      )}

      {/* Add Email Account Form */}
      {showAddForm && (
        <form
          onSubmit={handleAddAccount}
          className="mt-4 p-4 space-y-4"
          style={{
            backgroundColor: 'var(--bg-elevated)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 0,
          }}
        >
          <h3
            className="font-display text-lg"
            style={{ color: 'var(--text-primary)' }}
          >
            Add Email Account
          </h3>

          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            Connect using your email and app password. For Gmail, generate an app password at{' '}
            <a
              href="https://myaccount.google.com/apppasswords"
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
              style={{ color: 'var(--gold)' }}
            >
              Google Account Settings
            </a>.
          </p>

          <div className="space-y-3">
            <div>
              <label className="block text-sm mb-1" style={{ color: 'var(--text-secondary)' }}>
                Email Address
              </label>
              <input
                type="email"
                value={formEmail}
                onChange={(e) => setFormEmail(e.target.value)}
                placeholder="you@gmail.com"
                required
                className="w-full px-3 py-2 text-sm"
                style={{
                  backgroundColor: 'var(--bg-primary)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 0,
                  color: 'var(--text-primary)',
                  outline: 'none',
                }}
              />
              {detectedProvider && formEmail.includes('@') && (
                <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                  Detected: {detectedProvider.toUpperCase()} — IMAP settings auto-configured
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm mb-1" style={{ color: 'var(--text-secondary)' }}>
                App Password
              </label>
              <input
                type="password"
                value={formPassword}
                onChange={(e) => setFormPassword(e.target.value)}
                placeholder="Your app password (not your regular password)"
                required
                className="w-full px-3 py-2 text-sm"
                style={{
                  backgroundColor: 'var(--bg-primary)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 0,
                  color: 'var(--text-primary)',
                  outline: 'none',
                }}
              />
            </div>

            <div>
              <label className="block text-sm mb-1" style={{ color: 'var(--text-secondary)' }}>
                Display Name (optional)
              </label>
              <input
                type="text"
                value={formDisplayName}
                onChange={(e) => setFormDisplayName(e.target.value)}
                placeholder="My Work Email"
                className="w-full px-3 py-2 text-sm"
                style={{
                  backgroundColor: 'var(--bg-primary)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 0,
                  color: 'var(--text-primary)',
                  outline: 'none',
                }}
              />
            </div>

            {/* Advanced IMAP/SMTP settings */}
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="text-xs underline"
              style={{ color: 'var(--text-muted)' }}
            >
              {showAdvanced ? 'Hide' : 'Show'} advanced settings (IMAP/SMTP)
            </button>

            {showAdvanced && (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs mb-1" style={{ color: 'var(--text-muted)' }}>
                    IMAP Host
                  </label>
                  <input
                    type="text"
                    value={formImapHost}
                    onChange={(e) => setFormImapHost(e.target.value)}
                    placeholder="imap.gmail.com"
                    className="w-full px-3 py-2 text-sm"
                    style={{
                      backgroundColor: 'var(--bg-primary)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 0,
                      color: 'var(--text-primary)',
                      outline: 'none',
                    }}
                  />
                </div>
                <div>
                  <label className="block text-xs mb-1" style={{ color: 'var(--text-muted)' }}>
                    IMAP Port
                  </label>
                  <input
                    type="number"
                    value={formImapPort}
                    onChange={(e) => setFormImapPort(parseInt(e.target.value) || 993)}
                    className="w-full px-3 py-2 text-sm"
                    style={{
                      backgroundColor: 'var(--bg-primary)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 0,
                      color: 'var(--text-primary)',
                      outline: 'none',
                    }}
                  />
                </div>
                <div>
                  <label className="block text-xs mb-1" style={{ color: 'var(--text-muted)' }}>
                    SMTP Host
                  </label>
                  <input
                    type="text"
                    value={formSmtpHost}
                    onChange={(e) => setFormSmtpHost(e.target.value)}
                    placeholder="smtp.gmail.com"
                    className="w-full px-3 py-2 text-sm"
                    style={{
                      backgroundColor: 'var(--bg-primary)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 0,
                      color: 'var(--text-primary)',
                      outline: 'none',
                    }}
                  />
                </div>
                <div>
                  <label className="block text-xs mb-1" style={{ color: 'var(--text-muted)' }}>
                    SMTP Port
                  </label>
                  <input
                    type="number"
                    value={formSmtpPort}
                    onChange={(e) => setFormSmtpPort(parseInt(e.target.value) || 587)}
                    className="w-full px-3 py-2 text-sm"
                    style={{
                      backgroundColor: 'var(--bg-primary)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 0,
                      color: 'var(--text-primary)',
                      outline: 'none',
                    }}
                  />
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-3">
            <Button type="submit" variant="primary" loading={submitting}>
              Connect Account
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setShowAddForm(false)
                resetForm()
              }}
            >
              Cancel
            </Button>
          </div>
        </form>
      )}

      <div className="flex flex-wrap gap-3 mt-4">
        <Button
          variant="primary"
          onClick={() => setShowAddForm(!showAddForm)}
        >
          {showAddForm ? 'Close Form' : 'Add Email Account'}
        </Button>
        <Button variant="secondary" onClick={() => openOAuthPopup('google')}>
          Connect Google (OAuth)
        </Button>
        <Button variant="secondary" onClick={() => openOAuthPopup('microsoft')}>
          Connect Microsoft (OAuth)
        </Button>
      </div>
    </Card>
  )
}
