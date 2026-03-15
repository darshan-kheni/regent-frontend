'use client'

import { PlanCard } from '@/components/billing/plan-card'
import { PromoCode } from '@/components/billing/promo-code'
import { PaymentMethod } from '@/components/billing/payment-method'
import { InvoiceHistory } from '@/components/billing/invoice-history'
import { UsageSection } from '@/components/billing/usage-section'
import { CreditCard, Receipt, BarChart3 } from 'lucide-react'

function SectionHeader({ title, icon }: { title: string; icon: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2.5 mb-5">
      <span style={{ color: 'var(--accent)' }}>{icon}</span>
      <h2
        className="font-display text-xl font-normal"
        style={{ color: 'var(--text-primary)' }}
      >
        {title}
      </h2>
    </div>
  )
}

export default function BillingPage() {
  return (
    <div className="p-6 lg:px-[52px] lg:py-[44px]" style={{ maxWidth: 1060 }}>
      {/* Billing Section: Subscription + Plans + Promo */}
      <section className="mb-10">
        <SectionHeader title="Billing" icon={<CreditCard size={15} />} />
        <PlanCard />
        <PromoCode />
      </section>

      {/* Payment Method */}
      <section className="mb-10">
        <SectionHeader title="Payment Method" icon={<CreditCard size={15} />} />
        <PaymentMethod />
      </section>

      {/* Invoice History */}
      <section className="mb-10">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2.5">
            <span style={{ color: 'var(--accent)' }}><Receipt size={15} /></span>
            <h2
              className="font-display text-xl font-normal"
              style={{ color: 'var(--text-primary)' }}
            >
              Invoice History
            </h2>
          </div>
          <button
            className="flex items-center gap-1.5 text-[11px] font-medium"
            style={{
              padding: '7px 14px',
              color: 'var(--text-secondary)',
              backgroundColor: 'transparent',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            Export All
          </button>
        </div>
        <InvoiceHistory />
      </section>

      {/* Usage */}
      <section className="mb-10">
        <SectionHeader title="Usage" icon={<BarChart3 size={15} />} />
        <UsageSection />
      </section>

      {/* Footer */}
      <div
        className="flex items-center gap-2.5 px-5 py-3.5"
        style={{
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border-subtle)',
        }}
      >
        <span className="text-[13px]" style={{ color: 'var(--text-muted)' }}>
          Hosted on{' '}
          <span className="font-medium" style={{ color: 'var(--text-secondary)' }}>Vercel</span>
          {' '}&middot; Edge-optimized global delivery &middot; 99.99% uptime SLA
        </span>
      </div>
    </div>
  )
}
