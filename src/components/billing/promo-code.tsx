'use client'

import { useState } from 'react'
import { api } from '@/lib/api'
import { useToast } from '@/providers/toast-provider'
import type { PromoResult } from '@/types/billing'
import { X, Check } from 'lucide-react'

export function PromoCode() {
  const [code, setCode] = useState('')
  const [result, setResult] = useState<PromoResult | null>(null)
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const { addToast } = useToast()

  async function handleApply() {
    if (!code.trim()) return
    setLoading(true)
    setResult(null)
    try {
      const data = await api.post<PromoResult>('/billing/promo', { code: code.trim() })
      setResult(data)
      if (data?.valid) {
        addToast('success', data.type === 'trial'
          ? `${data.trial_days}-day trial activated`
          : `${data.discount_percent}% discount applied`)
      }
      setCode('')
      setOpen(false)
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to apply promo code'
      addToast('error', msg)
      setResult({
        valid: false,
        type: null,
        message: msg,
        discount_percent: null,
        trial_days: null,
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="text-center mt-5">
      {/* Applied promo banner */}
      {result && result.valid && (
        <div
          className="flex items-center justify-center gap-2 px-3.5 py-2.5 mb-2"
          style={{
            backgroundColor: 'rgba(111,173,118,0.1)',
            border: '1px solid rgba(111,173,118,0.2)',
          }}
        >
          <Check size={13} style={{ color: '#6FAD76' }} />
          <span className="text-[13px]" style={{ color: '#6FAD76' }}>
            Promo <span className="font-semibold">{code || 'CODE'}</span> applied:{' '}
            {result.type === 'trial'
              ? `${result.trial_days}-day trial activated`
              : `${result.discount_percent}% off`}
          </span>
          <div
            onClick={() => setResult(null)}
            className="cursor-pointer"
            style={{ color: 'var(--text-muted)' }}
          >
            <X size={12} />
          </div>
        </div>
      )}

      {/* Error banner */}
      {result && !result.valid && (
        <div
          className="flex items-center justify-center gap-2 px-3.5 py-2.5 mb-2"
          style={{
            backgroundColor: 'rgba(212,100,93,0.1)',
            border: '1px solid rgba(212,100,93,0.2)',
          }}
        >
          <X size={13} style={{ color: '#D4645D' }} />
          <span className="text-[13px]" style={{ color: '#D4645D' }}>
            {result.message}
          </span>
          <div
            onClick={() => setResult(null)}
            className="cursor-pointer"
            style={{ color: 'var(--text-muted)' }}
          >
            <X size={12} />
          </div>
        </div>
      )}

      {/* Collapsible promo input */}
      {!open ? (
        <span
          onClick={() => setOpen(true)}
          className="text-[12px] cursor-pointer pb-[1px]"
          style={{
            color: 'var(--text-muted)',
            borderBottom: '1px solid var(--border-subtle)',
          }}
        >
          Have a promo code?
        </span>
      ) : (
        <div className="inline-flex items-center gap-0 mt-1">
          <input
            autoFocus
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            onKeyDown={(e) => e.key === 'Enter' && handleApply()}
            placeholder="ENTER CODE"
            className="outline-none"
            style={{
              width: 180,
              padding: '9px 14px',
              backgroundColor: 'var(--bg-elevated)',
              border: '1px solid var(--border-default)',
              borderRight: 'none',
              color: 'var(--text-secondary)',
              fontSize: 12,
              fontFamily: 'inherit',
              letterSpacing: '0.12em',
              borderRadius: 0,
            }}
          />
          <button
            onClick={handleApply}
            disabled={loading || !code.trim()}
            style={{
              padding: '9px 16px',
              backgroundColor: 'var(--accent)',
              border: '1px solid var(--accent)',
              color: '#0A0A08',
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: '0.1em',
              textTransform: 'uppercase' as const,
              cursor: loading ? 'wait' : 'pointer',
              fontFamily: 'inherit',
              borderRadius: 0,
              opacity: !code.trim() ? 0.5 : 1,
            }}
          >
            {loading ? '...' : 'Apply'}
          </button>
          <span
            onClick={() => {
              setOpen(false)
              setCode('')
            }}
            className="ml-2.5 cursor-pointer"
            style={{ color: 'var(--text-muted)' }}
          >
            <X size={12} />
          </span>
        </div>
      )}
    </div>
  )
}
