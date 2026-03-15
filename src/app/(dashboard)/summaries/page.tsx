'use client'

import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import {
  FileText,
  Calendar,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  Paperclip,
  Filter,
  Clock,
} from 'lucide-react'
import { useSummaries } from '@/hooks/use-summaries'
import type { SummaryItem } from '@/hooks/use-summaries'
import { api } from '@/lib/api'
import type { UserAccount } from '@/types/email'

type DatePreset = 'today' | 'yesterday' | 'week' | 'month' | 'custom'

function formatDateISO(d: Date): string {
  return d.toISOString().split('T')[0]
}

function getPresetDates(preset: DatePreset): { date?: string; from?: string; to?: string } {
  const now = new Date()
  switch (preset) {
    case 'today':
      return { date: formatDateISO(now) }
    case 'yesterday': {
      const y = new Date(now)
      y.setDate(y.getDate() - 1)
      return { date: formatDateISO(y) }
    }
    case 'week': {
      const weekAgo = new Date(now)
      weekAgo.setDate(weekAgo.getDate() - 7)
      return { from: formatDateISO(weekAgo), to: formatDateISO(now) }
    }
    case 'month': {
      const monthAgo = new Date(now)
      monthAgo.setMonth(monthAgo.getMonth() - 1)
      return { from: formatDateISO(monthAgo), to: formatDateISO(now) }
    }
    default:
      return {}
  }
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  return `${days}d ago`
}

const CATEGORY_COLORS: Record<string, string> = {
  work: '#3B82F6',
  personal: '#8B5CF6',
  finance: '#10B981',
  legal: '#EF4444',
  security: '#F59E0B',
  promotions: '#F97316',
  newsletters: '#6366F1',
  spam: '#6B7280',
  updates: '#06B6D4',
  shopping: '#EC4899',
  social: '#14B8A6',
  recruitment: '#8B5CF6',
  travel: '#0EA5E9',
  events: '#A855F7',
  support: '#64748B',
  shipping: '#84CC16',
  subscriptions: '#D946EF',
  health: '#22C55E',
  education: '#2563EB',
}

function SummaryCard({ item, onClick }: { item: SummaryItem; onClick: () => void }) {
  const catColor = CATEGORY_COLORS[item.category] || '#6B7280'

  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full text-left p-4 transition-colors"
      style={{
        backgroundColor: 'var(--bg-elevated)',
        border: '1px solid var(--border-default)',
        borderLeft: `3px solid ${catColor}`,
      }}
      onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--accent-subtle)' }}
      onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'var(--bg-elevated)' }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          {/* Sender + time */}
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-medium truncate" style={{ color: 'var(--text-primary)' }}>
              {item.from_name || item.from_address}
            </span>
            <span className="text-xs flex-shrink-0" style={{ color: 'var(--text-muted)' }}>
              {timeAgo(item.received_at)}
            </span>
          </div>

          {/* Subject */}
          <div className="text-sm truncate mb-2" style={{ color: 'var(--text-secondary)' }}>
            {item.subject}
          </div>

          {/* AI Summary headline */}
          <div className="text-sm leading-relaxed" style={{ color: 'var(--text-primary)' }}>
            {item.headline}
          </div>
        </div>

        {/* Right side badges */}
        <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
          <span
            className="text-[10px] font-medium uppercase px-1.5 py-0.5"
            style={{
              backgroundColor: catColor + '18',
              color: catColor,
              border: `1px solid ${catColor}40`,
            }}
          >
            {item.category}
          </span>
          <div className="flex items-center gap-1">
            {item.action_required && (
              <AlertCircle className="h-3.5 w-3.5" style={{ color: 'var(--color-critical, #D4645D)' }} />
            )}
            {item.has_attachments && (
              <Paperclip className="h-3.5 w-3.5" style={{ color: 'var(--text-muted)' }} />
            )}
          </div>
        </div>
      </div>
    </button>
  )
}

export default function SummariesPage() {
  const router = useRouter()
  const [accounts, setAccounts] = useState<UserAccount[]>([])
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [datePreset, setDatePreset] = useState<DatePreset>('today')
  const [customFrom, setCustomFrom] = useState('')
  const [customTo, setCustomTo] = useState('')

  // Load accounts
  useEffect(() => {
    api.get<UserAccount[]>('/accounts').then(setAccounts).catch(() => {})
  }, [])

  // Compute date filters
  const dateFilters = useMemo(() => {
    if (datePreset === 'custom') {
      return { from: customFrom || undefined, to: customTo || undefined }
    }
    return getPresetDates(datePreset)
  }, [datePreset, customFrom, customTo])

  const { summaries, total, page, totalPages, isLoading, goToPage } = useSummaries({
    accountId: selectedAccount,
    category: selectedCategory,
    date: dateFilters.date ?? null,
    from: dateFilters.from ?? null,
    to: dateFilters.to ?? null,
  })

  const presets: { key: DatePreset; label: string }[] = [
    { key: 'today', label: 'Today' },
    { key: 'yesterday', label: 'Yesterday' },
    { key: 'week', label: 'This Week' },
    { key: 'month', label: 'This Month' },
    { key: 'custom', label: 'Custom' },
  ]

  // Collect unique categories from results for filter tabs
  const categories = useMemo(() => {
    const cats = new Set(summaries.map((s) => s.category))
    return ['all', ...Array.from(cats).sort()]
  }, [summaries])

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <FileText className="h-6 w-6" style={{ color: 'var(--accent)' }} />
          <div>
            <h1 className="text-xl font-display font-semibold" style={{ color: 'var(--text-primary)' }}>
              Summaries
            </h1>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
              AI-generated briefs for all your emails
            </p>
          </div>
        </div>
        <div className="text-sm tabular-nums" style={{ color: 'var(--text-muted)' }}>
          {total} {total === 1 ? 'summary' : 'summaries'}
        </div>
      </div>

      {/* Filters bar */}
      <div className="space-y-3">
        {/* Date presets */}
        <div className="flex items-center gap-2 flex-wrap">
          <Clock className="h-4 w-4" style={{ color: 'var(--text-muted)' }} />
          {presets.map((p) => (
            <button
              key={p.key}
              type="button"
              onClick={() => setDatePreset(p.key)}
              className="px-3 py-1.5 text-sm font-medium transition-colors"
              style={{
                backgroundColor: datePreset === p.key ? 'var(--accent)' : 'transparent',
                color: datePreset === p.key ? '#fff' : 'var(--text-secondary)',
                border: `1px solid ${datePreset === p.key ? 'var(--accent)' : 'var(--border-default)'}`,
              }}
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* Custom date range */}
        {datePreset === 'custom' && (
          <div className="flex items-center gap-3">
            <Calendar className="h-4 w-4" style={{ color: 'var(--text-muted)' }} />
            <input
              type="date"
              value={customFrom}
              onChange={(e) => setCustomFrom(e.target.value)}
              className="px-3 py-1.5 text-sm"
              style={{
                backgroundColor: 'var(--bg-elevated)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border-default)',
              }}
            />
            <span className="text-sm" style={{ color: 'var(--text-muted)' }}>to</span>
            <input
              type="date"
              value={customTo}
              onChange={(e) => setCustomTo(e.target.value)}
              className="px-3 py-1.5 text-sm"
              style={{
                backgroundColor: 'var(--bg-elevated)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border-default)',
              }}
            />
          </div>
        )}

        {/* Account + Category filters */}
        <div className="flex items-center gap-3 flex-wrap">
          <Filter className="h-4 w-4" style={{ color: 'var(--text-muted)' }} />
          {accounts.length > 1 && (
            <select
              value={selectedAccount ?? ''}
              onChange={(e) => setSelectedAccount(e.target.value || null)}
              className="px-3 py-1.5 text-sm"
              style={{
                backgroundColor: 'var(--bg-elevated)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border-default)',
              }}
            >
              <option value="">All Accounts</option>
              {accounts.map((a) => (
                <option key={a.id} value={a.id}>{a.email_address}</option>
              ))}
            </select>
          )}
          <div className="flex gap-1">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className="px-2.5 py-1 text-xs font-medium transition-colors capitalize"
                style={{
                  backgroundColor: selectedCategory === cat ? 'var(--accent)' : 'transparent',
                  color: selectedCategory === cat ? '#fff' : 'var(--text-secondary)',
                  border: `1px solid ${selectedCategory === cat ? 'var(--accent)' : 'var(--border-default)'}`,
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Summary list */}
      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="h-24 animate-pulse"
              style={{ backgroundColor: 'var(--bg-elevated)', border: '1px solid var(--border-default)' }}
            />
          ))}
        </div>
      ) : summaries.length === 0 ? (
        <div className="py-16 text-center" style={{ color: 'var(--text-muted)' }}>
          <FileText className="h-12 w-12 mx-auto mb-3 opacity-30" />
          <p className="text-lg font-medium">No summaries found</p>
          <p className="text-sm mt-1">Try adjusting your date range or filters</p>
        </div>
      ) : (
        <div className="space-y-2">
          {summaries.map((item) => (
            <SummaryCard
              key={item.email_id}
              item={item}
              onClick={() => router.push(`/inbox/${item.email_id}`)}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 pt-2">
          <button
            type="button"
            onClick={() => goToPage(page - 1)}
            disabled={page <= 1}
            className="p-2 transition-colors disabled:opacity-30"
            style={{ color: 'var(--text-secondary)' }}
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <span className="text-sm tabular-nums" style={{ color: 'var(--text-muted)' }}>
            Page {page} of {totalPages}
          </span>
          <button
            type="button"
            onClick={() => goToPage(page + 1)}
            disabled={page >= totalPages}
            className="p-2 transition-colors disabled:opacity-30"
            style={{ color: 'var(--text-secondary)' }}
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      )}
    </div>
  )
}
