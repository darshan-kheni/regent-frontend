'use client'

import { useState } from 'react'
import { Trash2 } from 'lucide-react'
import { Badge, Toggle, Tooltip, Modal, Button } from '@/components/ui'
import type { UserRule } from '@/types/ai-memory'
import type { BadgeVariant } from '@/components/ui'

interface RuleRowProps {
  rule: UserRule
  onToggle: (id: string) => void
  onDelete: (id: string) => void
}

const scopeVariant: Record<string, BadgeVariant> = {
  email: 'info',
  calendar: 'gold',
  tasks: 'muted',
  all: 'success',
}

const typeVariant: Record<string, BadgeVariant> = {
  routing: 'info',
  response: 'gold',
  priority: 'urgent',
  behavior: 'muted',
}

function RuleRow({ rule, onToggle, onDelete }: RuleRowProps) {
  const [confirmOpen, setConfirmOpen] = useState(false)

  const text = rule.instruction || (rule as unknown as { text?: string }).text || ''
  const truncated = text.length > 100
  const displayText = truncated
    ? text.slice(0, 100) + '...'
    : text

  return (
    <>
      <div
        className="flex items-start gap-3 px-4 py-3"
        style={{
          borderBottom: '1px solid var(--border-subtle)',
          opacity: rule.active ? 1 : 0.6,
        }}
      >
        <div className="flex-shrink-0 pt-0.5">
          <Toggle
            checked={rule.active}
            onChange={() => onToggle(rule.id)}
          />
        </div>

        <div className="flex-1 min-w-0 space-y-1.5">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant={scopeVariant[rule.scope] || 'muted'}>
              {rule.scope}
            </Badge>
            <Badge variant={typeVariant[rule.type] || 'muted'}>
              {rule.type}
            </Badge>
            {rule.contact_filter && (
              <span
                className="text-xs font-mono"
                style={{ color: 'var(--text-muted)' }}
              >
                {rule.contact_filter}
              </span>
            )}
          </div>

          {truncated ? (
            <Tooltip content={text}>
              <p
                className="text-sm leading-relaxed"
                style={{ color: 'var(--text-primary)' }}
              >
                {displayText}
              </p>
            </Tooltip>
          ) : (
            <p
              className="text-sm leading-relaxed"
              style={{ color: 'var(--text-primary)' }}
            >
              {displayText}
            </p>
          )}
        </div>

        <button
          type="button"
          onClick={() => setConfirmOpen(true)}
          className="flex-shrink-0 p-1.5 transition-opacity hover:opacity-70 focus:outline-none"
          style={{ color: 'var(--text-muted)' }}
          aria-label="Delete rule"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      <Modal
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        title="Delete Rule"
        footer={
          <>
            <Button variant="secondary" onClick={() => setConfirmOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                onDelete(rule.id)
                setConfirmOpen(false)
              }}
            >
              Delete
            </Button>
          </>
        }
      >
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          Delete this rule? This cannot be undone.
        </p>
      </Modal>
    </>
  )
}

export { RuleRow }
