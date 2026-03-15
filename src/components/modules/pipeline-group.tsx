'use client'

import { useState } from 'react'
import { ChevronDown, ChevronRight } from 'lucide-react'
import { Card, Badge } from '@/components/ui'
import { ServiceRow } from './service-row'
import type { ServiceConfig } from '@/types/settings'

interface PipelineGroupProps {
  title: string
  services: ServiceConfig[]
  onToggle: (id: string, enabled: boolean) => void
}

export function PipelineGroup({ title, services, onToggle }: PipelineGroupProps) {
  const [expanded, setExpanded] = useState(true)

  const activeCount = services.filter((s) => s.enabled && !s.is_coming_soon).length
  const totalCount = services.filter((s) => !s.is_coming_soon).length

  return (
    <Card padding="sm" className="overflow-hidden">
      <button
        type="button"
        className="flex items-center justify-between w-full px-4 py-3 text-left"
        onClick={() => setExpanded((prev) => !prev)}
        style={{ color: 'var(--text-primary)' }}
      >
        <div className="flex items-center gap-2.5">
          {expanded ? (
            <ChevronDown className="h-4 w-4" style={{ color: 'var(--text-muted)' }} />
          ) : (
            <ChevronRight className="h-4 w-4" style={{ color: 'var(--text-muted)' }} />
          )}
          <span
            className="text-xs font-semibold tracking-widest"
            style={{ color: 'var(--text-muted)', letterSpacing: '0.1em' }}
          >
            {title.toUpperCase()}
          </span>
        </div>
        <Badge variant={activeCount === totalCount ? 'success' : activeCount > 0 ? 'gold' : 'muted'}>
          {activeCount}/{totalCount}
        </Badge>
      </button>

      {expanded && (
        <div style={{ borderTop: '1px solid var(--border-subtle)' }}>
          {services.length === 0 ? (
            <p
              className="px-4 py-6 text-sm text-center"
              style={{ color: 'var(--text-muted)' }}
            >
              No services configured
            </p>
          ) : (
            services.map((service) => (
              <ServiceRow
                key={service.id}
                service={service}
                onToggle={onToggle}
              />
            ))
          )}
        </div>
      )}
    </Card>
  )
}
