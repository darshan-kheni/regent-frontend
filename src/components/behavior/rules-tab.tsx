'use client'

import { useState } from 'react'
import { Button, Card, Input, Select, ProgressBar } from '@/components/ui'
import { RuleRow } from '@/components/behavior/rule-row'
import type { UserRule } from '@/types/ai-memory'

interface PlanLimit {
  used: number
  max: number
  briefsUsed: number
  briefsMax: number
  patternsMax: number
}

interface RulesTabProps {
  rules: UserRule[]
  onAdd: (payload: {
    scope: UserRule['scope']
    type: string
    instruction: string
    contact_filter: string | null
  }) => Promise<void>
  onToggle: (id: string) => Promise<void>
  onDelete: (id: string) => Promise<void>
  planLimit: PlanLimit
}

const scopeOptions = [
  { value: 'email', label: 'Email' },
  { value: 'calendar', label: 'Calendar' },
  { value: 'tasks', label: 'Tasks' },
  { value: 'all', label: 'All' },
]

const typeOptions = [
  { value: 'routing', label: 'Routing' },
  { value: 'response', label: 'Response' },
  { value: 'priority', label: 'Priority' },
  { value: 'behavior', label: 'Behavior' },
]

function RulesTab({ rules, onAdd, onToggle, onDelete, planLimit }: RulesTabProps) {
  const [scope, setScope] = useState<UserRule['scope']>('email')
  const [type, setType] = useState('routing')
  const [contactFilter, setContactFilter] = useState('')
  const [instruction, setInstruction] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const isUnlimited = planLimit.max >= 999
  const atLimit = !isUnlimited && planLimit.used >= planLimit.max
  const progressPercent = isUnlimited ? 0 : (planLimit.max > 0 ? (planLimit.used / planLimit.max) * 100 : 0)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!instruction.trim() || atLimit) return

    setIsSubmitting(true)
    try {
      await onAdd({
        scope,
        type,
        instruction: instruction.trim(),
        contact_filter: contactFilter.trim() || null,
      })
      setInstruction('')
      setContactFilter('')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Add form */}
      <Card padding="lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Scope"
              options={scopeOptions}
              value={scope}
              onChange={(v) => setScope(v as UserRule['scope'])}
            />
            <Select
              label="Type"
              options={typeOptions}
              value={type}
              onChange={setType}
            />
          </div>

          <Input
            label="Contact Filter (optional)"
            value={contactFilter}
            onChange={(e) => setContactFilter(e.target.value)}
            placeholder="e.g. john@example.com or *@company.com"
          />

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="rule-instruction"
              className="text-sm font-medium"
              style={{ color: 'var(--text-secondary)' }}
            >
              Instruction
            </label>
            <textarea
              id="rule-instruction"
              value={instruction}
              onChange={(e) => {
                if (e.target.value.length <= 500) {
                  setInstruction(e.target.value)
                }
              }}
              placeholder="e.g. Always prioritize emails from the board of directors"
              rows={3}
              className="w-full px-3 py-2 text-sm transition-colors focus:outline-none resize-none"
              style={{
                borderRadius: 0,
                backgroundColor: 'var(--bg-elevated)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border-default)',
              }}
            />
            <div className="flex justify-end">
              <span
                className="text-xs tabular-nums"
                style={{
                  color: instruction.length >= 450
                    ? 'var(--color-critical)'
                    : 'var(--text-muted)',
                }}
              >
                {instruction.length} / 500
              </span>
            </div>
          </div>

          <Button
            type="submit"
            disabled={!instruction.trim() || atLimit || isSubmitting}
            loading={isSubmitting}
          >
            Add Rule
          </Button>
        </form>
      </Card>

      {/* Plan limit indicator */}
      <div className="space-y-2">
        {isUnlimited ? (
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            {planLimit.used} rules created (unlimited)
          </p>
        ) : (
          <ProgressBar
            value={progressPercent}
            label={`${planLimit.used} / ${planLimit.max} rules used`}
          />
        )}

        {atLimit && (
          <Card padding="sm">
            <div
              className="flex items-center gap-3 text-sm"
              style={{
                color: '#c9a96e',
              }}
            >
              <span className="flex-1">
                You have reached your plan limit. Upgrade for more rules.
              </span>
              <a
                href="/billing"
                className="font-medium underline whitespace-nowrap"
                style={{ color: 'var(--accent)' }}
              >
                Upgrade
              </a>
            </div>
          </Card>
        )}
      </div>

      {/* Rules list */}
      {rules.length > 0 && (
        <Card padding="sm">
          <div className="divide-y" style={{ borderColor: 'var(--border-subtle)' }}>
            {rules.map((rule) => (
              <RuleRow
                key={rule.id}
                rule={rule}
                onToggle={onToggle}
                onDelete={onDelete}
              />
            ))}
          </div>
        </Card>
      )}
    </div>
  )
}

export { RulesTab }
