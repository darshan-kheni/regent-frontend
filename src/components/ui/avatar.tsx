'use client'

import { cn } from '@/lib/utils'
import { getInitials } from '@/lib/utils'

interface AvatarProps {
  name: string
  src?: string | null
  size?: 'sm' | 'md' | 'lg'
  status?: 'online' | 'offline' | null
  className?: string
}

const sizeMap = {
  sm: 32,
  md: 40,
  lg: 48,
}

const textSizeMap = {
  sm: 'text-xs',
  md: 'text-sm',
  lg: 'text-base',
}

const statusSizeMap = {
  sm: 8,
  md: 10,
  lg: 12,
}

function Avatar({ name, src, size = 'md', status, className }: AvatarProps) {
  const px = sizeMap[size]
  const statusPx = statusSizeMap[size]

  return (
    <div className={cn('relative inline-flex flex-shrink-0', className)} style={{ width: px, height: px }}>
      {src ? (
        <img
          src={src}
          alt={name}
          className="h-full w-full rounded-full object-cover"
          style={{ borderRadius: 9999 }}
        />
      ) : (
        <div
          className={cn(
            'flex h-full w-full items-center justify-center font-medium',
            textSizeMap[size]
          )}
          style={{
            borderRadius: 9999,
            backgroundColor: 'var(--accent-subtle)',
            color: 'var(--accent)',
          }}
        >
          {getInitials(name)}
        </div>
      )}
      {status && (
        <span
          className="absolute bottom-0 right-0 block border-2"
          style={{
            width: statusPx,
            height: statusPx,
            borderRadius: 9999,
            borderColor: 'var(--bg-card)',
            backgroundColor: status === 'online' ? '#6FAD76' : '#6E6660',
          }}
        />
      )}
    </div>
  )
}

export { Avatar, type AvatarProps }
