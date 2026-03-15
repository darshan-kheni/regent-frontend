'use client'

import { forwardRef, useState } from 'react'
import { cn } from '@/lib/utils'

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  type?: 'text' | 'email' | 'password'
  label?: string
  error?: string
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = 'text', label, error, id, disabled, onFocus, onBlur, ...props }, ref) => {
    const [focused, setFocused] = useState(false)
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined)

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium"
            style={{ color: 'var(--text-secondary)' }}
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          type={type}
          disabled={disabled}
          className={cn(
            'h-10 w-full px-3 text-sm transition-colors focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed',
            className
          )}
          style={{
            borderRadius: 0,
            backgroundColor: 'var(--bg-elevated)',
            color: 'var(--text-primary)',
            border: `1px solid ${error ? 'var(--color-critical)' : focused ? 'var(--border-focus)' : 'var(--border-default)'}`,
          }}
          onFocus={(e) => {
            setFocused(true)
            onFocus?.(e)
          }}
          onBlur={(e) => {
            setFocused(false)
            onBlur?.(e)
          }}
          {...props}
        />
        {error && (
          <span className="text-xs" style={{ color: 'var(--color-critical)' }}>
            {error}
          </span>
        )}
      </div>
    )
  }
)
Input.displayName = 'Input'
export { Input, type InputProps }
