'use client'

import { useState, useEffect, useCallback } from 'react'
import { Card, Button, Badge, Tabs, Toggle } from '@/components/ui'
import { api } from '@/lib/api'
import { useToast } from '@/providers/toast-provider'

// ── Types ──────────────────────────────────────────────────────

interface UserRule {
  id: string
  scope: 'email' | 'calendar' | 'tasks' | 'all'
  type: 'tone' | 'auto_action' | 'priority' | 'reply_template' | 'context'
  rule_text: string
  contact_filter: string | null
  is_active: boolean
  created_at: string
}

interface ContextBrief {
  id: string
  title: string
  scope: string
  brief_text: string
  keywords: string[]
  expires_at: string | null
  created_at: string
}

// ── Constants ──────────────────────────────────────────────────

const SCOPE_OPTIONS = [
  { value: 'email', label: 'Email' },
  { value: 'calendar', label: 'Calendar' },
  { value: 'tasks', label: 'Tasks' },
  { value: 'all', label: 'All' },
]

const TYPE_OPTIONS = [
  { value: 'tone', label: 'Tone' },
  { value: 'auto_action', label: 'Auto-Action' },
  { value: 'priority', label: 'Priority' },
  { value: 'reply_template', label: 'Reply Template' },
  { value: 'context', label: 'Context' },
]

const scopeBadgeVariant: Record<string, 'gold' | 'success' | 'muted'> = {
  email: 'gold',
  calendar: 'success',
  tasks: 'muted',
  all: 'gold',
}

const typeBadgeVariant: Record<string, 'gold' | 'success' | 'muted' | 'urgent'> = {
  tone: 'gold',
  auto_action: 'success',
  priority: 'urgent',
  reply_template: 'muted',
  context: 'gold',
}

// ── Rules Tab ──────────────────────────────────────────────────

function RulesTab() {
  const [rules, setRules] = useState<UserRule[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const { addToast } = useToast()

  // Form state
  const [formScope, setFormScope] = useState<UserRule['scope']>('email')
  const [formType, setFormType] = useState<UserRule['type']>('tone')
  const [formText, setFormText] = useState('')
  const [formContactFilter, setFormContactFilter] = useState('')

  const fetchRules = useCallback(async () => {
    try {
      const data = await api.get<UserRule[]>('/user-rules')
      setRules(data)
    } catch {
      // Stub returns empty array
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchRules()
  }, [fetchRules])

  function resetForm() {
    setFormScope('email')
    setFormType('tone')
    setFormText('')
    setFormContactFilter('')
  }

  async function handleAddRule(e: React.FormEvent) {
    e.preventDefault()
    if (!formText.trim()) return

    setSubmitting(true)
    try {
      const result = await api.post<UserRule>('/user-rules', {
        scope: formScope,
        type: formType,
        rule_text: formText,
        contact_filter: formContactFilter || null,
        is_active: true,
      })
      setRules((prev) => [result, ...prev])
      addToast('success', 'Rule added')
      resetForm()
      setShowAddForm(false)
    } catch (err) {
      addToast('error', err instanceof Error ? err.message : 'Failed to add rule')
    } finally {
      setSubmitting(false)
    }
  }

  async function handleToggleRule(rule: UserRule) {
    try {
      await api.put(`/user-rules/${rule.id}`, { is_active: !rule.is_active })
      setRules((prev) =>
        prev.map((r) => (r.id === rule.id ? { ...r, is_active: !r.is_active } : r))
      )
    } catch (err) {
      addToast('error', err instanceof Error ? err.message : 'Failed to update rule')
    }
  }

  async function handleDeleteRule(id: string) {
    setDeletingId(id)
    try {
      await api.delete(`/user-rules/${id}`)
      setRules((prev) => prev.filter((r) => r.id !== id))
      addToast('success', 'Rule deleted')
    } catch (err) {
      addToast('error', err instanceof Error ? err.message : 'Failed to delete rule')
    } finally {
      setDeletingId(null)
    }
  }

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2].map((i) => (
          <div
            key={i}
            className="h-16 animate-pulse"
            style={{ backgroundColor: 'var(--bg-secondary)' }}
          />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {rules.length === 0 && !showAddForm ? (
        <div
          className="py-10 text-center"
          style={{
            backgroundColor: 'var(--bg-elevated)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 0,
          }}
        >
          <p className="text-sm mb-1" style={{ color: 'var(--text-muted)' }}>
            No rules yet
          </p>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
            Add rules to customize how Regent processes your emails, calendars, and tasks.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {rules.map((rule) => (
            <div
              key={rule.id}
              className="flex items-start justify-between gap-3 p-3"
              style={{
                backgroundColor: 'var(--bg-elevated)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 0,
                opacity: rule.is_active ? 1 : 0.6,
              }}
            >
              <div className="flex-1 min-w-0 space-y-1.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant={scopeBadgeVariant[rule.scope] || 'muted'}>
                    {rule.scope}
                  </Badge>
                  <Badge variant={typeBadgeVariant[rule.type] || 'muted'}>
                    {rule.type.replace('_', ' ')}
                  </Badge>
                  {rule.contact_filter && (
                    <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                      Contact: {rule.contact_filter}
                    </span>
                  )}
                </div>
                <p className="text-sm" style={{ color: 'var(--text-primary)' }}>
                  {rule.rule_text}
                </p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <Toggle
                  checked={rule.is_active}
                  onChange={() => handleToggleRule(rule)}
                />
                <button
                  type="button"
                  onClick={() => handleDeleteRule(rule.id)}
                  disabled={deletingId === rule.id}
                  className="text-xs font-medium transition-colors"
                  style={{ color: 'var(--text-muted)' }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--status-urgent)')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
                >
                  {deletingId === rule.id ? '...' : 'Delete'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Rule Form */}
      {showAddForm && (
        <form
          onSubmit={handleAddRule}
          className="p-4 space-y-4"
          style={{
            backgroundColor: 'var(--bg-elevated)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 0,
          }}
        >
          <h3
            className="font-display text-base"
            style={{ color: 'var(--text-primary)' }}
          >
            Add New Rule
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm mb-1" style={{ color: 'var(--text-secondary)' }}>
                Scope
              </label>
              <select
                value={formScope}
                onChange={(e) => setFormScope(e.target.value as UserRule['scope'])}
                className="w-full px-3 py-2 text-sm focus:outline-none"
                style={{
                  backgroundColor: 'var(--bg-primary)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 0,
                  color: 'var(--text-primary)',
                }}
              >
                {SCOPE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm mb-1" style={{ color: 'var(--text-secondary)' }}>
                Type
              </label>
              <select
                value={formType}
                onChange={(e) => setFormType(e.target.value as UserRule['type'])}
                className="w-full px-3 py-2 text-sm focus:outline-none"
                style={{
                  backgroundColor: 'var(--bg-primary)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 0,
                  color: 'var(--text-primary)',
                }}
              >
                {TYPE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm mb-1" style={{ color: 'var(--text-secondary)' }}>
              Rule Text
            </label>
            <textarea
              value={formText}
              onChange={(e) => setFormText(e.target.value)}
              placeholder="e.g., Always reply in a formal tone to clients from Acme Corp"
              required
              rows={3}
              className="w-full px-3 py-2 text-sm resize-none focus:outline-none"
              style={{
                backgroundColor: 'var(--bg-primary)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 0,
                color: 'var(--text-primary)',
              }}
            />
          </div>

          <div>
            <label className="block text-sm mb-1" style={{ color: 'var(--text-secondary)' }}>
              Contact Filter (optional)
            </label>
            <input
              type="text"
              value={formContactFilter}
              onChange={(e) => setFormContactFilter(e.target.value)}
              placeholder="e.g., @acme.com or john@example.com"
              className="w-full px-3 py-2 text-sm focus:outline-none"
              style={{
                backgroundColor: 'var(--bg-primary)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 0,
                color: 'var(--text-primary)',
              }}
            />
          </div>

          <div className="flex gap-3">
            <Button type="submit" variant="primary" loading={submitting}>
              Add Rule
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setShowAddForm(false)
                resetForm()
              }}
            >
              Cancel
            </Button>
          </div>
        </form>
      )}

      <Button
        variant="primary"
        onClick={() => setShowAddForm(!showAddForm)}
      >
        {showAddForm ? 'Close Form' : 'Add New Rule'}
      </Button>
    </div>
  )
}

// ── Context Briefs Tab ─────────────────────────────────────────

function ContextBriefsTab() {
  const [briefs, setBriefs] = useState<ContextBrief[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const { addToast } = useToast()

  // Form state
  const [formTitle, setFormTitle] = useState('')
  const [formScope, setFormScope] = useState('email')
  const [formText, setFormText] = useState('')
  const [formKeywords, setFormKeywords] = useState('')
  const [formExpiration, setFormExpiration] = useState('')

  const fetchBriefs = useCallback(async () => {
    try {
      const data = await api.get<ContextBrief[]>('/context-briefs')
      setBriefs(data)
    } catch {
      // Stub returns empty array
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchBriefs()
  }, [fetchBriefs])

  function resetForm() {
    setFormTitle('')
    setFormScope('email')
    setFormText('')
    setFormKeywords('')
    setFormExpiration('')
  }

  async function handleAddBrief(e: React.FormEvent) {
    e.preventDefault()
    if (!formTitle.trim() || !formText.trim()) return

    setSubmitting(true)
    try {
      const keywords = formKeywords
        .split(',')
        .map((k) => k.trim())
        .filter(Boolean)

      const result = await api.post<ContextBrief>('/context-briefs', {
        title: formTitle,
        scope: formScope,
        brief_text: formText,
        keywords,
        expires_at: formExpiration || null,
      })
      setBriefs((prev) => [result, ...prev])
      addToast('success', 'Context brief added')
      resetForm()
      setShowAddForm(false)
    } catch (err) {
      addToast('error', err instanceof Error ? err.message : 'Failed to add brief')
    } finally {
      setSubmitting(false)
    }
  }

  async function handleDeleteBrief(id: string) {
    setDeletingId(id)
    try {
      await api.delete(`/context-briefs/${id}`)
      setBriefs((prev) => prev.filter((b) => b.id !== id))
      addToast('success', 'Brief deleted')
    } catch (err) {
      addToast('error', err instanceof Error ? err.message : 'Failed to delete brief')
    } finally {
      setDeletingId(null)
    }
  }

  function formatExpiration(dateStr: string | null): string {
    if (!dateStr) return 'No expiration'
    const date = new Date(dateStr)
    const now = new Date()
    if (date < now) return 'Expired'
    return `Expires ${date.toLocaleDateString()}`
  }

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2].map((i) => (
          <div
            key={i}
            className="h-20 animate-pulse"
            style={{ backgroundColor: 'var(--bg-secondary)' }}
          />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {briefs.length === 0 && !showAddForm ? (
        <div
          className="py-10 text-center"
          style={{
            backgroundColor: 'var(--bg-elevated)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 0,
          }}
        >
          <p className="text-sm mb-1" style={{ color: 'var(--text-muted)' }}>
            No context briefs yet
          </p>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
            Add situational context that Regent will consider when processing your communications.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {briefs.map((brief) => (
            <div
              key={brief.id}
              className="p-3 space-y-2"
              style={{
                backgroundColor: 'var(--bg-elevated)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 0,
              }}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <h4 className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                      {brief.title}
                    </h4>
                    <Badge variant="gold">{brief.scope}</Badge>
                    <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                      {formatExpiration(brief.expires_at)}
                    </span>
                  </div>
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                    {brief.brief_text}
                  </p>
                  {brief.keywords && brief.keywords.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {brief.keywords.map((kw) => (
                        <span
                          key={kw}
                          className="text-xs px-2 py-0.5"
                          style={{
                            backgroundColor: 'var(--bg-secondary)',
                            color: 'var(--text-muted)',
                            borderRadius: 0,
                          }}
                        >
                          {kw}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleDeleteBrief(brief.id)}
                    disabled={deletingId === brief.id}
                    className="text-xs font-medium transition-colors"
                    style={{ color: 'var(--text-muted)' }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--status-urgent)')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
                  >
                    {deletingId === brief.id ? '...' : 'Delete'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Brief Form */}
      {showAddForm && (
        <form
          onSubmit={handleAddBrief}
          className="p-4 space-y-4"
          style={{
            backgroundColor: 'var(--bg-elevated)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 0,
          }}
        >
          <h3
            className="font-display text-base"
            style={{ color: 'var(--text-primary)' }}
          >
            Add New Context Brief
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm mb-1" style={{ color: 'var(--text-secondary)' }}>
                Title
              </label>
              <input
                type="text"
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                placeholder="e.g., Q1 Board Meeting Prep"
                required
                className="w-full px-3 py-2 text-sm focus:outline-none"
                style={{
                  backgroundColor: 'var(--bg-primary)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 0,
                  color: 'var(--text-primary)',
                }}
              />
            </div>

            <div>
              <label className="block text-sm mb-1" style={{ color: 'var(--text-secondary)' }}>
                Scope
              </label>
              <select
                value={formScope}
                onChange={(e) => setFormScope(e.target.value)}
                className="w-full px-3 py-2 text-sm focus:outline-none"
                style={{
                  backgroundColor: 'var(--bg-primary)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 0,
                  color: 'var(--text-primary)',
                }}
              >
                {SCOPE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm mb-1" style={{ color: 'var(--text-secondary)' }}>
              Brief Text
            </label>
            <textarea
              value={formText}
              onChange={(e) => setFormText(e.target.value)}
              placeholder="e.g., We are preparing for the Q1 board meeting. All emails about financial results or board agenda should be treated as high priority."
              required
              rows={3}
              className="w-full px-3 py-2 text-sm resize-none focus:outline-none"
              style={{
                backgroundColor: 'var(--bg-primary)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 0,
                color: 'var(--text-primary)',
              }}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm mb-1" style={{ color: 'var(--text-secondary)' }}>
                Keywords (comma separated)
              </label>
              <input
                type="text"
                value={formKeywords}
                onChange={(e) => setFormKeywords(e.target.value)}
                placeholder="e.g., board, Q1, financials"
                className="w-full px-3 py-2 text-sm focus:outline-none"
                style={{
                  backgroundColor: 'var(--bg-primary)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 0,
                  color: 'var(--text-primary)',
                }}
              />
            </div>

            <div>
              <label className="block text-sm mb-1" style={{ color: 'var(--text-secondary)' }}>
                Expiration (optional)
              </label>
              <input
                type="date"
                value={formExpiration}
                onChange={(e) => setFormExpiration(e.target.value)}
                className="w-full px-3 py-2 text-sm focus:outline-none"
                style={{
                  backgroundColor: 'var(--bg-primary)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 0,
                  color: 'var(--text-primary)',
                }}
              />
            </div>
          </div>

          <div className="flex gap-3">
            <Button type="submit" variant="primary" loading={submitting}>
              Add Brief
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setShowAddForm(false)
                resetForm()
              }}
            >
              Cancel
            </Button>
          </div>
        </form>
      )}

      <Button
        variant="primary"
        onClick={() => setShowAddForm(!showAddForm)}
      >
        {showAddForm ? 'Close Form' : 'Add New Brief'}
      </Button>
    </div>
  )
}

// ── AI Memory Component ────────────────────────────────────────

const AI_MEMORY_TABS = [
  { id: 'rules', label: 'Rules' },
  { id: 'briefs', label: 'Context Briefs' },
]

export function AiMemory() {
  const [activeTab, setActiveTab] = useState('rules')

  return (
    <Card padding="lg">
      <h2
        className="font-display text-xl mb-4"
        style={{ color: 'var(--text-primary)' }}
      >
        AI Memory
      </h2>
      <p className="text-sm mb-4" style={{ color: 'var(--text-muted)' }}>
        Customize how Regent understands and responds to your communications.
      </p>

      <Tabs tabs={AI_MEMORY_TABS} activeTab={activeTab} onTabChange={setActiveTab}>
        {activeTab === 'rules' && <RulesTab />}
        {activeTab === 'briefs' && <ContextBriefsTab />}
      </Tabs>
    </Card>
  )
}
