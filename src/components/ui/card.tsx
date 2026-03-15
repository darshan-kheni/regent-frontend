'use client'

import { cn } from '@/lib/utils'

interface CardProps {
  padding?: 'sm' | 'md' | 'lg'
  hover?: boolean
  className?: string
  children: React.ReactNode
}

const paddingSizes = {
  sm: 'p-3',
  md: 'p-4',
  lg: 'p-6',
}

function Card({ padding = 'md', hover = false, className, children }: CardProps) {
  return (
    <div
      className={cn(
        paddingSizes[padding],
        hover && 'transition-colors cursor-pointer',
        className
      )}
      style={{
        borderRadius: 0,
        backgroundColor: 'var(--bg-card)',
        border: '1px solid var(--border-subtle)',
        ...(hover ? { ['--_hover-bg' as string]: 'var(--accent-subtle)' } : {}),
      }}
      onMouseEnter={(e) => {
        if (hover) (e.currentTarget.style.backgroundColor = 'var(--accent-subtle)')
      }}
      onMouseLeave={(e) => {
        if (hover) (e.currentTarget.style.backgroundColor = 'var(--bg-card)')
      }}
    >
      {children}
    </div>
  )
}

export { Card, type CardProps }
