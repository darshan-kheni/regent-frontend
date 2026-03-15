'use client'

import { useAuditLog } from '@/hooks/use-audit-log'
import { LogFilters } from '@/components/audit-log/log-filters'
import { LogEntry } from '@/components/audit-log/log-entry'
import { LogExport } from '@/components/audit-log/log-export'
import { Skeleton, Button } from '@/components/ui'
import { ChevronLeft, ChevronRight, ClipboardList } from 'lucide-react'

export default function AuditLogPage() {
  const {
    entries,
    filters,
    setFilter,
    pagination,
    isLoading,
    goToPage,
  } = useAuditLog()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1
            className="font-display text-3xl"
            style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}
          >
            Audit Log
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
            Every AI decision logged and auditable. Full transparency into how Regent processes your communications.
          </p>
        </div>
        <LogExport data={entries} />
      </div>

      {/* Filter Tab Bar */}
      <LogFilters
        activeFilter={filters}
        onFilterChange={setFilter}
      />

      {/* Entry List */}
      {isLoading ? (
        <div className="space-y-2">
          <Skeleton height="72px" />
          <Skeleton height="72px" />
          <Skeleton height="72px" />
          <Skeleton height="72px" />
          <Skeleton height="72px" />
        </div>
      ) : entries.length === 0 ? (
        <div
          className="flex flex-col items-center justify-center py-20"
          style={{ color: 'var(--text-muted)' }}
        >
          <div
            className="flex items-center justify-center mb-4"
            style={{
              width: '64px',
              height: '64px',
              backgroundColor: 'rgba(201,169,110,0.08)',
              border: '1px solid rgba(201,169,110,0.2)',
              borderRadius: 0,
            }}
          >
            <ClipboardList className="h-7 w-7" style={{ color: '#c9a96e', opacity: 0.6 }} />
          </div>
          <p className="text-sm font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>
            No audit entries yet
          </p>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
            AI decisions will appear here as Regent processes your emails.
          </p>
        </div>
      ) : (
        <>
          <div className="space-y-1">
            {entries.map((entry) => (
              <LogEntry key={entry.id} entry={entry} />
            ))}
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between pt-2">
            <span className="text-sm" style={{ color: 'var(--text-muted)' }}>
              Page {pagination.page}
            </span>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => goToPage(pagination.page - 1)}
                disabled={pagination.page <= 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => goToPage(pagination.page + 1)}
                disabled={!pagination.hasMore}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
