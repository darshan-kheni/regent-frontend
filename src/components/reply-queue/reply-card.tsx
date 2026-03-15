'use client'

import { useState, useCallback } from 'react'
import { Card, Button, Badge } from '@/components/ui'
import { ReplyEditor } from '@/components/reply-queue/reply-editor'
import { formatRelativeTime, formatEmailName } from '@/lib/utils'
import type { DraftReply, Email } from '@/types/email'

type BadgeVariant = 'success' | 'gold' | 'urgent'

interface ReplyCardProps {
  draft: DraftReply & { email?: Email }
  onApprove: (id: string) => void
  onRefine: (id: string, body: string) => void
  onReject: (id: string) => void
}

function getConfidenceBadge(confidence: number): { variant: BadgeVariant; label: string; color: string } {
  if (confidence > 0.9) {
    return { variant: 'success', label: 'High Confidence', color: '#6FAD76' }
  }
  if (confidence > 0.7) {
    return { variant: 'gold', label: 'Medium Confidence', color: '#C9A96E' }
  }
  return { variant: 'urgent', label: 'Low Confidence', color: '#D4645D' }
}

export function ReplyCard({ draft, onApprove, onRefine, onReject }: ReplyCardProps) {
  const [expanded, setExpanded] = useState(false)
  const [editedBody, setEditedBody] = useState(draft.body)
  const confidenceBadge = getConfidenceBadge(draft.confidence)

  const handleApprove = useCallback(() => {
    onApprove(draft.id)
  }, [draft.id, onApprove])

  const handleRefine = useCallback(() => {
    onRefine(draft.id, editedBody)
  }, [draft.id, editedBody, onRefine])

  const handleReject = useCallback(() => {
    onReject(draft.id)
  }, [draft.id, onReject])

  const hasEdits = editedBody !== draft.body

  return (
    <Card padding="lg" className="space-y-4">
      {/* Original Email Context */}
      {draft.email && (
        <Card padding="sm" className="cursor-pointer" hover>
          <button
            type="button"
            className="w-full text-left"
            onClick={() => setExpanded(!expanded)}
          >
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium truncate" style={{ color: 'var(--text-primary)' }}>
                  {formatEmailName(draft.email.from_name, draft.email.from_address)}
                </p>
                <p className="text-sm truncate" style={{ color: 'var(--text-secondary)' }}>
                  {draft.email.subject}
                </p>
              </div>
              <svg
                className="ml-2 h-4 w-4 flex-shrink-0 transition-transform"
                style={{
                  color: 'var(--text-muted)',
                  transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
                }}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </button>
          {expanded && (
            <div className="mt-3 pt-3" style={{ borderTop: '1px solid var(--border-subtle)' }}>
              <p className="text-sm whitespace-pre-wrap" style={{ color: 'var(--text-secondary)' }}>
                {draft.email.body_text.length > 500
                  ? draft.email.body_text.slice(0, 500) + '...'
                  : draft.email.body_text}
              </p>
            </div>
          )}
        </Card>
      )}

      {/* Draft Reply Editor */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Badge variant={confidenceBadge.variant}>
            {Math.round(draft.confidence * 100)}%
          </Badge>
          <span className="font-mono text-xs" style={{ color: 'var(--text-muted)' }}>
            {draft.model_used}
          </span>
          {draft.is_premium && (
            <Badge variant="gold">Premium</Badge>
          )}
          <span className="text-xs ml-auto" style={{ color: 'var(--text-muted)' }}>
            {formatRelativeTime(draft.created_at)}
          </span>
        </div>
        <ReplyEditor body={editedBody} onChange={setEditedBody} />
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-3">
        <Button variant="primary" size="sm" onClick={handleApprove}>
          Approve
        </Button>
        <Button variant="secondary" size="sm" onClick={handleRefine} disabled={!hasEdits}>
          Refine
        </Button>
        <Button variant="danger" size="sm" onClick={handleReject}>
          Reject
        </Button>
      </div>
    </Card>
  )
}
