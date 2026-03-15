'use client'

import Link from 'next/link'
import { AlertTriangle, MessageSquareReply, Inbox } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

const actions = [
  { label: 'View Urgent', href: '/inbox?category=urgent', icon: AlertTriangle },
  { label: 'Review Replies', href: '/reply-queue', icon: MessageSquareReply },
  { label: 'Open Inbox', href: '/inbox', icon: Inbox },
]

export function QuickActions() {
  return (
    <Card padding="lg">
      <h2
        className="font-display text-lg mb-4"
        style={{ color: 'var(--text-primary)' }}
      >
        Quick Actions
      </h2>
      <div className="space-y-3">
        {actions.map(({ label, href, icon: Icon }) => (
          <Link key={href} href={href} className="block">
            <Button variant="secondary" className="w-full justify-start gap-2">
              <Icon size={16} aria-hidden="true" />
              {label}
            </Button>
          </Link>
        ))}
      </div>
    </Card>
  )
}
