'use client'

import { useCallback } from 'react'
import { Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dropdown } from '@/components/ui/dropdown'
import type { AnalyticsData, ServiceBreakdown } from '@/types/analytics'
import type { AnalyticsPeriod } from '@/hooks/use-analytics'

interface ExportButtonProps {
  data: AnalyticsData
  services: ServiceBreakdown[]
  period: AnalyticsPeriod
}

function getFilename(period: AnalyticsPeriod, ext: string): string {
  const date = new Date().toISOString().slice(0, 10)
  return `regent-analytics-${period}-${date}.${ext}`
}

function downloadBlob(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

function generateCsv(data: AnalyticsData, services: ServiceBreakdown[]): string {
  const lines: string[] = []

  lines.push('Metric,Value')
  lines.push(`Tokens Used,${data.tokens_used}`)
  lines.push(`Tokens Limit,${data.tokens_limit}`)
  lines.push(`AI Calls,${data.ai_calls}`)
  lines.push(`Avg Latency (ms),${data.avg_latency_ms}`)
  lines.push(`Cache Hit Rate (%),${data.cache_hit_rate}`)
  lines.push(`Draft Acceptance Rate (%),${data.draft_acceptance_rate}`)
  lines.push('')

  if (data.trend.length > 0) {
    lines.push('Date,Tokens')
    for (const entry of data.trend) {
      lines.push(`${entry.date},${entry.tokens}`)
    }
    lines.push('')
  }

  if (services.length > 0) {
    lines.push('Service,Model,Tokens,API Calls,Avg Latency (ms),Usage %')
    for (const s of services) {
      lines.push(`${s.service_name},${s.model},${s.tokens},${s.calls},${s.avg_latency_ms},${s.usage_percent}`)
    }
  }

  return lines.join('\n')
}

export function ExportButton({ data, services, period }: ExportButtonProps) {
  const handleExportCsv = useCallback(() => {
    const csv = generateCsv(data, services)
    downloadBlob(csv, getFilename(period, 'csv'), 'text/csv;charset=utf-8;')
  }, [data, services, period])

  const handleExportJson = useCallback(() => {
    const json = JSON.stringify({ analytics: data, services }, null, 2)
    downloadBlob(json, getFilename(period, 'json'), 'application/json')
  }, [data, services, period])

  return (
    <Dropdown
      trigger={
        <Button variant="secondary" size="sm">
          <Download size={16} className="mr-2" />
          Export
        </Button>
      }
      items={[
        { label: 'Export CSV', onClick: handleExportCsv },
        { label: 'Export JSON', onClick: handleExportJson },
      ]}
      align="right"
    />
  )
}
