'use client'

import { useState, useRef, useCallback } from 'react'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface AddressInputProps {
  value: string[]
  onChange: (addresses: string[]) => void
  label: string
  placeholder?: string
  className?: string
}

export function AddressInput({ value, onChange, label, placeholder, className }: AddressInputProps) {
  const [inputValue, setInputValue] = useState('')
  const [focused, setFocused] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const addAddress = useCallback(
    (raw: string) => {
      const trimmed = raw.trim()
      if (trimmed && !value.includes(trimmed)) {
        onChange([...value, trimmed])
      }
    },
    [value, onChange]
  )

  const removeAddress = useCallback(
    (index: number) => {
      onChange(value.filter((_, i) => i !== index))
    },
    [value, onChange]
  )

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      if (inputValue.trim()) {
        addAddress(inputValue)
        setInputValue('')
      }
    } else if (e.key === 'Backspace' && !inputValue && value.length > 0) {
      removeAddress(value.length - 1)
    }
  }

  function handleBlur() {
    setFocused(false)
    if (inputValue.trim()) {
      addAddress(inputValue)
      setInputValue('')
    }
  }

  function handlePaste(e: React.ClipboardEvent<HTMLInputElement>) {
    e.preventDefault()
    const pasted = e.clipboardData.getData('text')
    const addresses = pasted.split(/[,;\s]+/).filter(Boolean)
    const newAddresses = [...value]
    for (const addr of addresses) {
      const trimmed = addr.trim()
      if (trimmed && !newAddresses.includes(trimmed)) {
        newAddresses.push(trimmed)
      }
    }
    onChange(newAddresses)
  }

  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <label
        className="text-sm font-medium"
        style={{ color: 'var(--text-secondary)' }}
      >
        {label}
      </label>
      <div
        className="flex flex-wrap items-center gap-1.5 min-h-[40px] px-2 py-1.5 cursor-text"
        style={{
          borderRadius: 0,
          backgroundColor: 'var(--bg-elevated)',
          border: `1px solid ${focused ? 'var(--border-focus)' : 'var(--border-default)'}`,
        }}
        onClick={() => inputRef.current?.focus()}
      >
        {value.map((address, index) => (
          <span
            key={index}
            className="inline-flex items-center gap-1 px-2 py-0.5 text-xs"
            style={{
              borderRadius: 0,
              backgroundColor: 'var(--accent-subtle)',
              color: 'var(--text-primary)',
              border: '1px solid var(--border-default)',
            }}
          >
            {address}
            <button
              type="button"
              className="inline-flex items-center justify-center h-3.5 w-3.5 hover:opacity-70"
              onClick={(e) => {
                e.stopPropagation()
                removeAddress(index)
              }}
              style={{ color: 'var(--text-muted)' }}
            >
              <X className="h-3 w-3" />
            </button>
          </span>
        ))}
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          onFocus={() => setFocused(true)}
          onPaste={handlePaste}
          placeholder={value.length === 0 ? placeholder || `Add ${label.toLowerCase()} addresses` : ''}
          className="flex-1 min-w-[120px] h-7 bg-transparent text-sm outline-none"
          style={{ color: 'var(--text-primary)' }}
        />
      </div>
    </div>
  )
}
