'use client'

import { useRouter } from 'next/navigation'
import { ArrowLeft, ChevronLeft, ChevronRight, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar } from '@/components/ui/avatar'
import { AISummary } from '@/components/inbox/ai-summary'
import { AttachmentsPanel } from '@/components/inbox/attachments-panel'
import { EmailBody } from '@/components/inbox/email-body'
import { ReplyActions } from '@/components/inbox/reply-actions'
import { useEmailStore } from '@/stores/email-store'
import { formatDate, formatEmailName, formatAddressWithName } from '@/lib/utils'
import type { Email, DraftReply } from '@/types/email'

interface EmailDetailProps {
  email: Email
  draft?: DraftReply | null
}

function EmailDetail({ email, draft }: EmailDetailProps) {
  const router = useRouter()
  const { emails } = useEmailStore()

  // Find current email index for prev/next navigation
  const currentIndex = emails.findIndex((e) => e.id === email.id)
  const prevEmail = currentIndex > 0 ? emails[currentIndex - 1] : null
  const nextEmail = currentIndex < emails.length - 1 ? emails[currentIndex + 1] : null

  const senderName = formatEmailName(email.from_name, email.from_address)
  const badgeVariant = email.category || 'muted'

  return (
    <div className="max-w-4xl mx-auto">
      {/* Navigation bar */}
      <div className="flex items-center justify-between mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push('/inbox')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Inbox
        </Button>

        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            disabled={!prevEmail}
            onClick={() => prevEmail && router.push(`/inbox/${prevEmail.id}`)}
            aria-label="Previous email"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          {emails.length > 0 && (
            <span
              className="text-xs px-2"
              style={{ color: 'var(--text-muted)' }}
            >
              {currentIndex + 1} of {emails.length}
            </span>
          )}
          <Button
            variant="ghost"
            size="sm"
            disabled={!nextEmail}
            onClick={() => nextEmail && router.push(`/inbox/${nextEmail.id}`)}
            aria-label="Next email"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Subject */}
      <div className="flex items-start gap-3 mb-4">
        <h1
          className="font-display text-2xl font-semibold flex-1"
          style={{ color: 'var(--text-primary)' }}
        >
          {email.subject}
        </h1>
        {email.is_starred && (
          <Star
            className="h-5 w-5 flex-shrink-0 fill-current mt-1"
            style={{ color: 'var(--accent)' }}
          />
        )}
      </div>

      {/* Category + Priority */}
      <div className="flex items-center gap-2 mb-6">
        {email.category && email.category !== 'uncategorized' && (
          <Badge variant={badgeVariant}>{email.category}</Badge>
        )}
        {email.priority !== undefined && email.priority >= 80 && (
          <Badge variant="urgent">Priority: {email.priority}</Badge>
        )}
      </div>

      {/* Metadata row */}
      <div
        className="flex items-start gap-4 pb-6 mb-6"
        style={{ borderBottom: '1px solid var(--border-subtle)' }}
      >
        <Avatar name={senderName} size="lg" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className="text-sm font-semibold"
              style={{ color: 'var(--text-primary)' }}
            >
              {senderName}
            </span>
            <span
              className="text-xs"
              style={{ color: 'var(--text-muted)' }}
            >
              &lt;{email.from_address}&gt;
            </span>
          </div>
          <div className="mt-1">
            <span
              className="text-xs"
              style={{ color: 'var(--text-muted)' }}
            >
              To: {(email.to_addresses || []).map(formatAddressWithName).join(', ')}
            </span>
          </div>
          {(email.cc_addresses || []).length > 0 && (
            <div>
              <span
                className="text-xs"
                style={{ color: 'var(--text-muted)' }}
              >
                Cc: {(email.cc_addresses || []).map(formatAddressWithName).join(', ')}
              </span>
            </div>
          )}
        </div>
        <div className="flex flex-col items-end gap-1 flex-shrink-0">
          <time
            className="text-xs"
            style={{ color: 'var(--text-muted)' }}
            dateTime={email.received_at}
          >
            {formatDate(email.received_at, 'MMM d, yyyy h:mm a')}
          </time>
          <Badge variant="info">{email.account_id.slice(0, 8)}</Badge>
        </div>
      </div>

      {/* AI Summary */}
      {email.summary && <AISummary summary={email.summary} />}

      {/* Attachments */}
      {email.has_attachments && email.attachments && email.attachments.length > 0 && (
        <AttachmentsPanel attachments={email.attachments} />
      )}

      {/* Email Body */}
      <div className="mb-6">
        <EmailBody bodyHtml={email.body_html} bodyText={email.body_text} />
      </div>

      {/* Reply Actions */}
      <ReplyActions emailId={email.id} draftId={draft?.id} />
    </div>
  )
}

export { EmailDetail, type EmailDetailProps }
