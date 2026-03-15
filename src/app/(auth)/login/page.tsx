'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const supabase = createClient()
      const { error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (authError) {
        setError(authError.message)
        return
      }

      router.push('/dashboard')
      router.refresh()
    } catch {
      setError('Unable to connect. Check your internet connection.')
    } finally {
      setLoading(false)
    }
  }

  const handleOAuth = async (provider: 'google' | 'azure') => {
    const supabase = createClient()
    await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/callback`,
      },
    })
  }

  return (
    <div
      className="flex min-h-screen items-center justify-center"
      style={{ backgroundColor: '#020202' }}
    >
      <div
        className="w-full max-w-md p-8"
        style={{
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border-default)',
        }}
      >
        {/* Logo */}
        <h1
          className="font-display text-3xl text-center mb-8"
          style={{ color: 'var(--accent)' }}
        >
          Regent
        </h1>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label
              className="block text-sm mb-1"
              style={{ color: 'var(--text-secondary)' }}
            >
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 text-sm outline-none transition-colors"
              style={{
                backgroundColor: 'var(--bg-elevated)',
                border: '1px solid var(--border-default)',
                color: 'var(--text-primary)',
              }}
              onFocus={(e) => e.target.style.borderColor = 'var(--border-focus)'}
              onBlur={(e) => e.target.style.borderColor = 'var(--border-default)'}
            />
          </div>

          <div>
            <label
              className="block text-sm mb-1"
              style={{ color: 'var(--text-secondary)' }}
            >
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2 text-sm outline-none transition-colors"
              style={{
                backgroundColor: 'var(--bg-elevated)',
                border: '1px solid var(--border-default)',
                color: 'var(--text-primary)',
              }}
              onFocus={(e) => e.target.style.borderColor = 'var(--border-focus)'}
              onBlur={(e) => e.target.style.borderColor = 'var(--border-default)'}
            />
          </div>

          {error && (
            <p className="text-sm" style={{ color: 'var(--color-critical)' }}>
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 font-medium text-sm transition-colors disabled:opacity-50"
            style={{
              backgroundColor: 'var(--btn-primary-bg)',
              color: 'var(--btn-primary-text)',
            }}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center my-6">
          <div className="flex-1 h-px" style={{ backgroundColor: 'var(--border-default)' }} />
          <span className="px-3 text-xs" style={{ color: 'var(--text-muted)' }}>
            or continue with
          </span>
          <div className="flex-1 h-px" style={{ backgroundColor: 'var(--border-default)' }} />
        </div>

        {/* OAuth Buttons */}
        <div className="space-y-3">
          <button
            onClick={() => handleOAuth('google')}
            className="w-full py-2 text-sm font-medium flex items-center justify-center gap-2"
            style={{
              backgroundColor: '#ffffff',
              color: '#1a1714',
              border: '1px solid #e0e0e0',
            }}
          >
            Google
          </button>
          <button
            onClick={() => handleOAuth('azure')}
            className="w-full py-2 text-sm font-medium flex items-center justify-center gap-2"
            style={{
              backgroundColor: '#ffffff',
              color: '#1a1714',
              border: '1px solid #e0e0e0',
            }}
          >
            Microsoft
          </button>
        </div>

        {/* Links */}
        <div className="mt-6 text-center space-y-2">
          <a href="#" className="block text-xs" style={{ color: 'var(--text-muted)' }}>
            Forgot password?
          </a>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
            Don&apos;t have an account?{' '}
            <a href="#" style={{ color: 'var(--accent)' }}>
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
