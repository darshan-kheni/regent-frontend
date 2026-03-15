'use client'

import { Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { AuditEntry } from '@/types/analytics'

interface LogExportProps {
  data: AuditEntry[]
}

function escapeCsvField(value: string | number | null): string {
  if (value === null) return ''
  const str = String(value)
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`
  }
  return str
}

function generateCsv(entries: AuditEntry[]): string {
  const headers = ['ID', 'Event Type', 'Email Subject', 'Description', 'Model', 'Tokens', 'Latency (ms)', 'Confidence', 'Created At']
  const rows = entries.map((e) => [
    escapeCsvField(e.id),
    escapeCsvField(e.event_type),
    escapeCsvField(e.email_subject),
    escapeCsvField(e.description),
    escapeCsvField(e.model_used),
    escapeCsvField(e.tokens_consumed),
    escapeCsvField(e.latency_ms),
    escapeCsvField(e.confidence),
    escapeCsvField(e.created_at),
  ].join(','))

  return [headers.join(','), ...rows].join('\n')
}

function LogExport({ data }: LogExportProps) {
  function handleExport() {
    const csv = generateCsv(data)
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const date = new Date().toISOString().split('T')[0]
    const link = document.createElement('a')
    link.href = url
    link.download = `regent-audit-log-${date}.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  return (
    <Button variant="ghost" size="sm" onClick={handleExport} disabled={data.length === 0}>
      <Download className="h-4 w-4 mr-2" />
      Export CSV
    </Button>
  )
}

export { LogExport }
