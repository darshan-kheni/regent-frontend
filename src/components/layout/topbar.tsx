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
  const setUser = useAuthStore((s) => s.setUser)
  const logout = useAuthStore((s) => s.logout)
  const [mounted, setMounted] = useState(false)

  // Load user profile from Supabase session + backend API
  useEffect(() => {
    setMounted(true)

    async function loadUser() {
      try {
        const supabase = createClient()
        const { data: { user: authUser } } = await supabase.auth.getUser()
        if (!authUser) return

        // Try to get profile with avatar from backend
        const res = await fetch('/api/v1/settings/profile', {
          headers: {
            'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
            'Content-Type': 'application/json',
          },
        })

        if (res.ok) {
          const json = await res.json()
          const profile = json.data || json
          setUser({
            id: authUser.id,
            email: authUser.email || '',
            name: profile.name || authUser.user_metadata?.full_name || authUser.email || '',
            avatar_url: profile.avatar_url || authUser.user_metadata?.avatar_url || null,
          })
        } else {
          // Fallback to Supabase metadata
          setUser({
            id: authUser.id,
            email: authUser.email || '',
            name: authUser.user_metadata?.full_name || authUser.email || '',
            avatar_url: authUser.user_metadata?.avatar_url || null,
          })
        }
      } catch {
        // Silently fail — user icon will show initials
      }
    }

    loadUser()
  }, [setUser])

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
