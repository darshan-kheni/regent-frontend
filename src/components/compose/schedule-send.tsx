'use client'

import { Clock } from 'lucide-react'
import { Tooltip } from '@/components/ui'

export function ScheduleSend() {
  return (
    <Tooltip content="Coming soon — backend support not yet available" placement="top">
      <div className="flex items-center gap-2 opacity-50 cursor-not-allowed">
        <Clock className="h-4 w-4" style={{ color: 'var(--text-muted)' }} />
        <input
          type="datetime-local"
          disabled
          className="h-8 px-2 text-xs"
          style={{
            borderRadius: 0,
            backgroundColor: 'var(--bg-elevated)',
            border: '1px solid var(--border-default)',
            color: 'var(--text-muted)',
            cursor: 'not-allowed',
          }}
        />
        <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
          Schedule Send
        </span>
      </div>
    </Tooltip>
  )
}
