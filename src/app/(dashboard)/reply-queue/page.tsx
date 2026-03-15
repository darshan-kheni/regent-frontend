'use client'

import { useState, useCallback } from 'react'
import { useReplies } from '@/hooks/use-replies'
import { Button, Skeleton, Badge } from '@/components/ui'
import { formatRelativeTime, formatEmailName } from '@/lib/utils'
import type { DraftReply } from '@/types/email'

function formatCategoryLabel(id: string): string {
  return id
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
}

const ACCOUNT_COLORS = ['#7EA3C2', '#C9A96E', '#9B7EBD', '#C27E9B', '#6FAD76', '#D4645D']

function getAccountColor(accountId: string): string {
  let hash = 0
  for (let i = 0; i < accountId.length; i++) {
    hash = accountId.charCodeAt(i) + ((hash << 5) - hash)
  }
  return ACCOUNT_COLORS[Math.abs(hash) % ACCOUNT_COLORS.length]
}

function getPriorityLabel(priority: number | undefined): { label: string; variant: 'urgent' | 'gold' | 'info' | 'muted' } | null {
  if (priority === undefined) return null
  if (priority >= 80) return { label: 'Critical', variant: 'urgent' }
  if (priority >= 60) return { label: 'High', variant: 'gold' }
  if (priority >= 40) return { label: 'Normal', variant: 'info' }
  return { label: 'Low', variant: 'muted' }
}

function getCategoryBadge(category: string | undefined) {
  if (!category || category === 'uncategorized') return null
  return { variant: category.toLowerCase(), label: formatCategoryLabel(category) }
}

export default function ReplyQueuePage() {
  const { replies, isLoading, approve, refine, reject } = useReplies()
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [mobileView, setMobileView] = useState<'list' | 'detail'>('list')
  const [editingBody, setEditingBody] = useState<string | null>(null)

  const drafts = replies
  const selectedDraft = drafts.find((d) => d.id === selectedId) ?? null

  const handleSelect = useCallback((id: string) => {
    setSelectedId(id)
    setEditingBody(null)
    setMobileView('detail')
  }, [])

  const handleApprove = useCallback(async () => {
    if (!selectedDraft) return
    await approve(selectedDraft.id)
    setSelectedId(null)
    setMobileView('list')
  }, [selectedDraft, approve])

  const handleRefine = useCallback(async () => {
    if (!selectedDraft || editingBody === null) return
    await refine(selectedDraft.id, editingBody)
    setEditingBody(null)
  }, [selectedDraft, editingBody, refine])

  const handleReject = useCallback(async () => {
    if (!selectedDraft) return
    await reject(selectedDraft.id)
    setSelectedId(null)
    setMobileView('list')
  }, [selectedDraft, reject])

  const handleBackToList = useCallback(() => {
    setMobileView('list')
  }, [])

  if (isLoading) {
    return (
      <div className="flex h-full" style={{ minHeight: 'calc(100vh - 80px)' }}>
        <div className="w-80 flex-shrink-0 p-4 space-y-3" style={{ borderRight: '1px solid var(--border-subtle)' }}>
          <Skeleton height="28px" />
          <Skeleton height="1px" />
          <Skeleton height="72px" />
          <Skeleton height="72px" />
          <Skeleton height="72px" />
          <Skeleton height="72px" />
        </div>
        <div className="flex-1 p-6 space-y-4">
          <Skeleton height="32px" />
          <Skeleton height="120px" />
          <Skeleton height="200px" />
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-full" style={{ minHeight: 'calc(100vh - 80px)' }}>
      {/* ── Sidebar ── */}
      <div
        className={`w-80 flex-shrink-0 flex flex-col overflow-hidden ${
          mobileView === 'detail' ? 'hidden lg:flex' : 'flex'
        } lg:flex`}
        style={{
          borderRight: '1px solid var(--border-subtle)',
          backgroundColor: 'var(--bg-secondary)',
        }}
      >
        {/* Sidebar Header */}
        <div className="px-4 pt-5 pb-3">
          <div className="flex items-baseline justify-between">
            <h1
              className="font-display text-lg tracking-wide"
              style={{ color: 'var(--text-primary)', letterSpacing: '0.08em' }}
            >
              REPLY QUEUE
            </h1>
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
              {drafts.length} pending
            </span>
          </div>
          <div className="mt-3" style={{ height: '1px', backgroundColor: 'var(--border-subtle)' }} />
        </div>

        {/* Email List */}
        <div className="flex-1 overflow-y-auto">
          {drafts.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full px-4">
              <svg
                className="h-10 w-10 mb-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1}
                style={{ color: 'var(--text-muted)' }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              <p className="text-xs text-center" style={{ color: 'var(--text-muted)' }}>
                No pending drafts. AI will generate replies as emails arrive.
              </p>
            </div>
          ) : (
            drafts.map((draft) => {
              const isSelected = draft.id === selectedId
              const email = draft.email
              const senderName = formatEmailName(email?.from_name, email?.from_address || 'Unknown Sender')
              const subject = email?.subject || 'No Subject'
              const accountColor = getAccountColor(email?.account_id ?? draft.email_id)
              const catBadge = getCategoryBadge(email?.category)
              const priBadge = getPriorityLabel(email?.priority)

              return (
                <button
                  key={draft.id}
                  type="button"
                  className="w-full text-left px-4 py-3 transition-colors"
                  onClick={() => handleSelect(draft.id)}
                  style={{
                    backgroundColor: isSelected ? 'rgba(201,169,110,0.10)' : 'transparent',
                    borderLeft: isSelected ? '3px solid var(--accent)' : '3px solid transparent',
                    borderBottom: '1px solid var(--border-subtle)',
                  }}
                >
                  {/* Row 1: Account dot + Sender + Timestamp */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <span
                        className="flex-shrink-0"
                        style={{
                          width: 8,
                          height: 8,
                          borderRadius: '9999px',
                          backgroundColor: accountColor,
                        }}
                      />
                      <span
                        className="text-sm font-medium truncate"
                        style={{ color: 'var(--text-primary)' }}
                      >
                        {senderName}
                      </span>
                    </div>
                    <span
                      className="text-xs flex-shrink-0"
                      style={{ color: 'var(--text-muted)' }}
                    >
                      {formatRelativeTime(draft.created_at)}
                    </span>
                  </div>

                  {/* Row 2: Subject */}
                  <p
                    className="text-xs mt-1 truncate"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    {subject}
                  </p>

                  {/* Row 3: Category + Priority */}
                  <div className="flex items-center gap-1.5 mt-1.5">
                    {catBadge && (
                      <Badge variant={catBadge.variant} className="text-[10px] px-1.5 py-0">
                        {catBadge.label}
                      </Badge>
                    )}
                    {priBadge && (
                      <Badge variant={priBadge.variant} className="text-[10px] px-1.5 py-0">
                        {priBadge.label}
                      </Badge>
                    )}
                  </div>
                </button>
              )
            })
          )}
        </div>
      </div>

      {/* ── Detail View ── */}
      <div
        className={`flex-1 overflow-y-auto ${
          mobileView === 'list' ? 'hidden lg:block' : 'block'
        } lg:block`}
        style={{ backgroundColor: 'var(--bg-primary)' }}
      >
        {!selectedDraft ? (
          /* Empty State */
          <div
            className="flex flex-col items-center justify-center h-full"
            style={{ color: 'var(--text-muted)' }}
          >
            <svg
              className="h-12 w-12 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
              />
            </svg>
            <p className="text-sm">Select a draft to review</p>
          </div>
        ) : (
          /* Detail Content */
          <div className="p-6 max-w-3xl">
            {/* Mobile Back Button */}
            <button
              type="button"
              className="lg:hidden flex items-center gap-1 mb-4 text-sm"
              onClick={handleBackToList}
              style={{ color: 'var(--accent)' }}
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              Back to queue
            </button>

            {/* Meta: Category, Priority, Account Dot */}
            <div className="flex items-center gap-2 mb-4">
              {(() => {
                const catBadge = getCategoryBadge(selectedDraft.email?.category)
                return catBadge ? (
                  <Badge variant={catBadge.variant}>{catBadge.label}</Badge>
                ) : null
              })()}
              {(() => {
                const priBadge = getPriorityLabel(selectedDraft.email?.priority)
                return priBadge ? (
                  <Badge variant={priBadge.variant}>{priBadge.label}</Badge>
                ) : null
              })()}
              <span
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: '9999px',
                  backgroundColor: getAccountColor(selectedDraft.email?.account_id ?? selectedDraft.email_id),
                }}
              />
            </div>

            {/* Subject */}
            <h2
              className="font-display mb-1"
              style={{
                fontSize: '28px',
                lineHeight: 1.2,
                color: 'var(--text-primary)',
              }}
            >
              {selectedDraft.email?.subject || 'No Subject'}
            </h2>

            {/* Sender */}
            <div className="mb-5">
              <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                {formatEmailName(selectedDraft.email?.from_name, selectedDraft.email?.from_address || 'Unknown Sender')}
              </span>
              {selectedDraft.email?.from_address && (
                <span className="text-sm ml-2" style={{ color: 'var(--text-muted)' }}>
                  &lt;{selectedDraft.email.from_address}&gt;
                </span>
              )}
            </div>

            {/* Original Email Snippet */}
            {selectedDraft.email?.body_text && (
              <div
                className="p-4 mb-6 text-sm"
                style={{
                  backgroundColor: 'var(--bg-secondary)',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--text-secondary)',
                  whiteSpace: 'pre-wrap',
                }}
              >
                {selectedDraft.email.body_text.length > 500
                  ? selectedDraft.email.body_text.slice(0, 500) + '...'
                  : selectedDraft.email.body_text}
              </div>
            )}

            {/* Suggested Reply Card */}
            <div
              className="p-5"
              style={{
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border-subtle)',
              }}
            >
              {/* Reply Card Header */}
              <div className="flex items-center gap-2 mb-4">
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                  style={{ color: 'var(--accent)' }}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
                  />
                </svg>
                <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                  {selectedDraft.is_premium ? 'Premium Draft' : 'AI Draft'}
                </span>
                {selectedDraft.confidence > 0 && (
                  <Badge variant={selectedDraft.confidence >= 0.85 ? 'success' : 'gold'}>
                    {selectedDraft.confidence >= 0.85 ? 'High confidence' : 'Review suggested'}
                  </Badge>
                )}
                <span className="text-xs font-mono ml-auto" style={{ color: 'var(--text-muted)' }}>
                  {selectedDraft.model_used}
                </span>
              </div>

              {/* Reply Body */}
              {editingBody !== null ? (
                <textarea
                  className="w-full text-sm p-3 mb-4"
                  style={{
                    backgroundColor: 'var(--bg-secondary)',
                    border: '1px solid var(--border-subtle)',
                    color: 'var(--text-primary)',
                    borderRadius: 0,
                    minHeight: 160,
                    resize: 'vertical',
                    fontFamily: 'inherit',
                  }}
                  value={editingBody}
                  onChange={(e) => setEditingBody(e.target.value)}
                />
              ) : (
                <p
                  className="text-sm mb-5"
                  style={{
                    color: 'var(--text-secondary)',
                    fontStyle: 'italic',
                    whiteSpace: 'pre-wrap',
                    lineHeight: 1.7,
                  }}
                >
                  {selectedDraft.body}
                </p>
              )}

              {/* Action Buttons */}
              <div
                className="flex items-center gap-3 pt-4"
                style={{ borderTop: '1px solid var(--border-subtle)' }}
              >
                <Button variant="primary" size="sm" onClick={handleApprove}>
                  Approve &amp; Send
                </Button>
                {editingBody !== null ? (
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={handleRefine}
                    disabled={editingBody === selectedDraft.body}
                    style={{
                      borderColor: 'var(--accent)',
                      color: 'var(--accent)',
                    }}
                  >
                    Save Refinement
                  </Button>
                ) : (
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setEditingBody(selectedDraft.body)}
                    style={{
                      borderColor: 'var(--accent)',
                      color: 'var(--accent)',
                    }}
                  >
                    Refine
                  </Button>
                )}
                <Button variant="ghost" size="sm" onClick={handleReject}>
                  Dismiss
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
