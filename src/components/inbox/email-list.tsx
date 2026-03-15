'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { EmailRow } from '@/components/inbox/email-row'
import type { Email } from '@/types/email'

interface EmailListProps {
  emails: Email[]
  isLoading: boolean
  isPageLoading?: boolean
  page: number
  totalPages: number
  total: number
  onPageChange: (page: number) => void
}

function EmailListSkeleton() {
  return (
    <div className="flex flex-col">
      {Array.from({ length: 10 }, (_, i) => (
        <div
          key={i}
          className="flex items-center gap-3 px-4 py-3"
          style={{ borderBottom: '1px solid var(--border-subtle)' }}
        >
          <Skeleton width="32px" height="32px" className="flex-shrink-0" />
          <div className="flex-1 flex flex-col gap-1.5">
            <Skeleton width="40%" height="14px" />
            <Skeleton width="70%" height="14px" />
          </div>
          <Skeleton width="60px" height="12px" className="flex-shrink-0" />
        </div>
      ))}
    </div>
  )
}

function EmailList({ emails, isLoading, isPageLoading, page, totalPages, total, onPageChange }: EmailListProps) {
  if (isLoading) {
    return <EmailListSkeleton />
  }

  if (emails.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <p
          className="text-sm"
          style={{ color: 'var(--text-muted)' }}
        >
          No emails match your filters.
        </p>
      </div>
    )
  }

  const startItem = (page - 1) * 50 + 1
  const endItem = Math.min(page * 50, total)

  return (
    <div className="flex flex-col h-full">
      {/* Email rows */}
      <div
        className="flex-1 overflow-y-auto transition-opacity"
        style={{ opacity: isPageLoading ? 0.5 : 1 }}
      >
        {emails.map((email) => (
          <EmailRow key={email.id} email={email} />
        ))}
      </div>

      {/* Pagination bar */}
      {totalPages > 1 && (
        <div
          className="flex items-center justify-between px-4 py-2 flex-shrink-0"
          style={{
            borderTop: '1px solid var(--border-subtle)',
            backgroundColor: 'var(--bg-secondary)',
          }}
        >
          {/* Info */}
          <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
            {startItem}–{endItem} of {total}
          </span>

          {/* Controls */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => onPageChange(page - 1)}
              className="p-1 transition-colors disabled:opacity-30"
              style={{ color: 'var(--text-secondary)' }}
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            {generatePageNumbers(page, totalPages).map((p, i) =>
              p === '...' ? (
                <span
                  key={`dots-${i}`}
                  className="px-1 text-xs"
                  style={{ color: 'var(--text-muted)' }}
                >
                  ...
                </span>
              ) : (
                <button
                  key={p}
                  type="button"
                  onClick={() => onPageChange(p as number)}
                  className="min-w-[28px] h-7 text-xs font-medium transition-colors"
                  style={{
                    backgroundColor: p === page ? 'rgba(201,169,110,0.15)' : 'transparent',
                    color: p === page ? 'var(--accent)' : 'var(--text-muted)',
                    borderRadius: 0,
                  }}
                >
                  {p}
                </button>
              )
            )}

            <button
              type="button"
              disabled={page >= totalPages}
              onClick={() => onPageChange(page + 1)}
              className="p-1 transition-colors disabled:opacity-30"
              style={{ color: 'var(--text-secondary)' }}
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

/** Generate page numbers with ellipsis: [1, 2, ..., 5, 6, 7, ..., 20] */
function generatePageNumbers(current: number, total: number): (number | '...')[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1)
  }

  const pages: (number | '...')[] = []

  // Always show first page
  pages.push(1)

  if (current > 3) {
    pages.push('...')
  }

  // Pages around current
  const start = Math.max(2, current - 1)
  const end = Math.min(total - 1, current + 1)
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }

  if (current < total - 2) {
    pages.push('...')
  }

  // Always show last page
  if (total > 1) {
    pages.push(total)
  }

  return pages
}

export { EmailList, type EmailListProps }
