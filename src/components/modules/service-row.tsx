'use client'

import { useState } from 'react'
import {
  Download,
  Send,
  Tags,
  ArrowUpDown,
  Smile,
  FileText,
  Database,
  BookOpen,
  UserPlus,
  PenLine,
  Crown,
  GraduationCap,
  Sparkles,
  Brain,
  Heart,
  Bell,
  MessageCircle,
  Lock,
  type LucideIcon,
} from 'lucide-react'
import { Badge, Toggle, Modal, Button } from '@/components/ui'
import type { ServiceConfig } from '@/types/settings'

interface ServiceRowProps {
  service: ServiceConfig
  onToggle: (id: string, enabled: boolean) => void
}

const ICON_MAP: Record<string, LucideIcon> = {
  Download,
  Send,
  Tags,
  ArrowUpDown,
  Smile,
  FileText,
  Database,
  BookOpen,
  UserPlus,
  PenLine,
  Crown,
  GraduationCap,
  Sparkles,
  Brain,
  Heart,
  Bell,
  MessageCircle,
}

const CRITICAL_SERVICES = ['categorization', 'summarization', 'email_fetching']

const statusColors: Record<ServiceConfig['status'], string> = {
  active: '#6FAD76',
  degraded: '#D4A74A',
  offline: '#D4645D',
  disabled: '#6B7280',
  locked: '#6B7280',
}

const statusLabels: Record<ServiceConfig['status'], string> = {
  active: 'Active',
  degraded: 'Degraded',
  offline: 'Offline',
  disabled: 'Disabled',
  locked: 'Upgrade Required',
}

export function ServiceRow({ service, onToggle }: ServiceRowProps) {
  const [confirmOpen, setConfirmOpen] = useState(false)

  const IconComponent = ICON_MAP[service.icon] || FileText
  const isCritical = CRITICAL_SERVICES.includes(service.id)

  function handleToggle(checked: boolean) {
    if (!checked && isCritical && service.enabled) {
      setConfirmOpen(true)
      return
    }
    onToggle(service.id, checked)
  }

  function handleConfirmDisable() {
    onToggle(service.id, false)
    setConfirmOpen(false)
  }

  if (service.is_coming_soon) {
    return (
      <div
        className="flex items-center gap-4 py-3.5 px-4 opacity-40"
        style={{ borderBottom: '1px solid var(--border-subtle)' }}
      >
        <div
          className="flex items-center justify-center h-9 w-9 flex-shrink-0"
          style={{ backgroundColor: 'rgba(110,102,96,0.08)' }}
        >
          <Lock className="h-4 w-4" style={{ color: 'var(--text-muted)' }} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>
            {service.name}
          </p>
          <p className="text-xs mt-0.5 truncate" style={{ color: 'var(--text-muted)' }}>
            {service.description}
          </p>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          <Badge variant="muted">Coming Soon</Badge>
          <Toggle checked={false} onChange={() => {}} disabled />
        </div>
      </div>
    )
  }

  return (
    <>
      <div
        className="flex items-center gap-4 py-3.5 px-4 transition-colors duration-150"
        style={{ borderBottom: '1px solid var(--border-subtle)' }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = 'var(--accent-subtle, rgba(201,169,110,0.04))'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'transparent'
        }}
      >
        {/* Icon */}
        <div
          className="flex items-center justify-center h-9 w-9 flex-shrink-0"
          style={{
            backgroundColor: service.enabled
              ? 'rgba(201,169,110,0.12)'
              : 'rgba(110,102,96,0.08)',
          }}
        >
          <IconComponent
            className="h-4 w-4"
            style={{
              color: service.enabled ? 'var(--accent)' : 'var(--text-muted)',
            }}
          />
        </div>

        {/* Name + Description */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p
              className="text-sm font-medium"
              style={{ color: 'var(--text-primary)' }}
            >
              {service.name}
            </p>
            {/* Status dot */}
            <span
              className="h-1.5 w-1.5 flex-shrink-0"
              title={statusLabels[service.status]}
              style={{
                borderRadius: 9999,
                backgroundColor: service.enabled
                  ? statusColors[service.status]
                  : 'var(--text-muted)',
                opacity: service.enabled ? 1 : 0.4,
              }}
            />
          </div>
          <p
            className="text-xs mt-0.5 truncate"
            style={{ color: 'var(--text-muted)' }}
          >
            {service.description}
          </p>
        </div>

        {/* Model badge + toggle */}
        <div className="flex items-center gap-3 flex-shrink-0">
          {service.model && (
            <Badge variant="info">
              <span className="font-mono text-[10px]">{service.model}</span>
            </Badge>
          )}
          <Toggle checked={service.enabled} onChange={handleToggle} />
        </div>
      </div>

      <Modal
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        title={`Disable ${service.name}?`}
        footer={
          <>
            <Button variant="secondary" onClick={() => setConfirmOpen(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleConfirmDisable}>
              Disable
            </Button>
          </>
        }
      >
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          Disabling <strong>{service.name}</strong> will stop {service.description.toLowerCase()}.
          Are you sure?
        </p>
      </Modal>
    </>
  )
}
