'use client'

import { useState, useEffect, useCallback } from 'react'
import { Send } from 'lucide-react'
import { Button, Input, Select } from '@/components/ui'
import { AddressInput } from '@/components/compose/address-input'
import { AttachmentChips } from '@/components/compose/attachment-chips'
import { AICompose } from '@/components/compose/ai-compose'
import { ScheduleSend } from '@/components/compose/schedule-send'
import { api } from '@/lib/api'
import { useToast } from '@/providers/toast-provider'
import type { UserAccount } from '@/types/email'

export function ComposeForm() {
  const [toAddresses, setToAddresses] = useState<string[]>([])
  const [ccAddresses, setCcAddresses] = useState<string[]>([])
  const [bccAddresses, setBccAddresses] = useState<string[]>([])
  const [showCcBcc, setShowCcBcc] = useState(false)
  const [subject, setSubject] = useState('')
  const [body, setBody] = useState('')
  const [files, setFiles] = useState<File[]>([])
  const [accounts, setAccounts] = useState<UserAccount[]>([])
  const [selectedAccount, setSelectedAccount] = useState('')
  const [scheduledAt, setScheduledAt] = useState<string | null>(null)
  const [sending, setSending] = useState(false)
  const { addToast } = useToast()

  useEffect(() => {
    async function loadAccounts() {
      try {
        const data = await api.get<UserAccount[]>('/accounts')
        setAccounts(data)
        if (data.length > 0) {
          setSelectedAccount(data[0].id)
        }
      } catch {
        // Accounts may not be available yet
      }
    }
    loadAccounts()

    // Pre-fill from URL params (Forward/Resend from Sent page)
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      const to = params.get('to')
      const subj = params.get('subject')
      const b = params.get('body')
      if (to) setToAddresses(to.split(',').map(s => s.trim()).filter(Boolean))
      if (subj) setSubject(subj)
      if (b) setBody(b)
    }
  }, [])

  const handleAddFiles = useCallback((fileList: FileList) => {
    setFiles((prev) => [...prev, ...Array.from(fileList)])
  }, [])

  const handleRemoveFile = useCallback((index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index))
  }, [])

  const handleDraftGenerated = useCallback((draft: string) => {
    setBody(draft)
  }, [])

  async function handleSend(e: React.FormEvent) {
    e.preventDefault()

    if (toAddresses.length === 0) {
      addToast('error', 'Please add at least one recipient')
      return
    }

    if (!selectedAccount) {
      addToast('error', 'Please select a sending account')
      return
    }

    setSending(true)
    try {
      await api.post('/compose/send', {
        account_id: selectedAccount,
        to_addresses: toAddresses,
        cc_addresses: ccAddresses,
        bcc_addresses: bccAddresses,
        subject,
        body,
        scheduled_at: scheduledAt,
      })
      addToast('success', scheduledAt ? 'Email scheduled successfully' : 'Email sent successfully')
      // Reset form
      setToAddresses([])
      setCcAddresses([])
      setBccAddresses([])
      setSubject('')
      setBody('')
      setFiles([])
      setScheduledAt(null)
      setShowCcBcc(false)
    } catch (err) {
      addToast('error', err instanceof Error ? err.message : 'Failed to send email')
    } finally {
      setSending(false)
    }
  }

  const accountOptions = accounts.map((a) => ({
    value: a.id,
    label: `${a.display_name} (${a.email_address})`,
  }))

  // Build context for AI from current form state
  const aiContext = [
    toAddresses.length > 0 ? `To: ${toAddresses.join(', ')}` : '',
    subject ? `Subject: ${subject}` : '',
    body ? `Current draft: ${body}` : '',
  ]
    .filter(Boolean)
    .join('\n')

  return (
    <form onSubmit={handleSend} className="space-y-4">
      {/* From account selector */}
      {accountOptions.length > 0 && (
        <Select
          options={accountOptions}
          value={selectedAccount}
          onChange={setSelectedAccount}
          label="From"
        />
      )}

      {/* To */}
      <AddressInput
        value={toAddresses}
        onChange={setToAddresses}
        label="To"
        placeholder="Add recipient email addresses"
      />

      {/* CC/BCC toggle */}
      {!showCcBcc && (
        <button
          type="button"
          className="text-xs font-medium"
          style={{ color: 'var(--accent)' }}
          onClick={() => setShowCcBcc(true)}
        >
          + CC / BCC
        </button>
      )}

      {/* CC & BCC */}
      {showCcBcc && (
        <>
          <AddressInput
            value={ccAddresses}
            onChange={setCcAddresses}
            label="CC"
          />
          <AddressInput
            value={bccAddresses}
            onChange={setBccAddresses}
            label="BCC"
          />
        </>
      )}

      {/* Subject */}
      <Input
        label="Subject"
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
        placeholder="Email subject"
      />

      {/* Body */}
      <div className="flex flex-col gap-1.5">
        <label
          className="text-sm font-medium"
          style={{ color: 'var(--text-secondary)' }}
        >
          Body
        </label>
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Write your message..."
          rows={12}
          className="w-full px-3 py-2 text-sm outline-none resize-y"
          style={{
            borderRadius: 0,
            backgroundColor: 'var(--bg-elevated)',
            color: 'var(--text-primary)',
            border: '1px solid var(--border-default)',
            minHeight: '200px',
          }}
        />
      </div>

      {/* AI Compose */}
      <AICompose
        onDraftGenerated={handleDraftGenerated}
        context={aiContext}
      />

      {/* Attachments */}
      <AttachmentChips
        files={files}
        onAdd={handleAddFiles}
        onRemove={handleRemoveFile}
      />

      {/* Bottom bar */}
      <div
        className="flex items-center justify-between pt-4"
        style={{ borderTop: '1px solid var(--border-subtle)' }}
      >
        <div className="flex items-center gap-3">
          <ScheduleSend scheduledAt={scheduledAt} onSchedule={setScheduledAt} />
        </div>

        <Button type="submit" variant="primary" size="md" loading={sending}>
          <Send className="h-4 w-4 mr-2" />
          {scheduledAt ? 'Schedule' : 'Send'}
        </Button>
      </div>
    </form>
  )
}
