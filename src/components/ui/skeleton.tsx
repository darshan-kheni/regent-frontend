'use client'

import { cn } from '@/lib/utils'

interface SkeletonProps {
  width?: string
  height?: string
  className?: string
}

function Skeleton({ width, height = '16px', className }: SkeletonProps) {
  return (
    <div
      className={cn('animate-shimmer', className)}
      style={{
        borderRadius: 0,
        width: width || '100%',
        height,
        background: 'linear-gradient(90deg, var(--bg-secondary) 25%, var(--bg-elevated) 50%, var(--bg-secondary) 75%)',
        backgroundSize: '200% 100%',
      }}
    />
  )
}

export { Skeleton, type SkeletonProps }
