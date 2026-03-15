'use client'

import { useState, useEffect } from 'react'
import { Card, Button } from '@/components/ui'
import { api } from '@/lib/api'

interface PaymentMethodData {
  brand: string
  last4: string
  exp_month: number
  exp_year: number
}

export function PaymentMethod() {
  const [method, setMethod] = useState<PaymentMethodData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const data = await api.get<PaymentMethodData>('/billing/payment-method')
        setMethod(data)
      } catch {
        // No payment method on file
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (loading) {
    return (
      <Card padding="md">
        <div className="flex items-center gap-3.5">
          <div className="h-8 w-12 animate-pulse" style={{ backgroundColor: 'var(--bg-secondary)' }} />
          <div className="space-y-1">
            <div className="h-4 w-32 animate-pulse" style={{ backgroundColor: 'var(--bg-secondary)' }} />
            <div className="h-3 w-20 animate-pulse" style={{ backgroundColor: 'var(--bg-secondary)' }} />
          </div>
        </div>
      </Card>
    )
  }

  return (
    <Card padding="md">
      <div className="flex items-center justify-between flex-wrap gap-3.5">
        <div className="flex items-center gap-3.5">
          <div
            className="flex items-center justify-center text-[11px] font-bold tracking-[0.06em]"
            style={{
              width: 48,
              height: 32,
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-muted)',
            }}
          >
            {method ? method.brand.toUpperCase() : '\u2014'}
          </div>
          <div>
            {method ? (
              <>
                <div
                  className="text-[15px] tracking-[0.04em]"
                  style={{ color: 'var(--text-primary)' }}
                >
                  &bull;&bull;&bull;&bull; &bull;&bull;&bull;&bull; &bull;&bull;&bull;&bull; {method.last4}
                </div>
                <div className="text-[12px] mt-0.5" style={{ color: 'var(--text-muted)' }}>
                  Expires {String(method.exp_month).padStart(2, '0')}/{method.exp_year}
                </div>
              </>
            ) : (
              <div className="text-[13px]" style={{ color: 'var(--text-muted)' }}>
                No payment method on file
              </div>
            )}
          </div>
        </div>
        <Button variant="ghost" size="sm">
          {method ? 'Update' : 'Add Card'}
        </Button>
      </div>
    </Card>
  )
}
