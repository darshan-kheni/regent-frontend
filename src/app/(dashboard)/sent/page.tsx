'use client'

import { useState, useEffect, useCallback } from 'react'
import { api } from '@/lib/api'
import { useRealtimeSubscription } from '@/hooks/use-realtime'
import type { Email, UserAccount } from '@/types/email'
import { Card, Skeleton } from '@/components/ui'
import { AccountSidebar, type UserAccountWithCount } from '@/components/inbox/account-sidebar'
import { SentRow } from '@/components/sent/sent-row'
import { useToast } from '@/providers/toast-provider'

export default function SentPage() {
  const [emails, setEmails] = useState<Email[]>([])
  const [accounts, setAccounts] = useState<UserAccountWithCount[]>([])
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const { addToast } = useToast()

  const fetchSent = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({ page: String(page), limit: '50' })
      if (selectedAccount) params.set('account_id', selectedAccount)
      const data = await api.get<Email[]>(`/sent?${params.toString()}`)
      setEmails(data)
    } catch (err) {
      addToast('error', err instanceof Error ? err.message : 'Failed to load sent emails')
    } finally {
      setLoading(false)
    }
  }, [selectedAccount, page, addToast])

  useEffect(() => {
    async function loadAccounts() {
      try {
        const data = await api.get<UserAccount[]>('/accounts')
        const withCounts: UserAccountWithCount[] = data.map((a) => ({
          ...a,
          unread_count: 0,
        }))
        setAccounts(withCounts)
      } catch {
        // Accounts may not be available yet
      }
    }
    loadAccounts()
  }, [])

  useEffect(() => {
    fetchSent()
  }, [fetchSent])

  // Live update when a new outbound email is sent
  useRealtimeSubscription<Email>({
    table: 'emails',
    event: 'INSERT',
    filter: 'direction=eq.outbound',
    onInsert: useCallback((newEmail: Email) => {
      if (!selectedAccount || newEmail.account_id === selectedAccount) {
        setEmails(prev => [newEmail, ...prev])
      }
    }, [selectedAccount]),
  })

  const handleAccountSelect = useCallback((id: string | null) => {
    setSelectedAccount(id)
    setPage(1)
  }, [])

  const totalCount = emails.length
  const aiDraftedCount = emails.filter(
    (e) => (e as unknown as { ai_drafted?: boolean }).ai_drafted === true
  ).length
  const deliveredCount = emails.filter((e) => e.is_read).length

  const ACCOUNT_COLORS = ['#4A90D9', '#D94A6B', '#4AD97A', '#D9A84A', '#9B59B6', '#1ABC9C']

  function getAccountColorById(accountId: string): string {
    const idx = accounts.findIndex((a) => a.id === accountId)
    return idx >= 0 ? ACCOUNT_COLORS[idx % ACCOUNT_COLORS.length] : ACCOUNT_COLORS[0]
  }

  return (
    <div className="flex h-full -m-6" style={{ height: 'calc(100vh - 64px)' }}>
      {/* Account Sidebar */}
      <AccountSidebar
        accounts={accounts}
        activeAccountId={selectedAccount}
        onAccountSelect={handleAccountSelect}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <div className="p-6 lg:px-[52px] lg:py-[44px]">
          {/* Header */}
          <div className="mb-6">
            <h1
              className="font-display"
              style={{ color: 'var(--text-primary)', fontSize: '30px' }}
            >
              Sent
            </h1>
            <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
              {loading ? '...' : `${totalCount} emails sent from Regent`}
            </p>
          </div>

          {/* Summary stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <Card padding="md">
              <p
                className="text-[10px] font-medium uppercase tracking-wider"
                style={{ color: 'var(--text-muted)' }}
              >
                Total Sent
              </p>
              <p
                className="font-display mt-1"
                style={{ color: 'var(--text-primary)', fontSize: '28px' }}
              >
                {loading ? '--' : totalCount}
              </p>
            </Card>
            <Card padding="md">
              <p
                className="text-[10px] font-medium uppercase tracking-wider"
                style={{ color: 'var(--text-muted)' }}
              >
                AI-Drafted
              </p>
              <p
                className="font-display mt-1"
                style={{ color: 'var(--accent)', fontSize: '28px' }}
              >
                {loading ? '--' : aiDraftedCount}
              </p>
            </Card>
            <Card padding="md">
              <p
                className="text-[10px] font-medium uppercase tracking-wider"
                style={{ color: 'var(--text-muted)' }}
              >
                Delivered
              </p>
              <p
                className="font-display mt-1"
                style={{ color: 'var(--color-positive)', fontSize: '28px' }}
              >
                {loading ? '--' : deliveredCount}
              </p>
            </Card>
          </div>

          {/* Email list */}
          <Card padding="sm">
            {loading ? (
              <div className="space-y-1">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="px-4 py-3">
                    <Skeleton className="h-4 w-3/4 mb-2" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                ))}
              </div>
            ) : emails.length === 0 ? (
              <div className="py-16 text-center">
                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                  No sent emails found.
                </p>
              </div>
            ) : (
              <div>
                {emails.map((email) => (
                  <SentRow
                    key={email.id}
                    email={email}
                    accountColor={email.account_id ? getAccountColorById(email.account_id) : ACCOUNT_COLORS[0]}
                  />
                ))}
              </div>
            )}
          </Card>

          {/* Pagination */}
          {!loading && emails.length > 0 && (
            <div className="flex items-center justify-center gap-4 mt-4">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
                className="text-sm disabled:opacity-50"
                style={{ color: 'var(--text-secondary)' }}
              >
                Previous
              </button>
              <span className="text-sm" style={{ color: 'var(--text-muted)' }}>
                Page {page}
              </span>
              <button
                disabled={emails.length < 50}
                onClick={() => setPage((p) => p + 1)}
                className="text-sm disabled:opacity-50"
                style={{ color: 'var(--text-secondary)' }}
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
