'use client'

import { useState, useRef } from 'react'
import { cn } from '@/lib/utils'

interface TooltipProps {
  content: string
  placement?: 'top' | 'bottom' | 'left' | 'right'
  children: React.ReactNode
  className?: string
}

function Tooltip({ content, placement = 'top', children, className }: TooltipProps) {
  const [visible, setVisible] = useState(false)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  function show() {
    timeoutRef.current = setTimeout(() => setVisible(true), 200)
  }

  function hide() {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
    setVisible(false)
  }

  const positionStyles: Record<string, React.CSSProperties> = {
    top: { bottom: '100%', left: '50%', transform: 'translateX(-50%)', marginBottom: 8 },
    bottom: { top: '100%', left: '50%', transform: 'translateX(-50%)', marginTop: 8 },
    left: { right: '100%', top: '50%', transform: 'translateY(-50%)', marginRight: 8 },
    right: { left: '100%', top: '50%', transform: 'translateY(-50%)', marginLeft: 8 },
  }

  const arrowStyles: Record<string, React.CSSProperties> = {
    top: { bottom: -4, left: '50%', transform: 'translateX(-50%) rotate(45deg)' },
    bottom: { top: -4, left: '50%', transform: 'translateX(-50%) rotate(45deg)' },
    left: { right: -4, top: '50%', transform: 'translateY(-50%) rotate(45deg)' },
    right: { left: -4, top: '50%', transform: 'translateY(-50%) rotate(45deg)' },
  }

  return (
    <div
      className={cn('relative inline-flex', className)}
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={hide}
    >
      {children}
      {visible && (
        <div
          className="absolute z-50 whitespace-nowrap px-2.5 py-1.5 text-xs"
          style={{
            borderRadius: 0,
            backgroundColor: 'var(--bg-elevated)',
            color: 'var(--text-primary)',
            border: '1px solid var(--border-default)',
            boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
            ...positionStyles[placement],
          }}
        >
          {content}
          <div
            className="absolute h-2 w-2"
            style={{
              backgroundColor: 'var(--bg-elevated)',
              borderRight: '1px solid var(--border-default)',
              borderBottom: '1px solid var(--border-default)',
              ...arrowStyles[placement],
            }}
          />
        </div>
      )}
    </div>
  )
}

export { Tooltip, type TooltipProps }
