'use client'

import { cn } from '@/lib/utils'

interface ToggleProps {
  checked: boolean
  onChange: (checked: boolean) => void
  disabled?: boolean
  label?: string
  className?: string
}

function Toggle({ checked, onChange, disabled = false, label, className }: ToggleProps) {
  return (
    <label
      className={cn(
        'inline-flex items-center gap-2.5 select-none',
        disabled ? 'opacity-50 pointer-events-none' : 'cursor-pointer',
        className
      )}
    >
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className="relative inline-flex h-6 w-11 flex-shrink-0 items-center transition-colors duration-200 focus:outline-none focus-visible:ring-2"
        style={{
          borderRadius: 9999,
          backgroundColor: checked ? 'var(--accent)' : 'var(--bg-secondary)',
          border: `1px solid ${checked ? 'var(--accent)' : 'var(--border-default)'}`,
        }}
      >
        <span
          className="inline-block h-4 w-4 transform transition-transform duration-200"
          style={{
            borderRadius: 9999,
            backgroundColor: checked ? '#ffffff' : 'var(--text-muted)',
            transform: checked ? 'translateX(22px)' : 'translateX(4px)',
          }}
        />
      </button>
      {label && (
        <span className="text-sm" style={{ color: 'var(--text-primary)' }}>
          {label}
        </span>
      )}
    </label>
  )
}

export { Toggle, type ToggleProps }
