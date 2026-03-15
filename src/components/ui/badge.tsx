'use client'

import { cn } from '@/lib/utils'

type BadgeVariant = 'gold' | 'urgent' | 'info' | 'success' | 'muted' | 'work' | 'finance' | 'reading' | 'personal' | 'system' | 'cyan' | 'orange'

interface BadgeProps {
  variant: BadgeVariant | string
  children: React.ReactNode
  className?: string
}

const colorMap: Record<string, { bg: string; text: string }> = {
  gold: { bg: 'rgba(201,169,110,0.15)', text: '#c9a96e' },
  urgent: { bg: 'rgba(212,100,93,0.15)', text: '#D4645D' },
  info: { bg: 'rgba(126,163,194,0.15)', text: '#7EA3C2' },
  success: { bg: 'rgba(111,173,118,0.15)', text: '#6FAD76' },
  muted: { bg: 'rgba(110,102,96,0.15)', text: '#6E6660' },
  work: { bg: 'rgba(126,163,194,0.15)', text: '#7EA3C2' },
  finance: { bg: 'rgba(201,169,110,0.15)', text: '#c9a96e' },
  reading: { bg: 'rgba(155,126,189,0.15)', text: '#9B7EBD' },
  personal: { bg: 'rgba(194,126,155,0.15)', text: '#C27E9B' },
  system: { bg: 'rgba(110,102,96,0.15)', text: '#6E6660' },
  cyan: { bg: 'rgba(91,164,201,0.15)', text: '#5BA4C9' },
  orange: { bg: 'rgba(201,134,90,0.15)', text: '#C9865A' },
  // Dynamic AI categories get auto-assigned colors below
  shopping: { bg: 'rgba(201,134,90,0.15)', text: '#C9865A' },
  social: { bg: 'rgba(194,126,155,0.15)', text: '#C27E9B' },
  travel: { bg: 'rgba(91,164,201,0.15)', text: '#5BA4C9' },
  newsletters: { bg: 'rgba(155,126,189,0.15)', text: '#9B7EBD' },
  promotions: { bg: 'rgba(201,169,110,0.15)', text: '#c9a96e' },
  updates: { bg: 'rgba(126,163,194,0.15)', text: '#7EA3C2' },
  security: { bg: 'rgba(212,100,93,0.15)', text: '#D4645D' },
  health: { bg: 'rgba(111,173,118,0.15)', text: '#6FAD76' },
  education: { bg: 'rgba(91,164,201,0.15)', text: '#5BA4C9' },
  entertainment: { bg: 'rgba(155,126,189,0.15)', text: '#9B7EBD' },
  legal: { bg: 'rgba(201,169,110,0.15)', text: '#c9a96e' },
  recruitment: { bg: 'rgba(126,163,194,0.15)', text: '#7EA3C2' },
  support: { bg: 'rgba(110,102,96,0.15)', text: '#6E6660' },
  shipping: { bg: 'rgba(201,134,90,0.15)', text: '#C9865A' },
  events: { bg: 'rgba(194,126,155,0.15)', text: '#C27E9B' },
  subscriptions: { bg: 'rgba(155,126,189,0.15)', text: '#9B7EBD' },
  spam: { bg: 'rgba(110,102,96,0.15)', text: '#6E6660' },
}

// Generate a consistent color for unknown categories based on string hash
const DYNAMIC_PALETTE = [
  { bg: 'rgba(126,163,194,0.15)', text: '#7EA3C2' },
  { bg: 'rgba(201,169,110,0.15)', text: '#c9a96e' },
  { bg: 'rgba(155,126,189,0.15)', text: '#9B7EBD' },
  { bg: 'rgba(194,126,155,0.15)', text: '#C27E9B' },
  { bg: 'rgba(111,173,118,0.15)', text: '#6FAD76' },
  { bg: 'rgba(91,164,201,0.15)', text: '#5BA4C9' },
  { bg: 'rgba(201,134,90,0.15)', text: '#C9865A' },
]

function getColorForCategory(variant: string): { bg: string; text: string } {
  if (colorMap[variant]) return colorMap[variant]
  // Hash the string to pick a consistent color
  let hash = 0
  for (let i = 0; i < variant.length; i++) {
    hash = variant.charCodeAt(i) + ((hash << 5) - hash)
  }
  return DYNAMIC_PALETTE[Math.abs(hash) % DYNAMIC_PALETTE.length]
}

function Badge({ variant, children, className }: BadgeProps) {
  const colors = getColorForCategory(variant)
  return (
    <span
      className={cn('inline-flex items-center px-2 py-0.5 text-xs font-medium', className)}
      style={{
        borderRadius: 0,
        backgroundColor: colors.bg,
        color: colors.text,
      }}
    >
      {children}
    </span>
  )
}

export { Badge, type BadgeProps, type BadgeVariant }
