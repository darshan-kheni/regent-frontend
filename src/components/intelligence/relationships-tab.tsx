'use client'

import { useState } from 'react'
import { ArrowUp, ArrowDown, Minus, ChevronLeft, ChevronRight } from 'lucide-react'
import { Card, Skeleton, Avatar, Badge } from '@/components/ui'
import { PlanGateOverlay } from './plan-gate-overlay'
import { useRelationships } from '@/hooks/use-behavior-data'
import { cn } from '@/lib/utils'
import { getInitials } from '@/lib/utils'

interface RelationshipsTabProps {
  planGated?: boolean
}

type SortBy = 'interaction_count' | 'response_time' | 'last_interaction'

const frequencyBadgeVariant: Record<string, 'success' | 'info' | 'gold' | 'muted'> = {
  Daily: 'success',
  '3x/week': 'info',
  Weekly: 'gold',
  'Bi-weekly': 'muted',
  Monthly: 'muted',
}

function RelationshipsTab({ planGated }: RelationshipsTabProps) {
  const [sortBy, setSortBy] = useState<SortBy>('interaction_count')
  const [offset, setOffset] = useState(0)
  const limit = 20
  const { data, isLoading } = useRelationships(sortBy, limit, offset)

  if (planGated) {
    return (
      <div className="relative min-h-[400px]">
        <PlanGateOverlay requiredPlan="privy_council" />
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} height="60px" />)}
      </div>
    )
  }

  if (!data || data.contacts.length === 0) {
    return (
      <div className="py-8 text-center text-sm" style={{ color: 'var(--text-muted)' }}>
        No relationship data yet
      </div>
    )
  }

  const SortButton = ({ field, label }: { field: SortBy; label: string }) => (
    <button
      onClick={() => { setSortBy(field); setOffset(0) }}
      className="text-xs font-medium px-2 py-1 transition-colors"
      style={{
        color: sortBy === field ? 'var(--accent)' : 'var(--text-muted)',
        borderRadius: 0,
      }}
    >
      {label}
    </button>
  )

  const SentimentIcon = ({ trend }: { trend: string }) => {
    if (trend === 'up') return <ArrowUp size={14} style={{ color: '#22c55e' }} />
    if (trend === 'down') return <ArrowDown size={14} style={{ color: '#ef4444' }} />
    return <Minus size={14} style={{ color: '#C9A96E' }} />
  }

  return (
    <div className="space-y-4">
      {/* Sort Controls */}
      <div className="flex items-center gap-1">
        <span className="text-xs mr-2" style={{ color: 'var(--text-muted)' }}>Sort:</span>
        <SortButton field="interaction_count" label="Interactions" />
        <SortButton field="response_time" label="Response Time" />
        <SortButton field="last_interaction" label="Last Active" />
      </div>

      {/* Contact List */}
      <div className="space-y-2">
        {data.contacts.map((contact) => (
          <Card
            key={contact.contact_email}
            padding="sm"
            className={cn(contact.is_declining && 'border-l-2')}
            hover
          >
            <div
              className="flex items-center gap-3"
              style={contact.is_declining ? { borderLeftColor: '#C9A96E' } : undefined}
            >
              <Avatar name={contact.contact_name || contact.contact_email} size="sm" />
              <div className="flex-1 min-w-0">
                <p className="text-sm truncate" style={{ color: 'var(--text-primary)' }}>
                  {contact.contact_name || contact.contact_email}
                </p>
                {contact.contact_name && (
                  <p className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>
                    {contact.contact_email}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                  {contact.interaction_count} emails
                </span>
                {contact.avg_response_time_minutes != null && (
                  <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                    {Math.round(contact.avg_response_time_minutes)}m avg
                  </span>
                )}
                {contact.dominant_tone && (
                  <Badge variant="muted">{contact.dominant_tone.replace('_', ' ')}</Badge>
                )}
                <SentimentIcon trend={contact.sentiment_trend} />
                <Badge variant={frequencyBadgeVariant[contact.interaction_frequency] || 'muted'}>
                  {contact.interaction_frequency}
                </Badge>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      {data.total > limit && (
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={() => setOffset(Math.max(0, offset - limit))}
            disabled={offset === 0}
            className="p-1 disabled:opacity-30"
            style={{ color: 'var(--text-muted)' }}
          >
            <ChevronLeft size={18} />
          </button>
          <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
            {offset + 1}–{Math.min(offset + limit, data.total)} of {data.total}
          </span>
          <button
            onClick={() => setOffset(offset + limit)}
            disabled={offset + limit >= data.total}
            className="p-1 disabled:opacity-30"
            style={{ color: 'var(--text-muted)' }}
          >
            <ChevronRight size={18} />
          </button>
        </div>
      )}
    </div>
  )
}

export { RelationshipsTab }
