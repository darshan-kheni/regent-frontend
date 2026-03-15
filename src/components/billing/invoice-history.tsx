'use client'

import { useState, useEffect } from 'react'
import { Card, Button } from '@/components/ui'
import { api } from '@/lib/api'
import { useToast } from '@/providers/toast-provider'
import { formatDate } from '@/lib/utils'
import type { Invoice } from '@/types/billing'
import { Download } from 'lucide-react'

export function InvoiceHistory() {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [loading, setLoading] = useState(true)
  const { addToast } = useToast()

  useEffect(() => {
    async function load() {
      try {
        const data = await api.get<Invoice[]>('/billing/invoices')
        setInvoices(Array.isArray(data) ? data : [])
      } catch {
        // Silently handle — show empty state
        setInvoices([])
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [addToast])

  const displayInvoices = invoices

  function formatCurrency(cents: number, currency: string = 'usd'): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(cents / 100)
  }

  return (
    <Card className="!p-0">
      {/* Table Header */}
      <div
        className="flex items-center px-5 py-3"
        style={{
          borderBottom: '1px solid var(--border-subtle)',
          backgroundColor: 'var(--bg-secondary)',
        }}
      >
        <span className="flex-1 text-[10px] font-semibold tracking-[0.1em] uppercase" style={{ color: 'var(--text-muted)' }}>
          Date
        </span>
        <span className="w-[120px] text-[10px] font-semibold tracking-[0.1em] uppercase" style={{ color: 'var(--text-muted)' }}>
          Amount
        </span>
        <span className="w-[100px] text-[10px] font-semibold tracking-[0.1em] uppercase" style={{ color: 'var(--text-muted)' }}>
          Status
        </span>
        <span className="w-[80px] text-right text-[10px] font-semibold tracking-[0.1em] uppercase" style={{ color: 'var(--text-muted)' }}>
        </span>
      </div>

      {/* Rows */}
      {loading ? (
        <div className="p-5">
          <div className="h-32 animate-pulse" style={{ backgroundColor: 'var(--bg-secondary)' }} />
        </div>
      ) : displayInvoices.length === 0 ? (
        <div className="p-5 text-center">
          <span className="text-sm" style={{ color: 'var(--text-muted)' }}>
            No invoices yet
          </span>
        </div>
      ) : (
        displayInvoices.map((inv, i) => (
          <div
            key={inv.id || i}
            className="flex items-center px-5 py-3.5"
            style={{ borderBottom: '1px solid var(--border-subtle)' }}
          >
            <div className="flex-1">
              <div className="text-[13px]" style={{ color: 'var(--text-secondary)' }}>
                {formatDate(inv.created_at)}
              </div>
              <div className="text-[11px] mt-0.5" style={{ color: 'var(--text-muted)' }}>
                {(inv as { plan?: string }).plan || 'Subscription'}
              </div>
            </div>
            <span
              className="w-[120px] text-[14px] font-medium font-display"
              style={{ color: 'var(--text-primary)' }}
            >
              {formatCurrency(inv.amount_cents, inv.currency)}
            </span>
            <span className="w-[100px]">
              <span
                className="text-[10px] font-semibold tracking-[0.08em] uppercase px-2 py-0.5"
                style={{
                  color: inv.status === 'paid' ? '#6FAD76' : inv.status === 'open' ? '#E8A838' : '#D4645D',
                  backgroundColor: inv.status === 'paid' ? 'rgba(111,173,118,0.1)' : inv.status === 'open' ? 'rgba(232,168,56,0.1)' : 'rgba(212,100,93,0.1)',
                }}
              >
                {inv.status === 'paid' ? 'Paid' : inv.status === 'open' ? 'Open' : inv.status}
              </span>
            </span>
            <span className="w-[80px] text-right">
              {inv.pdf_url ? (
                <a
                  href={inv.pdf_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] cursor-pointer"
                  style={{ color: 'var(--accent)' }}
                >
                  PDF
                </a>
              ) : (
                <span className="text-[11px]" style={{ color: 'var(--accent)', opacity: 0.5 }}>
                  PDF
                </span>
              )}
            </span>
          </div>
        ))
      )}
    </Card>
  )
}
