'use client'

import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Inbox } from 'lucide-react'

const syncStatusColors: Record<string, string> = {
  active: '#10B981',     // green
  syncing: '#C9A96E',    // gold
  pending: '#F59E0B',    // amber
  error: '#EF4444',      // red
  disconnected: '#6B7280', // gray
}

interface AccountSidebarProps {
  accounts: UserAccountWithCount[]
  activeAccountId: string | null
  onAccountSelect: (id: string | null) => void
}

interface UserAccountWithCount {
  id: string
  provider: 'gmail' | 'outlook' | 'imap'
  email_address: string
  display_name: string
  sync_status: string
  last_sync_at: string | null
  created_at: string
  unread_count?: number
}

function AccountSidebar({ accounts, activeAccountId, onAccountSelect }: AccountSidebarProps) {
  const totalUnread = accounts.reduce((sum, a) => sum + (a.unread_count ?? 0), 0)

  return (
    <aside
      className="w-64 flex-shrink-0 hidden lg:flex flex-col"
      style={{
        borderRight: '1px solid var(--border-subtle)',
        backgroundColor: 'var(--bg-secondary)',
      }}
    >
      <div className="p-4">
        <h2
          className="text-sm font-medium mb-3"
          style={{ color: 'var(--text-muted)' }}
        >
          Accounts
        </h2>

        {/* All Accounts option */}
        <button
          type="button"
          onClick={() => onAccountSelect(null)}
          className={cn(
            'w-full flex items-center gap-3 px-3 py-2.5 text-sm transition-colors text-left',
          )}
          style={{
            backgroundColor: activeAccountId === null ? 'var(--accent-subtle)' : 'transparent',
            borderLeft: activeAccountId === null ? '3px solid var(--accent)' : '3px solid transparent',
            color: 'var(--text-primary)',
          }}
        >
          <Inbox className="h-4 w-4 flex-shrink-0" style={{ color: 'var(--text-muted)' }} />
          <span className="flex-1 truncate">All Accounts</span>
          {totalUnread > 0 && (
            <Badge variant="gold">{totalUnread}</Badge>
          )}
        </button>

        {/* Individual accounts */}
        <div className="mt-1 flex flex-col gap-0.5">
          {accounts.map((account) => {
            const isActive = account.id === activeAccountId
            const dotColor = syncStatusColors[account.sync_status] || '#6B7280'

            return (
              <button
                key={account.id}
                type="button"
                onClick={() => onAccountSelect(account.id)}
                className="w-full flex items-center gap-3 px-3 py-2.5 text-sm transition-colors text-left"
                style={{
                  backgroundColor: isActive ? 'var(--accent-subtle)' : 'transparent',
                  borderLeft: isActive ? '3px solid var(--accent)' : '3px solid transparent',
                  color: 'var(--text-primary)',
                }}
              >
                <span
                  className="h-2.5 w-2.5 flex-shrink-0"
                  style={{
                    backgroundColor: dotColor,
                    borderRadius: 9999,
                  }}
                />
                <span className="flex-1 truncate" title={account.email_address}>
                  {account.display_name || account.email_address}
                </span>
                {(account.unread_count ?? 0) > 0 && (
                  <Badge variant="muted">{account.unread_count}</Badge>
                )}
              </button>
            )
          })}
        </div>
      </div>
    </aside>
  )
}

export { AccountSidebar, type AccountSidebarProps, type UserAccountWithCount }
