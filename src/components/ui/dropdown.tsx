'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { cn } from '@/lib/utils'

interface DropdownItem {
  label: string
  onClick: () => void
  icon?: React.ReactNode
  danger?: boolean
}

interface DropdownProps {
  trigger: React.ReactNode
  items: DropdownItem[]
  align?: 'left' | 'right'
  className?: string
}

function Dropdown({ trigger, items, align = 'left', className }: DropdownProps) {
  const [open, setOpen] = useState(false)
  const [focusedIndex, setFocusedIndex] = useState(-1)
  const containerRef = useRef<HTMLDivElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    if (open) {
      setFocusedIndex(-1)
    }
  }, [open])

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (!open) {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
        e.preventDefault()
        setOpen(true)
      }
      return
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setFocusedIndex((prev) => Math.min(prev + 1, items.length - 1))
        break
      case 'ArrowUp':
        e.preventDefault()
        setFocusedIndex((prev) => Math.max(prev - 1, 0))
        break
      case 'Enter':
        e.preventDefault()
        if (focusedIndex >= 0 && focusedIndex < items.length) {
          items[focusedIndex].onClick()
          setOpen(false)
        }
        break
      case 'Escape':
        e.preventDefault()
        setOpen(false)
        break
    }
  }, [open, focusedIndex, items])

  return (
    <div ref={containerRef} className={cn('relative inline-block', className)} onKeyDown={handleKeyDown}>
      <div
        role="button"
        tabIndex={0}
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-haspopup="menu"
      >
        {trigger}
      </div>

      {open && (
        <div
          ref={menuRef}
          role="menu"
          className={cn(
            'absolute z-50 mt-1 min-w-[180px] py-1',
            align === 'right' ? 'right-0' : 'left-0'
          )}
          style={{
            borderRadius: 0,
            backgroundColor: 'var(--bg-elevated)',
            border: '1px solid var(--border-default)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          }}
        >
          {items.map((item, index) => (
            <button
              key={index}
              role="menuitem"
              type="button"
              className="flex w-full items-center gap-2 px-3 py-2 text-sm text-left transition-colors focus:outline-none"
              style={{
                color: item.danger ? 'var(--color-critical)' : (index === focusedIndex ? 'var(--accent)' : 'var(--text-primary)'),
                backgroundColor: index === focusedIndex ? 'var(--accent-subtle)' : 'transparent',
              }}
              onClick={() => {
                item.onClick()
                setOpen(false)
              }}
              onMouseEnter={() => setFocusedIndex(index)}
              onMouseLeave={() => setFocusedIndex(-1)}
            >
              {item.icon && <span className="flex-shrink-0">{item.icon}</span>}
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export { Dropdown, type DropdownProps, type DropdownItem }
