'use client'

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
  Activity,
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
  ChevronLeft,
  ChevronRight,
  Lock,
  ListFilter,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { useUIStore } from '@/stores/ui-store'
import { Tooltip } from '@/components/ui'
import { TokenMeter } from './token-meter'
import { ConnectionDot } from './connection-dot'
import { PipelineStatus } from './pipeline-status'

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
  { id: 'dashboard', label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { id: 'inbox', label: 'Inbox', href: '/inbox', icon: Mail },
  { id: 'summaries', label: 'Summaries', href: '/summaries', icon: ListFilter },
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

export function Sidebar() {
  const pathname = usePathname()
  const collapsed = useUIStore((s) => s.sidebarCollapsed)
  const toggleSidebar = useUIStore((s) => s.toggleSidebar)

  function isActive(href: string): boolean {
    if (href === '/dashboard') return pathname === '/dashboard'
    return pathname.startsWith(href)
  }

  return (
    <aside
      className="hidden md:flex flex-col flex-shrink-0 h-screen sticky top-0"
      style={{
        width: collapsed ? 64 : 260,
        transition: 'width 200ms var(--ease-luxury, cubic-bezier(0.4, 0, 0.2, 1))',
        backgroundColor: 'var(--bg-sidebar)',
        borderRight: '1px solid var(--border-default)',
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between h-14 px-4 flex-shrink-0">
        <span
          className="font-display font-semibold text-lg tracking-wide select-none"
          style={{ color: 'var(--accent)' }}
        >
          {collapsed ? 'R' : 'REGENT'}
        </span>
        <button
          type="button"
          onClick={toggleSidebar}
          className="p-1 transition-colors"
          style={{ color: 'var(--text-muted)' }}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-2">
        {/* Active Modules */}
        <ul className="space-y-0.5">
          {activeModules.map((item) => {
            const active = isActive(item.href)
            const linkContent = (
              <Link
                href={item.href}
                className="flex items-center gap-3 px-4 py-2 text-sm transition-colors"
                style={{
                  borderLeft: active ? '3px solid var(--accent)' : '3px solid transparent',
                  color: active ? 'var(--accent)' : 'var(--text-secondary)',
                  backgroundColor: 'transparent',
                  paddingLeft: collapsed ? 18 : undefined,
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
                {!collapsed && <span className="truncate">{item.label}</span>}
              </Link>
            )

            return (
              <li key={item.id}>
                {collapsed ? (
                  <Tooltip content={item.label} placement="right">
                    {linkContent}
                  </Tooltip>
                ) : (
                  linkContent
                )}
              </li>
            )
          })}
        </ul>

        {/* Coming Soon Divider */}
        <div className="mt-4 mb-2 px-4">
          {!collapsed && (
            <span
              className="text-xs font-medium uppercase tracking-wider"
              style={{ color: 'var(--text-muted)' }}
            >
              Coming Soon
            </span>
          )}
          {collapsed && (
            <div className="w-full h-px" style={{ backgroundColor: 'var(--border-default)' }} />
          )}
        </div>

        {/* Coming Soon Modules */}
        <ul className="space-y-0.5">
          {comingSoonModules.map((item) => {
            const content = (
              <div
                className="flex items-center gap-3 px-4 py-2 text-sm cursor-default"
                style={{
                  borderLeft: '3px solid transparent',
                  color: 'var(--text-muted)',
                  opacity: 0.5,
                  paddingLeft: collapsed ? 18 : undefined,
                }}
              >
                <item.icon className="h-5 w-5 flex-shrink-0" />
                {!collapsed && (
                  <>
                    <span className="truncate flex-1">{item.label}</span>
                    <Lock className="h-3.5 w-3.5 flex-shrink-0" />
                  </>
                )}
              </div>
            )

            return (
              <li key={item.id}>
                <Tooltip content="Coming in a future update" placement="right">
                  {content}
                </Tooltip>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div
        className="flex-shrink-0 p-3 space-y-2"
        style={{ borderTop: '1px solid var(--border-default)' }}
      >
        {!collapsed && <PipelineStatus />}
        {!collapsed && <TokenMeter />}
        <div className="flex items-center gap-2 px-1">
          <ConnectionDot />
          {!collapsed && (
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
              Realtime
            </span>
          )}
        </div>
      </div>
    </aside>
  )
}
