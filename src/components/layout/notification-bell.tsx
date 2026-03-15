'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { Bell } from 'lucide-react'
import { useRealtimeSubscription } from '@/hooks/use-realtime'
import { api } from '@/lib/api'

interface NotificationRecord {
  id: string
  title?: string
  message?: string
  created_at?: string
}

export function NotificationBell() {
  const [unreadCount, setUnreadCount] = useState(0)
  const [open, setOpen] = useState(false)
  const [notifications, setNotifications] = useState<NotificationRecord[]>([])
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    async function load() {
      try {
        const data = await api.get<{ items: NotificationRecord[]; unread_count: number }>('/notifications?limit=10')
        if (data) {
          setNotifications(data.items ?? [])
          setUnreadCount(data.unread_count ?? 0)
        }
      } catch {
        // API may not exist yet, realtime will still work
      }
    }
    load()
  }, [])

  const handleInsert = useCallback((payload: NotificationRecord) => {
    setUnreadCount((prev) => prev + 1)
    setNotifications((prev) => [payload, ...prev].slice(0, 10))
  }, [])

  useRealtimeSubscription<NotificationRecord>({
    table: 'notification_log',
    event: 'INSERT',
    onInsert: handleInsert,
  })

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  function handleToggle() {
    setOpen((prev) => !prev)
    if (!open) {
      setUnreadCount(0)
    }
  }

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={handleToggle}
        className="relative p-2 transition-colors"
        style={{ color: 'var(--text-secondary)' }}
        aria-label={`Notifications${unreadCount > 0 ? `, ${unreadCount} unread` : ''}`}
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span
            className="absolute top-1 right-1 flex items-center justify-center min-w-[16px] h-4 px-1 text-[10px] font-bold leading-none text-white"
            style={{
              borderRadius: 9999,
              backgroundColor: 'var(--color-critical, #D4645D)',
            }}
          >
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div
          className="absolute right-0 mt-1 w-72 z-50 py-2"
          style={{
            borderRadius: 0,
            backgroundColor: 'var(--bg-elevated)',
            border: '1px solid var(--border-default)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          }}
        >
          <div
            className="px-3 py-2 text-xs font-medium uppercase tracking-wider"
            style={{ color: 'var(--text-muted)', borderBottom: '1px solid var(--border-default)' }}
          >
            Notifications
          </div>
          {notifications.length === 0 ? (
            <div className="px-3 py-6 text-center text-sm" style={{ color: 'var(--text-muted)' }}>
              No new notifications
            </div>
          ) : (
            <div className="max-h-64 overflow-y-auto">
              {notifications.map((n) => (
                <div
                  key={n.id}
                  className="px-3 py-2 text-sm transition-colors cursor-pointer"
                  style={{ color: 'var(--text-primary)' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--accent-subtle)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent'
                  }}
                >
                  {n.title || n.message || 'New notification'}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
