'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SelectOption {
  value: string
  label: string
}

interface SelectProps {
  options: SelectOption[]
  value?: string
  onChange?: (value: string) => void
  label?: string
  error?: string
  placeholder?: string
  disabled?: boolean
  className?: string
}

function Select({ options, value, onChange, label, error, placeholder = 'Select...', disabled, className }: SelectProps) {
  const [open, setOpen] = useState(false)
  const [focusedIndex, setFocusedIndex] = useState(-1)
  const containerRef = useRef<HTMLDivElement>(null)
  const listRef = useRef<HTMLUListElement>(null)

  const selectedOption = options.find((o) => o.value === value)

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
      setFocusedIndex(value ? options.findIndex((o) => o.value === value) : 0)
    }
  }, [open, value, options])

  const handleSelect = useCallback((optionValue: string) => {
    onChange?.(optionValue)
    setOpen(false)
  }, [onChange])

  function handleKeyDown(e: React.KeyboardEvent) {
    if (disabled) return

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
        setFocusedIndex((prev) => Math.min(prev + 1, options.length - 1))
        break
      case 'ArrowUp':
        e.preventDefault()
        setFocusedIndex((prev) => Math.max(prev - 1, 0))
        break
      case 'Enter':
        e.preventDefault()
        if (focusedIndex >= 0 && focusedIndex < options.length) {
          handleSelect(options[focusedIndex].value)
        }
        break
      case 'Escape':
        e.preventDefault()
        setOpen(false)
        break
    }
  }

  useEffect(() => {
    if (open && listRef.current && focusedIndex >= 0) {
      const items = listRef.current.children
      if (items[focusedIndex]) {
        (items[focusedIndex] as HTMLElement).scrollIntoView({ block: 'nearest' })
      }
    }
  }, [focusedIndex, open])

  return (
    <div className={cn('flex flex-col gap-1.5', className)} ref={containerRef}>
      {label && (
        <label className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
          {label}
        </label>
      )}
      <div className="relative">
        <button
          type="button"
          disabled={disabled}
          className={cn(
            'flex h-10 w-full items-center justify-between px-3 text-sm transition-colors focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed'
          )}
          style={{
            borderRadius: 0,
            backgroundColor: 'var(--bg-elevated)',
            color: selectedOption ? 'var(--text-primary)' : 'var(--text-muted)',
            border: `1px solid ${error ? 'var(--color-critical)' : open ? 'var(--border-focus)' : 'var(--border-default)'}`,
          }}
          onClick={() => !disabled && setOpen(!open)}
          onKeyDown={handleKeyDown}
          aria-expanded={open}
          aria-haspopup="listbox"
        >
          <span>{selectedOption ? selectedOption.label : placeholder}</span>
          <ChevronDown
            className={cn('h-4 w-4 transition-transform', open && 'rotate-180')}
            style={{ color: 'var(--text-muted)' }}
          />
        </button>

        {open && (
          <ul
            ref={listRef}
            role="listbox"
            className="absolute z-50 mt-1 max-h-60 w-full overflow-auto py-1"
            style={{
              borderRadius: 0,
              backgroundColor: 'var(--bg-elevated)',
              border: '1px solid var(--border-default)',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            }}
          >
            {options.map((option, index) => (
              <li
                key={option.value}
                role="option"
                aria-selected={option.value === value}
                className={cn(
                  'cursor-pointer px-3 py-2 text-sm transition-colors'
                )}
                style={{
                  color: option.value === value ? 'var(--accent)' : 'var(--text-primary)',
                  backgroundColor: index === focusedIndex ? 'var(--accent-subtle)' : 'transparent',
                }}
                onClick={() => handleSelect(option.value)}
                onMouseEnter={() => setFocusedIndex(index)}
              >
                {option.label}
              </li>
            ))}
          </ul>
        )}
      </div>
      {error && (
        <span className="text-xs" style={{ color: 'var(--color-critical)' }}>
          {error}
        </span>
      )}
    </div>
  )
}

export { Select, type SelectProps, type SelectOption }
