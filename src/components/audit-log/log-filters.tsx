'use client'

import { Button } from '@/components/ui/button'
import type { AuditFilter } from '@/hooks/use-audit-log'

interface LogFiltersProps {
  activeFilter: AuditFilter
  onFilterChange: (f: AuditFilter) => void
}

const filterOptions: { value: AuditFilter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'categorize', label: 'Categorize' },
  { value: 'summarize', label: 'Summarize' },
  { value: 'draft_reply', label: 'Draft' },
  { value: 'behavior_analysis', label: 'Behavior' },
]

function LogFilters({ activeFilter, onFilterChange }: LogFiltersProps) {
  return (
    <div
      className="flex items-center gap-1 flex-wrap"
      style={{
        borderBottom: '1px solid var(--border-subtle)',
        paddingBottom: '12px',
      }}
    >
      {filterOptions.map((option) => {
        const isActive = activeFilter === option.value
        return (
          <Button
            key={option.value}
            variant="ghost"
            size="sm"
            onClick={() => onFilterChange(option.value)}
            style={isActive ? {
              backgroundColor: 'rgba(201,169,110,0.15)',
              color: '#c9a96e',
              borderBottom: '2px solid #c9a96e',
            } : {
              borderBottom: '2px solid transparent',
            }}
          >
            {option.label}
          </Button>
        )
      })}
    </div>
  )
}

export { LogFilters }
