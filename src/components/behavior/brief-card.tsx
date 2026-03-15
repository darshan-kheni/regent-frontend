'use client'

import { useState } from 'react'
import { Trash2 } from 'lucide-react'
import { Card, Badge, Modal, Button } from '@/components/ui'
import { formatDate } from '@/lib/utils'
import type { ContextBrief } from '@/types/ai-memory'

interface BriefCardProps {
  brief: ContextBrief
  onDelete: (id: string) => void
}

function getExpiryStatus(expiresAt: string | null): { label: string; color: string } | null {
  if (!expiresAt) return null

  const now = new Date()
  const expiry = new Date(expiresAt)
  const diffMs = expiry.getTime() - now.getTime()
  const diffDays = diffMs / (1000 * 60 * 60 * 24)

  if (diffMs < 0) {
    return { label: 'Expired', color: 'var(--color-critical)' }
  }
  if (diffDays <= 7) {
    return { label: 'Expiring soon', color: '#c9a96e' }
  }
  return null
}

function BriefCard({ brief, onDelete }: BriefCardProps) {
  const [confirmOpen, setConfirmOpen] = useState(false)

  const expiryStatus = getExpiryStatus(brief.expires_at)

  return (
    <>
      <Card padding="md">
        <div className="space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2 flex-wrap">
              <h3
                className="text-sm font-semibold"
                style={{ color: 'var(--text-primary)' }}
              >
                {brief.title}
              </h3>
              <Badge variant="info">{brief.scope}</Badge>
            </div>
            <button
              type="button"
              onClick={() => setConfirmOpen(true)}
              className="flex-shrink-0 p-1.5 transition-opacity hover:opacity-70 focus:outline-none"
              style={{ color: 'var(--text-muted)' }}
              aria-label="Delete brief"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>

          <p
            className="text-sm leading-relaxed"
            style={{ color: 'var(--text-secondary)' }}
          >
            {brief.context}
          </p>

          {brief.keywords.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {brief.keywords.map((keyword) => (
                <Badge key={keyword} variant="gold">
                  {keyword}
                </Badge>
              ))}
            </div>
          )}

          <div className="flex items-center gap-3">
            {brief.expires_at && (
              <span
                className="text-xs"
                style={{ color: 'var(--text-muted)' }}
              >
                Expires: {formatDate(brief.expires_at)}
              </span>
            )}
            {expiryStatus && (
              <span
                className="text-xs font-medium"
                style={{ color: expiryStatus.color }}
              >
                {expiryStatus.label}
              </span>
            )}
          </div>
        </div>
      </Card>

      <Modal
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        title="Delete Context Brief"
        footer={
          <>
            <Button variant="secondary" onClick={() => setConfirmOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                onDelete(brief.id)
                setConfirmOpen(false)
              }}
            >
              Delete
            </Button>
          </>
        }
      >
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          Delete this context brief? This cannot be undone.
        </p>
      </Modal>
    </>
  )
}

export { BriefCard }
