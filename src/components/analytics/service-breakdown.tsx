'use client'

import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ProgressBar } from '@/components/ui/progress-bar'
import type { ServiceBreakdown as ServiceBreakdownType } from '@/types/analytics'

interface ServiceBreakdownProps {
  services: ServiceBreakdownType[]
}

function formatLatency(ms: number | null | undefined): string {
  const val = ms ?? 0
  if (val >= 1000) return `${(val / 1000).toFixed(1)}s`
  return `${Math.round(val)}ms`
}

export function ServiceBreakdown({ services }: ServiceBreakdownProps) {
  const safeServices = services ?? []

  return (
    <Card padding="lg">
      <h2
        className="font-display text-lg mb-4"
        style={{ color: 'var(--text-primary)' }}
      >
        Service Breakdown
      </h2>

      {safeServices.length === 0 ? (
        <p className="text-sm py-4" style={{ color: 'var(--text-muted)' }}>
          No service usage data available
        </p>
      ) : (
        <div className="space-y-4">
          {/* Header row */}
          <div
            className="hidden sm:grid gap-4 pb-2 text-xs font-medium uppercase tracking-wide"
            style={{
              gridTemplateColumns: '1fr 100px 100px 80px 80px 120px',
              color: 'var(--text-muted)',
              borderBottom: '1px solid var(--border-subtle)',
            }}
          >
            <span>Service</span>
            <span>Model</span>
            <span className="text-right">Tokens</span>
            <span className="text-right">Calls</span>
            <span className="text-right">Latency</span>
            <span>Usage</span>
          </div>

          {/* Service rows */}
          {safeServices.map((service) => (
            <div
              key={`${service?.service_name ?? 'unknown'}-${service?.model ?? ''}`}
              className="grid gap-3 sm:gap-4 items-center py-2"
              style={{
                gridTemplateColumns: '1fr',
                borderBottom: '1px solid var(--border-subtle)',
              }}
            >
              {/* Mobile layout */}
              <div className="sm:hidden space-y-2">
                <div className="flex items-center justify-between">
                  <span
                    className="font-medium text-sm"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    {service?.service_name ?? 'Unknown'}
                  </span>
                  <Badge variant="info">
                    <span className="font-mono text-xs">{service?.model ?? '-'}</span>
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-xs" style={{ color: 'var(--text-muted)' }}>
                  <span>{(service?.tokens ?? 0).toLocaleString()} tokens</span>
                  <span>{(service?.calls ?? 0).toLocaleString()} calls</span>
                  <span>{formatLatency(service?.avg_latency_ms)}</span>
                </div>
                <ProgressBar value={service?.usage_percent ?? 0} showPercent />
              </div>

              {/* Desktop layout */}
              <div
                className="hidden sm:grid gap-4 items-center"
                style={{
                  gridTemplateColumns: '1fr 100px 100px 80px 80px 120px',
                }}
              >
                <span
                  className="font-medium text-sm"
                  style={{ color: 'var(--text-primary)' }}
                >
                  {service?.service_name ?? 'Unknown'}
                </span>
                <Badge variant="info">
                  <span className="font-mono text-xs">{service?.model ?? '-'}</span>
                </Badge>
                <span
                  className="font-mono text-sm text-right"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  {(service?.tokens ?? 0).toLocaleString()}
                </span>
                <span
                  className="text-sm text-right"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  {(service?.calls ?? 0).toLocaleString()}
                </span>
                <span
                  className="text-sm text-right"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  {formatLatency(service?.avg_latency_ms)}
                </span>
                <ProgressBar value={service?.usage_percent ?? 0} showPercent />
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  )
}
