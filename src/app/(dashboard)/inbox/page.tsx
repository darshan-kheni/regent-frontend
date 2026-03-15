'use client'

import { useState, useEffect } from 'react'
import { api } from '@/lib/api'
import { useEmails } from '@/hooks/use-emails'
import { useEmailStore } from '@/stores/email-store'
import { useRealtimeSubscription } from '@/hooks/use-realtime'
import { AccountSidebar, type UserAccountWithCount } from '@/components/inbox/account-sidebar'
import { CategoryTabs } from '@/components/inbox/category-tabs'
import { EmailList } from '@/components/inbox/email-list'
import { SearchInput } from '@/components/ui/search-input'
import type { UserAccount } from '@/types/email'

export default function InboxPage() {
  const [accounts, setAccounts] = useState<UserAccountWithCount[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const {
    activeCategory,
    activeAccountId,
    setCategory,
    setAccountFilter,
  } = useEmailStore()

  const { emails, isLoading, isPageLoading, page, totalPages, total, categoryCounts, goToPage } = useEmails({
    accountId: activeAccountId,
    category: activeCategory,
  })

  // Fetch accounts on mount
  useEffect(() => {
    async function fetchAccounts() {
      try {
        const data = await api.get<UserAccount[]>('/accounts')
        const withCounts: UserAccountWithCount[] = data.map((a) => ({
          ...a,
          unread_count: 0,
        }))
        setAccounts(withCounts)
      } catch {
        // Accounts fetch failed, leave empty
      }
    }
    fetchAccounts()
  }, [])

  // Realtime: update account sync status live
  useRealtimeSubscription<UserAccount>({
    table: 'user_accounts',
    event: 'UPDATE',
    onUpdate: (updated) => {
      setAccounts((prev) =>
        prev.map((a) =>
          a.id === updated.id
            ? { ...a, sync_status: updated.sync_status, last_sync_at: updated.last_sync_at, unread_count: a.unread_count }
            : a
        )
      )
    },
  })

  // Filter by search query (client-side, on top of server-side filters)
  const filteredEmails = searchQuery
    ? emails.filter(
        (e) =>
          e.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
          e.from_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          e.from_address.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : emails

  return (
    <div className="flex h-full -m-6" style={{ height: 'calc(100vh - 64px)' }}>
      {/* Account Sidebar */}
      <AccountSidebar
        accounts={accounts}
        activeAccountId={activeAccountId}
        onAccountSelect={setAccountFilter}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Search Bar */}
        <div className="flex-shrink-0 p-4" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
          <SearchInput
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search emails by subject, sender..."
          />
        </div>

        {/* Category Tabs (fixed) */}
        <div className="flex-shrink-0 px-4 pt-3">
          <CategoryTabs
            activeCategory={activeCategory}
            onCategoryChange={setCategory}
            counts={categoryCounts}
          />
        </div>

        {/* Email List with pagination */}
        <div className="flex-1 min-h-0 flex flex-col">
          <EmailList
            emails={filteredEmails}
            isLoading={isLoading}
            isPageLoading={isPageLoading}
            page={page}
            totalPages={totalPages}
            total={total}
            onPageChange={goToPage}
          />
        </div>
      </div>
    </div>
  )
}
