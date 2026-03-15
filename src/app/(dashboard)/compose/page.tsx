'use client'

import { PenLine } from 'lucide-react'
import { Card } from '@/components/ui'
import { ComposeForm } from '@/components/compose/compose-form'

export default function ComposePage() {
  return (
    <div className="p-6 lg:px-[52px] lg:py-[44px]">
      <div className="mx-auto" style={{ maxWidth: '720px' }}>
        <div className="mb-6">
          <h1
            className="font-display text-[30px] flex items-center gap-3"
            style={{ color: 'var(--text-primary)' }}
          >
            <PenLine className="h-7 w-7" style={{ color: 'var(--accent)' }} />
            Compose
          </h1>
          <p
            className="text-sm mt-1"
            style={{ color: 'var(--text-secondary)' }}
          >
            Draft a new email with or without AI assistance
          </p>
        </div>

        <Card padding="lg">
          <ComposeForm />
        </Card>
      </div>
    </div>
  )
}
