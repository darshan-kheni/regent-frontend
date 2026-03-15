'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Send, RefreshCw, PenTool } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useToast } from '@/providers/toast-provider'
import { api } from '@/lib/api'

interface ReplyActionsProps {
  emailId: string
  draftId?: string
}

function ReplyActions({ emailId, draftId }: ReplyActionsProps) {
  const router = useRouter()
  const { addToast } = useToast()
  const [isSending, setIsSending] = useState(false)
  const [isRefining, setIsRefining] = useState(false)

  async function handleApprove() {
    if (!draftId) return
    setIsSending(true)
    try {
      await api.post(`/drafts/${draftId}/approve`)
      addToast('success', 'Reply sent successfully')
      router.push('/inbox')
    } catch (err) {
      addToast('error', err instanceof Error ? err.message : 'Failed to send reply')
    } finally {
      setIsSending(false)
    }
  }

  async function handleRefine() {
    if (!draftId) return
    setIsRefining(true)
    try {
      await api.post(`/drafts/${draftId}/refine`)
      addToast('info', 'Draft refinement requested')
    } catch (err) {
      addToast('error', err instanceof Error ? err.message : 'Failed to refine draft')
    } finally {
      setIsRefining(false)
    }
  }

  function handleManualReply() {
    router.push(`/compose?replyTo=${emailId}`)
  }

  return (
    <div
      className="flex items-center gap-3 pt-6 mt-6"
      style={{ borderTop: '1px solid var(--border-subtle)' }}
    >
      {draftId && (
        <>
          <Button
            variant="primary"
            onClick={handleApprove}
            loading={isSending}
            disabled={isRefining}
          >
            <Send className="h-4 w-4 mr-2" />
            Approve &amp; Send
          </Button>
          <Button
            variant="secondary"
            onClick={handleRefine}
            loading={isRefining}
            disabled={isSending}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refine
          </Button>
        </>
      )}
      <Button
        variant="ghost"
        onClick={handleManualReply}
        disabled={isSending || isRefining}
      >
        <PenTool className="h-4 w-4 mr-2" />
        Reply Manually
      </Button>
    </div>
  )
}

export { ReplyActions, type ReplyActionsProps }
