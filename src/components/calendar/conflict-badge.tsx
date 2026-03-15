import type { Conflict } from '@/types/calendar'

interface ConflictBadgeProps {
  conflict: Conflict
  compact?: boolean
}

const CONFLICT_CONFIG = {
  hard: { bg: 'bg-red-500', text: 'text-red-700 dark:text-red-400', label: 'Conflict' },
  soft: { bg: 'bg-[#C9A96E]', text: 'text-[#C9A96E]', label: 'Back-to-back' },
  preference: { bg: 'bg-blue-500', text: 'text-blue-600 dark:text-blue-400', label: 'Preference' },
} as const

export function ConflictBadge({ conflict, compact = false }: ConflictBadgeProps) {
  const config = CONFLICT_CONFIG[conflict.type]

  if (compact) {
    return (
      <span className={`inline-block w-2 h-2 ${config.bg}`} title={conflict.detail} />
    )
  }

  return (
    <div className={`inline-flex items-center gap-1 text-xs ${config.text}`}>
      <span className={`w-1.5 h-1.5 ${config.bg}`} />
      <span>{config.label}</span>
      {conflict.overlap_min != null && conflict.overlap_min > 0 && (
        <span>({conflict.overlap_min}m overlap)</span>
      )}
      {conflict.gap_min != null && conflict.type === 'soft' && (
        <span>({conflict.gap_min}m gap)</span>
      )}
    </div>
  )
}
