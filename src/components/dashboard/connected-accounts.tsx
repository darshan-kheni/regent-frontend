'use client'

import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import type { ConnectedAccount } from '@/types/analytics'

interface ConnectedAccountsProps {
  accounts: ConnectedAccount[]
  isLoading: boolean
}

const PROVIDER_COLORS: Record<string, string> = {
  gmail: '#D4645D',
  outlook: '#7EA3C2',
  imap: '#C9A96E',
}

export function ConnectedAccounts({ accounts, isLoading }: ConnectedAccountsProps) {
  if (isLoading) {
    return (
      <Card padding="lg">
        <div className="flex items-center gap-4">
          <Skeleton height="14px" width="140px" />
          <div className="flex gap-4">
            <Skeleton height="14px" width="180px" />
            <Skeleton height="14px" width="180px" />
          </div>
        </div>
      </Card>
    )
  }

  if (!accounts || accounts.length === 0) {
    return (
      <Card padding="lg">
        <div className="flex items-center justify-between">
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            No email accounts connected.
          </p>
          <Link
            href="/settings"
            className="text-sm font-medium"
            style={{ color: 'var(--accent-gold)' }}
          >
            Connect Account
          </Link>
        </div>
      </Card>
    )
  }

  return (
    <Card padding="lg">
      <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
        <span
          className="text-xs font-medium uppercase tracking-wider"
          style={{ color: 'var(--text-muted)' }}
        >
          Connected
        </span>
        {accounts.map((account) => (
          <div key={account.id} className="flex items-center gap-2">
            <span
              className="inline-block h-2 w-2 shrink-0"
              style={{
                backgroundColor: PROVIDER_COLORS[account.provider] ?? '#7EA3C2',
                borderRadius: 0,
              }}
            />
            <span
              className="text-sm"
              style={{ color: 'var(--text-secondary)' }}
              title={account.email_address}
            >
              {account.display_name || account.email_address}
            </span>
            {account.sync_status !== 'active' && (
              <span
                className="text-xs"
                style={{ color: 'var(--color-critical)' }}
              >
                ({account.sync_status})
              </span>
            )}
          </div>
        ))}
      </div>
    </Card>
  )
}
