'use client'

import { Check, X, Info, AlertTriangle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useToast } from '@/providers/toast-provider'

const iconMap = {
  success: Check,
  error: X,
  info: Info,
  warning: AlertTriangle,
}

const colorMap = {
  success: { bg: 'rgba(111,173,118,0.15)', border: 'rgba(111,173,118,0.3)', icon: '#6FAD76' },
  error: { bg: 'rgba(212,100,93,0.15)', border: 'rgba(212,100,93,0.3)', icon: '#D4645D' },
  info: { bg: 'rgba(126,163,194,0.15)', border: 'rgba(126,163,194,0.3)', icon: '#7EA3C2' },
  warning: { bg: 'rgba(201,169,110,0.15)', border: 'rgba(201,169,110,0.3)', icon: '#c9a96e' },
}

function Toast() {
  const { toasts, removeToast } = useToast()

  if (toasts.length === 0) return null

  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2">
      {toasts.map((toast) => {
        const Icon = iconMap[toast.type]
        const colors = colorMap[toast.type]

        return (
          <div
            key={toast.id}
            className={cn('flex items-center gap-3 px-4 py-3 min-w-[300px] max-w-[420px] animate-in slide-in-from-right')}
            style={{
              borderRadius: 0,
              backgroundColor: colors.bg,
              border: `1px solid ${colors.border}`,
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            }}
          >
            <Icon className="h-4 w-4 flex-shrink-0" style={{ color: colors.icon }} />
            <span className="flex-1 text-sm" style={{ color: 'var(--text-primary)' }}>
              {toast.message}
            </span>
            <button
              type="button"
              onClick={() => removeToast(toast.id)}
              className="flex-shrink-0 p-0.5 transition-opacity hover:opacity-70 focus:outline-none"
              style={{ color: 'var(--text-muted)' }}
              aria-label="Dismiss"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        )
      })}
    </div>
  )
}

export { Toast }
