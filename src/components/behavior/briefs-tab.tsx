'use client'

import { useState, useCallback } from 'react'
import { Info, X } from 'lucide-react'
import { Button, Card, Input, Select, Badge } from '@/components/ui'
import { BriefCard } from '@/components/behavior/brief-card'
import type { ContextBrief } from '@/types/ai-memory'

interface BriefsTabProps {
  briefs: ContextBrief[]
  onAdd: (payload: {
    title: string
    scope: string
    context: string
    keywords: string[]
    expires_at: string | null
  }) => Promise<void>
  onDelete: (id: string) => Promise<void>
  briefsUsed?: number
  briefsMax?: number
}

const scopeOptions = [
  { value: 'email', label: 'Email' },
  { value: 'calendar', label: 'Calendar' },
  { value: 'tasks', label: 'Tasks' },
  { value: 'all', label: 'All' },
]

function BriefsTab({ briefs, onAdd, onDelete, briefsUsed = 0, briefsMax = 3 }: BriefsTabProps) {
  const isUnlimited = briefsMax >= 999
  const atBriefLimit = !isUnlimited && briefsUsed >= briefsMax
  const [title, setTitle] = useState('')
  const [scope, setScope] = useState('email')
  const [context, setContext] = useState('')
  const [keywordInput, setKeywordInput] = useState('')
  const [keywords, setKeywords] = useState<string[]>([])
  const [expiresAt, setExpiresAt] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleKeywordKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        e.preventDefault()
        const raw = keywordInput.trim()
        if (!raw) return

        const newKeywords = raw
          .split(',')
          .map((k) => k.trim())
          .filter((k) => k.length > 0 && !keywords.includes(k))

        if (newKeywords.length > 0) {
          setKeywords((prev) => [...prev, ...newKeywords])
        }
        setKeywordInput('')
      }
    },
    [keywordInput, keywords]
  )

  const removeKeyword = useCallback((keyword: string) => {
    setKeywords((prev) => prev.filter((k) => k !== keyword))
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim() || !context.trim()) return

    setIsSubmitting(true)
    try {
      await onAdd({
        title: title.trim(),
        scope,
        context: context.trim(),
        keywords,
        expires_at: expiresAt || null,
      })
      setTitle('')
      setContext('')
      setKeywords([])
      setKeywordInput('')
      setExpiresAt('')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Info banner */}
      <Card padding="md">
        <div
          className="flex items-start gap-3"
          style={{
            backgroundColor: 'rgba(126,163,194,0.08)',
            margin: '-1rem',
            padding: '1rem',
          }}
        >
          <Info
            className="h-5 w-5 flex-shrink-0 mt-0.5"
            style={{ color: '#7EA3C2' }}
          />
          <p
            className="text-sm leading-relaxed"
            style={{ color: 'var(--text-secondary)' }}
          >
            Context briefs give AI situational awareness. Add context about
            upcoming events, ongoing projects, or important relationships.
          </p>
        </div>
      </Card>

      {/* Add form */}
      <Card padding="lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Board Meeting Q1"
            />
            <Select
              label="Scope"
              options={scopeOptions}
              value={scope}
              onChange={setScope}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="brief-context"
              className="text-sm font-medium"
              style={{ color: 'var(--text-secondary)' }}
            >
              Context
            </label>
            <textarea
              id="brief-context"
              value={context}
              onChange={(e) => setContext(e.target.value)}
              placeholder="Provide context that the AI should be aware of..."
              rows={4}
              className="w-full px-3 py-2 text-sm transition-colors focus:outline-none resize-none"
              style={{
                borderRadius: 0,
                backgroundColor: 'var(--bg-elevated)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border-default)',
              }}
            />
          </div>

          {/* Keywords input */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="brief-keywords"
              className="text-sm font-medium"
              style={{ color: 'var(--text-secondary)' }}
            >
              Keywords (comma-separated, press Enter to add)
            </label>
            <input
              id="brief-keywords"
              type="text"
              value={keywordInput}
              onChange={(e) => setKeywordInput(e.target.value)}
              onKeyDown={handleKeywordKeyDown}
              placeholder="e.g. merger, acquisition, Q1"
              className="h-10 w-full px-3 text-sm transition-colors focus:outline-none"
              style={{
                borderRadius: 0,
                backgroundColor: 'var(--bg-elevated)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border-default)',
              }}
            />
            {keywords.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-1">
                {keywords.map((keyword) => (
                  <Badge key={keyword} variant="gold" className="gap-1">
                    {keyword}
                    <button
                      type="button"
                      onClick={() => removeKeyword(keyword)}
                      className="ml-0.5 hover:opacity-70 focus:outline-none"
                      aria-label={`Remove keyword ${keyword}`}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Expiration date */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="brief-expires"
              className="text-sm font-medium"
              style={{ color: 'var(--text-secondary)' }}
            >
              Expiration Date (optional)
            </label>
            <input
              id="brief-expires"
              type="date"
              value={expiresAt}
              onChange={(e) => setExpiresAt(e.target.value)}
              className="h-10 w-full px-3 text-sm transition-colors focus:outline-none"
              style={{
                borderRadius: 0,
                backgroundColor: 'var(--bg-elevated)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border-default)',
              }}
            />
          </div>

          <Button
            type="submit"
            disabled={!title.trim() || !context.trim() || isSubmitting || atBriefLimit}
            loading={isSubmitting}
          >
            Add Brief
          </Button>
        </form>
      </Card>

      {/* Plan limit indicator */}
      <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
        {isUnlimited
          ? `${briefsUsed} briefs created (unlimited)`
          : `${briefsUsed} / ${briefsMax} context briefs used`}
      </p>

      {/* Briefs list */}
      {briefs.length > 0 && (
        <div className="space-y-3">
          {briefs.map((brief) => (
            <BriefCard key={brief.id} brief={brief} onDelete={onDelete} />
          ))}
        </div>
      )}
    </div>
  )
}

export { BriefsTab }
