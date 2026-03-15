'use client'

import { useConnectionStatus } from '@/hooks/use-connection-status'
import type { ConnectionStatus } from '@/hooks/use-connection-status'
import { Tooltip } from '@/components/ui'

const statusConfig: Record<ConnectionStatus, { color: string; label: string; pulse: boolean }> = {
  connected: { color: '#6FAD76', label: 'Connected', pulse: false },
  reconnecting: { color: '#D4A94E', label: 'Reconnecting...', pulse: true },
  disconnected: { color: '#D4645D', label: 'Disconnected', pulse: false },
}

export function ConnectionDot() {
  const status = useConnectionStatus()
  const config = statusConfig[status]

  return (
    <Tooltip content={config.label} placement="top">
      <span
        className="relative inline-block flex-shrink-0"
        style={{ width: 8, height: 8 }}
      >
        <span
          className="absolute inset-0 block"
          style={{
            width: 8,
            height: 8,
            borderRadius: 9999,
            backgroundColor: config.color,
          }}
        />
        {config.pulse && (
          <span
            className="absolute inset-0 block animate-ping"
            style={{
              width: 8,
              height: 8,
              borderRadius: 9999,
              backgroundColor: config.color,
              opacity: 0.75,
            }}
          />
        )}
      </span>
    </Tooltip>
  )
}
