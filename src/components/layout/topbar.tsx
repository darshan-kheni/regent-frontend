'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Menu, Sun, Moon, User, Settings, LogOut } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useUIStore } from '@/stores/ui-store'
import { useAuthStore } from '@/stores/auth-store'
import { createClient } from '@/lib/supabase/client'
import { Avatar, Dropdown } from '@/components/ui'
import { GlobalSearch } from './global-search'
import { NotificationBell } from './notification-bell'

export function Topbar() {
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  const setMobileDrawerOpen = useUIStore((s) => s.setMobileDrawerOpen)
  const user = useAuthStore((s) => s.user)
  const logout = useAuthStore((s) => s.logout)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    logout()
    router.push('/login')
  }

  function toggleTheme() {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  const userMenuItems = [
    {
      label: 'Profile',
      icon: <User className="h-4 w-4" />,
      onClick: () => router.push('/settings'),
    },
    {
      label: 'Settings',
      icon: <Settings className="h-4 w-4" />,
      onClick: () => router.push('/settings'),
    },
    {
      label: 'Logout',
      icon: <LogOut className="h-4 w-4" />,
      onClick: handleLogout,
      danger: true,
    },
  ]

  return (
    <header
      className="flex items-center justify-between h-14 px-4 flex-shrink-0"
      style={{
        backgroundColor: 'var(--bg-elevated)',
        borderBottom: '1px solid var(--border-default)',
      }}
    >
      {/* Left side */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          className="p-2 md:hidden transition-colors"
          style={{ color: 'var(--text-secondary)' }}
          onClick={() => setMobileDrawerOpen(true)}
          aria-label="Open navigation menu"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-2">
        <div className="hidden sm:block w-64">
          <GlobalSearch />
        </div>

        <NotificationBell />

        <button
          type="button"
          onClick={toggleTheme}
          className="p-2 transition-colors"
          style={{ color: 'var(--text-secondary)' }}
          aria-label={mounted ? (theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode') : 'Toggle theme'}
        >
          {mounted ? (
            theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />
          ) : (
            <Sun className="h-5 w-5" style={{ visibility: 'hidden' }} />
          )}
        </button>

        <Dropdown
          trigger={
            <Avatar
              name={user?.name || 'User'}
              src={user?.avatar_url}
              size="sm"
            />
          }
          items={userMenuItems}
          align="right"
        />
      </div>
    </header>
  )
}
