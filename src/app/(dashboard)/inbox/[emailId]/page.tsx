'use client'

import { useState, useEffect, useCallback, use } from 'react'
import { notFound } from 'next/navigation'
import { api } from '@/lib/api'
import { Skeleton } from '@/components/ui/skeleton'
import { EmailDetail } from '@/components/inbox/email-detail'
import { useRealtimeSubscription } from '@/hooks/use-realtime'
import { useEmailStore } from '@/stores/email-store'
import type { Email, DraftReply } from '@/types/email'

interface EmailDetailPageProps {
  params: Promise<{ emailId: string }>
}

export default function EmailDetailPage({ params }: EmailDetailPageProps) {
  const { emailId } = use(params)
  const [email, setEmail] = useState<Email | null>(null)
  const [draft, setDraft] = useState<DraftReply | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [notFoundState, setNotFoundState] = useState(false)
  const updateEmailInStore = useEmailStore((s) => s.updateEmail)

  useEffect(() => {
    async function fetchEmail() {
      setIsLoading(true)
      try {
        const data = await api.get<Email>(`/emails/${emailId}`)
        setEmail(data)
        // Backend marks as read on fetch — sync the inbox list store
        updateEmailInStore(emailId, { is_read: true })

        // Try to fetch draft reply for this email
        try {
          const draftData = await api.get<DraftReply>(`/emails/${emailId}/draft`)
          setDraft(draftData)
        } catch {
          // No draft exists, that is fine
          setDraft(null)
        }
      } catch {
        setNotFoundState(true)
      } finally {
        setIsLoading(false)
      }
    }
    fetchEmail()
  }, [emailId])

  // Live update when AI processes this email (category, summary, draft)
  const handleEmailUpdate = useCallback((updated: Email) => {
    if (updated.id === emailId) {
      setEmail(prev => prev ? { ...prev, ...updated } : updated)
    }
  }, [emailId])

  useRealtimeSubscription<Email>({
    table: 'emails',
    event: 'UPDATE',
    filter: `id=eq.${emailId}`,
    onUpdate: handleEmailUpdate,
  })

  // Live draft updates
  const handleDraftChange = useCallback((payload: DraftReply) => {
    if (payload.email_id === emailId) {
      setDraft(payload)
    }
  }, [emailId])

  useRealtimeSubscription<DraftReply>({
    table: 'draft_replies',
    event: '*',
    filter: `email_id=eq.${emailId}`,
    onInsert: handleDraftChange,
    onUpdate: handleDraftChange,
  })

  if (notFoundState) {
    notFound()
  }

  if (isLoading || !email) {
    return (
      <div className="max-w-4xl mx-auto">
        <Skeleton width="120px" height="32px" className="mb-6" />
        <Skeleton width="70%" height="28px" className="mb-4" />
        <Skeleton width="40%" height="16px" className="mb-2" />
        <Skeleton width="30%" height="16px" className="mb-6" />
        <Skeleton height="120px" className="mb-6" />
        <Skeleton height="300px" />
      </div>
    )
  }

  return <EmailDetail email={email} draft={draft} />
}
