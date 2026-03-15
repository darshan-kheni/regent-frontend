'use client'

import { cn } from '@/lib/utils'

interface Tab {
  id: string
  label: string
}

interface TabsProps {
  tabs: Tab[]
  activeTab: string
  onTabChange: (id: string) => void
  children: React.ReactNode
  className?: string
}

function Tabs({ tabs, activeTab, onTabChange, children, className }: TabsProps) {
  return (
    <div className={cn('flex flex-col', className)}>
      <div
        className="flex gap-0 overflow-x-auto"
        role="tablist"
        style={{ borderBottom: '1px solid var(--border-default)' }}
      >
        {tabs.map((tab) => {
          const isActive = tab.id === activeTab
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
              onClick={() => onTabChange(tab.id)}
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
      <div role="tabpanel" className="pt-4">
        {children}
      </div>
    </div>
  )
}

export { Tabs, type TabsProps, type Tab }
