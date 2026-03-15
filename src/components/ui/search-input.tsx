'use client'

import { useState, useEffect, useRef } from 'react'
import { Search, X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SearchInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  debounceMs?: number
  className?: string
}

function SearchInput({ value, onChange, placeholder = 'Search...', debounceMs = 300, className }: SearchInputProps) {
  const [internalValue, setInternalValue] = useState(value)
  const [focused, setFocused] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const isFirstRender = useRef(true)

  // Sync external value changes
  useEffect(() => {
    setInternalValue(value)
  }, [value])

  // Debounce
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }

    const timer = setTimeout(() => {
      if (internalValue !== value) {
        onChange(internalValue)
      }
    }, debounceMs)

    return () => clearTimeout(timer)
  }, [internalValue, debounceMs, onChange, value])

  function handleClear() {
    setInternalValue('')
    onChange('')
    inputRef.current?.focus()
  }

  return (
    <div className={cn('relative', className)}>
      <Search
        className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 pointer-events-none"
        style={{ color: 'var(--text-muted)' }}
      />
      <input
        ref={inputRef}
        type="text"
        value={internalValue}
        onChange={(e) => setInternalValue(e.target.value)}
        placeholder={placeholder}
        className="h-10 w-full pl-9 pr-9 text-sm transition-colors focus:outline-none"
        style={{
          borderRadius: 0,
          backgroundColor: 'var(--bg-elevated)',
          color: 'var(--text-primary)',
          border: `1px solid ${focused ? 'var(--border-focus)' : 'var(--border-default)'}`,
        }}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />
      {internalValue && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 transition-opacity hover:opacity-70 focus:outline-none"
          style={{ color: 'var(--text-muted)' }}
          aria-label="Clear search"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  )
}

export { SearchInput, type SearchInputProps }
