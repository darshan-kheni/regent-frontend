'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Mail,
  MessageSquareReply,
  Send,
  PenSquare,
  BarChart3,
  Brain,
  Puzzle,
  ScrollText,
  Bell,
  CreditCard,
  Settings,
  CalendarDays,
  CheckSquare,
  Plane,
  Users,
  FileText,
  Receipt,
  X,
  Lock,
  Activity,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { useUIStore } from '@/stores/ui-store'
import { TokenMeter } from './token-meter'
import { ConnectionDot } from './connection-dot'

interface NavItem {
  id: string
  label: string
  href: string
  icon: LucideIcon
}

interface ComingSoonItem {
  id: string
  label: string
  icon: LucideIcon
}

const activeModules: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', href: '/', icon: LayoutDashboard },
  { id: 'inbox', label: 'Inbox', href: '/inbox', icon: Mail },
  { id: 'reply-queue', label: 'Reply Queue', href: '/reply-queue', icon: MessageSquareReply },
  { id: 'sent', label: 'Sent', href: '/sent', icon: Send },
  { id: 'compose', label: 'Compose', href: '/compose', icon: PenSquare },
  { id: 'analytics', label: 'Analytics', href: '/analytics', icon: BarChart3 },
  { id: 'behavior', label: 'AI Memory', href: '/behavior', icon: Brain },
  { id: 'intelligence', label: 'Intelligence', href: '/intelligence', icon: Activity },
  { id: 'tasks', label: 'Tasks', href: '/tasks', icon: CheckSquare },
  { id: 'modules', label: 'Modules', href: '/modules', icon: Puzzle },
  { id: 'audit-log', label: 'Audit Log', href: '/audit-log', icon: ScrollText },
  { id: 'briefings', label: 'Briefings', href: '/briefings', icon: Bell },
  { id: 'billing', label: 'Billing', href: '/billing', icon: CreditCard },
  { id: 'settings', label: 'Settings', href: '/settings', icon: Settings },
]

const comingSoonModules: ComingSoonItem[] = [
  { id: 'calendar', label: 'Calendar', icon: CalendarDays },
  { id: 'travel', label: 'Travel', icon: Plane },
  { id: 'contacts', label: 'Contacts', icon: Users },
  { id: 'documents', label: 'Documents', icon: FileText },
  { id: 'expenses', label: 'Expenses', icon: Receipt },
]

export function MobileDrawer() {
  const pathname = usePathname()
  const mobileDrawerOpen = useUIStore((s) => s.mobileDrawerOpen)
  const setMobileDrawerOpen = useUIStore((s) => s.setMobileDrawerOpen)

  // Close drawer on navigation
  useEffect(() => {
    setMobileDrawerOpen(false)
  }, [pathname, setMobileDrawerOpen])

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (mobileDrawerOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileDrawerOpen])

  function isActive(href: string): boolean {
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href)
  }

  return (
    <div className="md:hidden">
      {/* Backdrop */}
      {mobileDrawerOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50"
          onClick={() => setMobileDrawerOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Drawer */}
      <div
        className="fixed inset-y-0 left-0 z-50 w-72 flex flex-col"
        style={{
          backgroundColor: 'var(--bg-sidebar)',
          borderRight: '1px solid var(--border-default)',
          transform: mobileDrawerOpen ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 200ms var(--ease-luxury, cubic-bezier(0.4, 0, 0.2, 1))',
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between h-14 px-4 flex-shrink-0">
          <span
            className="font-display font-semibold text-lg tracking-wide select-none"
            style={{ color: 'var(--accent)' }}
          >
            REGENT
          </span>
          <button
            type="button"
            onClick={() => setMobileDrawerOpen(false)}
            className="p-1 transition-colors"
            style={{ color: 'var(--text-muted)' }}
            aria-label="Close navigation menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-2">
          <ul className="space-y-0.5">
            {activeModules.map((item) => {
              const active = isActive(item.href)
              return (
                <li key={item.id}>
                  <Link
                    href={item.href}
                    className="flex items-center gap-3 px-4 py-2 text-sm transition-colors"
                    style={{
                      borderLeft: active ? '3px solid var(--accent)' : '3px solid transparent',
                      color: active ? 'var(--accent)' : 'var(--text-secondary)',
                      backgroundColor: 'transparent',
                    }}
                    onMouseEnter={(e) => {
                      if (!active) {
                        e.currentTarget.style.backgroundColor = 'var(--accent-subtle)'
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent'
                    }}
                  >
                    <item.icon className="h-5 w-5 flex-shrink-0" />
                    <span className="truncate">{item.label}</span>
                  </Link>
                </li>
              )
            })}
          </ul>

          {/* Coming Soon */}
          <div className="mt-4 mb-2 px-4">
            <span
              className="text-xs font-medium uppercase tracking-wider"
              style={{ color: 'var(--text-muted)' }}
            >
              Coming Soon
            </span>
          </div>

          <ul className="space-y-0.5">
            {comingSoonModules.map((item) => (
              <li key={item.id}>
                <div
                  className="flex items-center gap-3 px-4 py-2 text-sm cursor-default"
                  style={{
                    borderLeft: '3px solid transparent',
                    color: 'var(--text-muted)',
                    opacity: 0.5,
                  }}
                >
                  <item.icon className="h-5 w-5 flex-shrink-0" />
                  <span className="truncate flex-1">{item.label}</span>
                  <Lock className="h-3.5 w-3.5 flex-shrink-0" />
                </div>
              </li>
            ))}
          </ul>
        </nav>

        {/* Footer */}
        <div
          className="flex-shrink-0 p-3 space-y-2"
          style={{ borderTop: '1px solid var(--border-default)' }}
        >
          <TokenMeter />
          <div className="flex items-center gap-2 px-1">
            <ConnectionDot />
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
              Realtime
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
