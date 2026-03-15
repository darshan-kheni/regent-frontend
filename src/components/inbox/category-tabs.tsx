'use client'

import { useMemo } from 'react'
import { Tabs } from '@/components/ui/tabs'

interface CategoryTabsProps {
  activeCategory: string
  onCategoryChange: (category: string) => void
  counts?: Record<string, number>
  children?: React.ReactNode
}

// Categories that should appear first in a fixed order (if they exist)
const PRIORITY_ORDER = ['all', 'urgent', 'work', 'finance', 'personal']

function formatCategoryLabel(id: string): string {
  return id
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
}

function CategoryTabs({ activeCategory, onCategoryChange, counts, children }: CategoryTabsProps) {
  const tabs = useMemo(() => {
    if (!counts || Object.keys(counts).length === 0) {
      // Fallback: just show "All" tab
      return [{ id: 'all', label: 'All' }]
    }

    // Build tabs from category_counts, sorted: priority categories first, then by count desc
    const allCategories = Object.keys(counts).filter((c) => c !== 'all')

    // Split into priority and rest
    const priorityCats = PRIORITY_ORDER.filter((c) => c === 'all' || counts[c] !== undefined)
    const restCats = allCategories
      .filter((c) => !PRIORITY_ORDER.includes(c) && c !== 'uncategorized')
      .sort((a, b) => (counts[b] ?? 0) - (counts[a] ?? 0))

    // Only show categories that have emails (except 'all' which always shows)
    const orderedIds = [...priorityCats, ...restCats].filter(
      (c) => c === 'all' || (counts[c] ?? 0) > 0
    )

    return orderedIds.map((id) => {
      const count = counts[id]
      const label = formatCategoryLabel(id)
      return {
        id,
        label: count !== undefined && count > 0 ? `${label} (${count})` : label,
      }
    })
  }, [counts])

  // When no children, render just the tab bar without the Tabs wrapper
  if (!children) {
    return (
      <div
        className="flex gap-0 overflow-x-auto"
        role="tablist"
        style={{ borderBottom: '1px solid var(--border-default)' }}
      >
        {tabs.map((tab) => {
          const isActive = tab.id === activeCategory
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              className="relative px-4 py-2.5 text-sm font-medium whitespace-nowrap transition-colors focus:outline-none"
              style={{
                color: isActive ? 'var(--accent)' : 'var(--text-muted)',
                backgroundColor: 'transparent',
                borderRadius: 0,
              }}
              onClick={() => onCategoryChange(tab.id)}
            >
              {tab.label}
              {isActive && (
                <span
                  className="absolute bottom-0 left-0 right-0 h-0.5"
                  style={{ backgroundColor: 'var(--accent)' }}
                />
              )}
            </button>
          )
        })}
      </div>
    )
  }

  return (
    <Tabs
      tabs={tabs}
      activeTab={activeCategory}
      onTabChange={onCategoryChange}
    >
      {children}
    </Tabs>
  )
}

export { CategoryTabs, type CategoryTabsProps }
