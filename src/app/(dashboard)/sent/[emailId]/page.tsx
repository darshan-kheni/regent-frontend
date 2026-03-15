'use client'

import { useState, useEffect, use } from 'react'
import { notFound } from 'next/navigation'
import { api } from '@/lib/api'
import type { Email } from '@/types/email'
import { SentDetail } from '@/components/sent/sent-detail'
import { Skeleton } from '@/components/ui'

interface SentEmailPageProps {
  params: Promise<{ emailId: string }>
}

export default function SentEmailPage({ params }: SentEmailPageProps) {
  const { emailId } = use(params)
  const [email, setEmail] = useState<Email | null>(null)
  const [adjacentIds, setAdjacentIds] = useState<{ prev: string | null; next: string | null }>({
    prev: null,
    next: null,
  })
  const [loading, setLoading] = useState(true)
  const [notFoundState, setNotFoundState] = useState(false)

  useEffect(() => {
    async function load() {
      setLoading(true)
      try {
        const data = await api.get<Email>(`/sent/${emailId}`)
        setEmail(data)

        // Try to load adjacent IDs for prev/next navigation
        try {
          const adjacent = await api.get<{ prev_id: string | null; next_id: string | null }>(
            `/sent/${emailId}/adjacent`
          )
          setAdjacentIds({ prev: adjacent.prev_id, next: adjacent.next_id })
        } catch {
          // Adjacent endpoint may not exist yet
        }
      } catch {
        setNotFoundState(true)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [emailId])

  if (notFoundState) {
    notFound()
  }

  if (loading || !email) {
    return (
      <div className="max-w-4xl mx-auto">
        <Skeleton className="h-8 w-32 mb-6" />
        <div className="space-y-4">
          <Skeleton className="h-10 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    )
  }

  return (
    <SentDetail
      email={email}
      prevId={adjacentIds.prev}
      nextId={adjacentIds.next}
    />
  )
}
