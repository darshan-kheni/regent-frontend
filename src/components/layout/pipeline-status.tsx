'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { usePipelineStatus } from '@/hooks/use-pipeline-status'
import type { PipelineJob, PipelineRecent } from '@/hooks/use-pipeline-status'
import {
  Cpu,
  CheckCircle,
  AlertTriangle,
  Clock,
  ChevronUp,
  ChevronDown,
  FileText,
  Sparkles,
  PenSquare,
  Loader2,
  ExternalLink,
  Inbox,
} from 'lucide-react'

const stageLabels: Record<string, string> = {
  categorizing: 'Categorizing',
  summarizing: 'Summarizing',
  drafting: 'Drafting Reply',
  complete: 'Complete',
  error: 'Failed',
  queued: 'Queued',
}

const stageIcons: Record<string, typeof Cpu> = {
  categorizing: FileText,
  summarizing: Sparkles,
  drafting: PenSquare,
}

function truncate(s: string, max: number) {
  return s.length > max ? s.slice(0, max) + '…' : s
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const secs = Math.floor(diff / 1000)
  if (secs < 60) return `${secs}s ago`
  const mins = Math.floor(secs / 60)
  if (mins < 60) return `${mins}m ago`
  return `${Math.floor(mins / 60)}h ago`
}

function formatEta(iso: string): string {
  const diff = new Date(iso).getTime() - Date.now()
  if (diff <= 0) return 'processing soon'
  const secs = Math.floor(diff / 1000)
  if (secs < 60) return `in ~${secs}s`
  const mins = Math.floor(secs / 60)
  if (mins < 60) {
    const remSecs = secs % 60
    return remSecs > 0 ? `in ~${mins}m ${remSecs}s` : `in ~${mins}m`
  }
  const hrs = Math.floor(mins / 60)
  return `in ~${hrs}h ${mins % 60}m`
}

function formatDuration(totalSecs: number): string {
  if (totalSecs < 60) return `${totalSecs}s`
  const mins = Math.floor(totalSecs / 60)
  const secs = totalSecs % 60
  if (mins < 60) return secs > 0 ? `${mins}m ${secs}s` : `${mins}m`
  const hrs = Math.floor(mins / 60)
  return `${hrs}h ${mins % 60}m`
}

import type { PipelineStatus as PipelineStatusType } from '@/hooks/use-pipeline-status'

/**
 * Calculate realistic total queue time accounting for cron batching.
 * The ai_queue cron fires every cronInterval seconds, picks up batchSize emails per tick,
 * and the worker processes them serially at avgSecs per email.
 */
function formatTotalQueueTime(status: PipelineStatusType): string {
  const { queue_depth, avg_secs_per_email, cron_interval_secs, cron_batch_size } = status
  if (queue_depth <= 0) return '0s'

  // Clamp avg to sane bounds (backend should already do this, but be safe)
  const avgSecs = Math.min(Math.max(avg_secs_per_email || 15, 5), 60)
  const batchSize = cron_batch_size || 5
  const cronInterval = cron_interval_secs || 300

  // How many cron ticks needed to enqueue all items?
  const batches = Math.ceil(queue_depth / batchSize)

  // Each batch: cron picks up batchSize items, worker processes them serially.
  // Processing time per batch = batchSize * avgSecs
  const processTimePerBatch = batchSize * avgSecs

  let totalSecs: number
  if (processTimePerBatch <= cronInterval) {
    // Processing finishes before next cron tick — bottleneck is cron interval
    // Last batch only needs processing time, not another cron wait
    totalSecs = (batches - 1) * cronInterval + Math.min(queue_depth % batchSize || batchSize, batchSize) * avgSecs
  } else {
    // Processing is slower than cron interval — bottleneck is processing
    totalSecs = queue_depth * avgSecs
  }

  return formatDuration(Math.round(totalSecs))
}

export function PipelineStatus() {
  const { status, isLoading } = usePipelineStatus()
  const [expanded, setExpanded] = useState(false)
  const router = useRouter()

  if (isLoading || !status) return null

  const queuedItems = status.queued ?? []
  const isProcessing = status.active.length > 0 || status.queue_depth > 0
  const hasErrors = status.stats.error > 0

  const navigateToEmail = (emailId: string) => {
    router.push(`/inbox/${emailId}`)
  }

  return (
    <div
      style={{
        backgroundColor: 'var(--bg-elevated)',
        border: '1px solid var(--border-default)',
      }}
    >
      {/* Header — always visible */}
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-2 px-3 py-2 text-left"
        style={{ color: 'var(--text-secondary)' }}
      >
        <span
          className="flex-shrink-0 w-2 h-2"
          style={{
            backgroundColor: isProcessing
              ? '#C9A96E'
              : hasErrors
                ? '#D4645D'
                : '#6FAD76',
            animation: isProcessing ? 'pulse 2s infinite' : undefined,
          }}
        />

        <span className="flex-1 text-xs font-medium truncate">
          {isProcessing ? (
            <>
              AI Pipeline
              <span style={{ color: 'var(--accent)' }}>
                {' '}· {status.active.length > 0 ? stageLabels[status.active[0].stage] || 'Processing' : 'Queued'}
              </span>
            </>
          ) : hasErrors ? (
            <>AI Pipeline · <span style={{ color: '#D4645D' }}>{status.stats.error} failed</span></>
          ) : (
            <>AI Pipeline · <span style={{ color: '#6FAD76' }}>Idle</span></>
          )}
        </span>

        {status.queue_depth > 0 && (
          <span
            className="text-[10px] px-1.5 py-0.5 font-medium"
            style={{
              backgroundColor: 'rgba(201,169,110,0.15)',
              color: 'var(--accent)',
            }}
          >
            {status.queue_depth} queued
          </span>
        )}

        {expanded ? (
          <ChevronDown className="h-3 w-3 flex-shrink-0" style={{ color: 'var(--text-muted)' }} />
        ) : (
          <ChevronUp className="h-3 w-3 flex-shrink-0" style={{ color: 'var(--text-muted)' }} />
        )}
      </button>

      {/* Expanded panel */}
      {expanded && (
        <div
          className="px-3 pb-3 space-y-3"
          style={{ borderTop: '1px solid var(--border-subtle)' }}
        >
          {/* Stats bar */}
          <div className="flex items-center gap-3 pt-2">
            <StatBadge
              icon={<CheckCircle className="h-3 w-3" />}
              value={status.stats.complete}
              label="Done"
              color="#6FAD76"
            />
            <StatBadge
              icon={<Cpu className="h-3 w-3" />}
              value={status.stats.processing}
              label="Active"
              color="#C9A96E"
            />
            <StatBadge
              icon={<Clock className="h-3 w-3" />}
              value={status.queue_depth}
              label="Queue"
              color="var(--text-muted)"
            />
            {status.stats.error > 0 && (
              <StatBadge
                icon={<AlertTriangle className="h-3 w-3" />}
                value={status.stats.error}
                label="Errors"
                color="#D4645D"
              />
            )}
          </div>

          {/* Active jobs */}
          {status.active.length > 0 && (
            <Section title="Processing Now">
              {status.active.map((job) => (
                <ActiveJobRow key={job.email_id} job={job} onClick={() => navigateToEmail(job.email_id)} />
              ))}
            </Section>
          )}

          {/* Queued emails */}
          {(queuedItems.length > 0 || status.queue_depth > 0) && (
            <Section title={
              <span className="flex flex-col gap-0.5">
                <span className="flex items-center gap-2">
                  <span>{`Queued (${status.queue_depth})`}</span>
                  {status.queue_depth > 0 && status.avg_secs_per_email > 0 && (
                    <span style={{ color: 'var(--accent)', textTransform: 'none', letterSpacing: 'normal' }}>
                      {formatTotalQueueTime(status)} remaining
                    </span>
                  )}
                </span>
                {status.next_cron_run && status.queue_depth > 0 && (
                  <span style={{ color: 'var(--text-muted)', textTransform: 'none', letterSpacing: 'normal', fontSize: '9px' }}>
                    Processes {status.cron_batch_size}/batch every {Math.round(status.cron_interval_secs / 60)}m
                    {status.redis_queue_depth > 0 && ` · ${status.redis_queue_depth} in active queue`}
                  </span>
                )}
              </span>
            }>
              {queuedItems.map((job) => (
                <QueuedRow key={job.email_id} job={job} onClick={() => navigateToEmail(job.email_id)} />
              ))}
              {status.queue_depth > queuedItems.length && (
                <div
                  className="text-[10px] pt-1"
                  style={{ color: 'var(--text-muted)' }}
                >
                  +{status.queue_depth - queuedItems.length} more in queue
                </div>
              )}
            </Section>
          )}

          {/* Recent completions */}
          {status.recent.length > 0 && (
            <Section title="Recent">
              {status.recent.slice(0, 5).map((item) => (
                <RecentRow key={item.email_id} item={item} onClick={() => navigateToEmail(item.email_id)} />
              ))}
            </Section>
          )}
        </div>
      )}

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </div>
  )
}

function Section({ title, children }: { title: React.ReactNode; children: React.ReactNode }) {
  return (
    <div>
      <div
        className="text-[10px] uppercase tracking-wider font-medium mb-1.5"
        style={{ color: 'var(--text-muted)' }}
      >
        {title}
      </div>
      <div className="space-y-0.5">{children}</div>
    </div>
  )
}

function ActiveJobRow({ job, onClick }: { job: PipelineJob; onClick: () => void }) {
  const Icon = stageIcons[job.stage] || Cpu
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full flex items-center gap-2 py-1 text-left group"
      style={{ cursor: 'pointer' }}
    >
      <Loader2
        className="h-3 w-3 flex-shrink-0 animate-spin"
        style={{ color: 'var(--accent)' }}
      />
      <Icon
        className="h-3 w-3 flex-shrink-0"
        style={{ color: 'var(--accent)' }}
      />
      <span
        className="text-[11px] flex-1 truncate group-hover:underline"
        style={{ color: 'var(--text-secondary)' }}
      >
        {truncate(job.subject, 30)}
      </span>
      <span
        className="text-[10px] flex-shrink-0"
        style={{ color: 'var(--accent)' }}
      >
        {stageLabels[job.stage]}
      </span>
      <ExternalLink
        className="h-2.5 w-2.5 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
        style={{ color: 'var(--text-muted)' }}
      />
    </button>
  )
}

function QueuedRow({ job, onClick }: { job: PipelineJob; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full flex items-center gap-2 py-0.5 text-left group"
      style={{ cursor: 'pointer' }}
    >
      <span
        className="text-[9px] font-mono flex-shrink-0 w-4 text-center"
        style={{ color: 'var(--text-muted)' }}
      >
        {job.position || '·'}
      </span>
      <Inbox
        className="h-3 w-3 flex-shrink-0"
        style={{ color: 'var(--text-muted)' }}
      />
      <span
        className="text-[11px] flex-1 truncate group-hover:underline"
        style={{ color: 'var(--text-muted)' }}
      >
        {truncate(job.subject, 24)}
      </span>
      <span
        className="text-[10px] flex-shrink-0"
        style={{ color: 'var(--accent)' }}
      >
        {job.est_start ? formatEta(job.est_start) : 'waiting'}
      </span>
      <ExternalLink
        className="h-2.5 w-2.5 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
        style={{ color: 'var(--text-muted)' }}
      />
    </button>
  )
}

function RecentRow({ item, onClick }: { item: PipelineRecent; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full flex items-center gap-2 py-0.5 text-left group"
      style={{ cursor: 'pointer' }}
    >
      {item.stage === 'complete' ? (
        <CheckCircle
          className="h-3 w-3 flex-shrink-0"
          style={{ color: '#6FAD76' }}
        />
      ) : (
        <AlertTriangle
          className="h-3 w-3 flex-shrink-0"
          style={{ color: '#D4645D' }}
        />
      )}
      <span
        className="text-[11px] flex-1 truncate group-hover:underline"
        style={{ color: 'var(--text-muted)' }}
      >
        {truncate(item.subject, 28)}
      </span>
      {item.has_draft && item.stage === 'complete' && (
        <span title="Draft generated">
          <PenSquare
            className="h-2.5 w-2.5 flex-shrink-0"
            style={{ color: 'var(--accent)' }}
          />
        </span>
      )}
      <span
        className="text-[10px] flex-shrink-0"
        style={{ color: 'var(--text-muted)' }}
      >
        {timeAgo(item.completed_at)}
      </span>
      <ExternalLink
        className="h-2.5 w-2.5 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
        style={{ color: 'var(--text-muted)' }}
      />
    </button>
  )
}

function StatBadge({
  icon,
  value,
  label,
  color,
}: {
  icon: React.ReactNode
  value: number
  label: string
  color: string
}) {
  return (
    <div className="flex items-center gap-1" style={{ color }}>
      {icon}
      <span className="text-[11px] font-semibold">{value}</span>
      <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
        {label}
      </span>
    </div>
  )
}
