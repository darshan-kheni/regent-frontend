'use client'

import Link from 'next/link'
import { useTheme } from 'next-themes'
import { useState, useEffect } from 'react'
import {
  Sun,
  Moon,
  ArrowLeft,
  Shield,
  Lock,
  Eye,
  Database,
  Server,
  Key,
  FileCheck,
  Users,
  Brain,
  Globe,
  AlertTriangle,
  CheckCircle,
} from 'lucide-react'

function LegalNav() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  return (
    <nav
      className="sticky top-0 z-50"
      style={{
        backgroundColor: 'var(--bg-primary)',
        borderBottom: '1px solid var(--border-default)',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2.5">
            <div
              className="w-8 h-8 flex items-center justify-center"
              style={{ border: '1.5px solid var(--accent)' }}
            >
              <span
                className="font-display text-lg font-semibold leading-none"
                style={{ color: 'var(--accent)' }}
              >
                R
              </span>
            </div>
            <span
              className="font-display text-lg font-semibold tracking-wider"
              style={{ color: 'var(--accent)' }}
            >
              REGENT
            </span>
          </Link>
          <div className="flex items-center gap-4">
            {mounted && (
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="p-2 transition-colors"
                style={{ color: 'var(--text-muted)' }}
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>
            )}
            <Link
              href="/"
              className="flex items-center gap-1.5 text-sm transition-colors"
              style={{ color: 'var(--text-secondary)' }}
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}

function LegalFooter() {
  return (
    <footer style={{ backgroundColor: 'var(--bg-secondary)', borderTop: '1px solid var(--border-default)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div
              className="w-7 h-7 flex items-center justify-center"
              style={{ border: '1.5px solid var(--accent)' }}
            >
              <span
                className="font-display text-sm font-semibold leading-none"
                style={{ color: 'var(--accent)' }}
              >
                R
              </span>
            </div>
            <span
              className="font-display text-base font-semibold tracking-wider"
              style={{ color: 'var(--accent)' }}
            >
              REGENT
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--text-muted)' }}>
              <Lock className="w-3 h-3" />
              AES-256-GCM
            </span>
            <span className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--text-muted)' }}>
              <Shield className="w-3 h-3" />
              SOC 2
            </span>
            <span className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--text-muted)' }}>
              <Eye className="w-3 h-3" />
              GDPR
            </span>
          </div>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
            MMXXVI Regent Technologies, Inc. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

interface SecurityCardProps {
  icon: React.ReactNode
  title: string
  description: string
  details: string[]
}

function SecurityCard({ icon, title, description, details }: SecurityCardProps) {
  return (
    <div
      className="p-6 transition-all duration-200"
      style={{
        backgroundColor: 'var(--bg-card)',
        border: '1px solid var(--border-default)',
      }}
    >
      <div className="flex items-start gap-4">
        <div
          className="w-10 h-10 flex items-center justify-center shrink-0"
          style={{ backgroundColor: 'var(--accent-subtle)', border: '1px solid var(--border-subtle)' }}
        >
          <span style={{ color: 'var(--accent)' }}>{icon}</span>
        </div>
        <div className="flex-1">
          <h3 className="font-display text-lg font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
            {title}
          </h3>
          <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>
            {description}
          </p>
          <ul className="space-y-1.5">
            {details.map((detail, i) => (
              <li key={i} className="flex items-start gap-2 text-sm" style={{ color: 'var(--text-muted)' }}>
                <CheckCircle className="w-3.5 h-3.5 mt-0.5 shrink-0" style={{ color: 'var(--color-ok)' }} />
                {detail}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

const SECURITY_FEATURES: SecurityCardProps[] = [
  {
    icon: <Lock className="w-5 h-5" />,
    title: 'Encryption',
    description: 'Military-grade encryption protects your data at rest and in transit.',
    details: [
      'AES-256-GCM encryption for stored credentials (IMAP passwords, OAuth tokens)',
      'Per-tenant encryption keys derived via HKDF from a master key',
      'Master encryption key stored in environment variables, never in the database',
      'TLS 1.3 for all data in transit',
      'HSTS with preload for all web connections',
    ],
  },
  {
    icon: <Database className="w-5 h-5" />,
    title: 'Multi-Tenant Isolation',
    description: 'Database-level isolation ensures your data can never be accessed by other users.',
    details: [
      'PostgreSQL Row-Level Security (RLS) on every data table',
      'Compile-time TenantContext enforcement in backend code',
      'Every query scoped to your tenant at the database level',
      'Automated cross-tenant isolation tests in CI/CD',
      'Zero cross-tenant data leakage by architecture, not just convention',
    ],
  },
  {
    icon: <Key className="w-5 h-5" />,
    title: 'Authentication',
    description: 'Enterprise-grade authentication with multiple security layers.',
    details: [
      'Supabase Auth with Google and Microsoft OAuth support',
      'PKCE flow for secure authorization code exchange',
      'JWT/JWKS validation with 1-hour key cache rotation',
      '15-minute access tokens with 7-day single-use refresh tokens',
      'Rate limiting: 5 login attempts/min/IP, lockout after 10 failures',
      'Secure cookies: HttpOnly, Secure, SameSite=Strict',
    ],
  },
  {
    icon: <Brain className="w-5 h-5" />,
    title: 'AI Security',
    description: 'Your email data is processed on private infrastructure, never shared with third-party AI.',
    details: [
      'Ollama Cloud on private infrastructure (not OpenAI, not third-party)',
      'Email content never leaves controlled infrastructure',
      'AI models do not train on your data',
      'Content truncation: categorization uses first 500 chars, summarization uses 2,000',
      'Google Gemini Flash used only as rare fallback with minimal data',
    ],
  },
  {
    icon: <Server className="w-5 h-5" />,
    title: 'Infrastructure',
    description: 'Hardened infrastructure with multiple layers of protection.',
    details: [
      'Docker containers with distroless base images (minimal attack surface)',
      'CGO_ENABLED=0 for pure Go binaries with no C dependencies',
      'Cloudflare CDN for DDoS protection and edge security',
      'CSP headers and security headers on all responses',
      'Supabase-managed PostgreSQL with automatic patching',
      'Sub-20MB backend Docker images',
    ],
  },
  {
    icon: <Users className="w-5 h-5" />,
    title: 'Access Control',
    description: 'Fine-grained access controls and session management.',
    details: [
      'CSRF protection on all state-changing endpoints',
      'CORS configured per environment (no wildcard origins)',
      'Rate limiting on all public API endpoints',
      'Feature gating based on subscription tier',
      'PII redacted from all application logs',
    ],
  },
  {
    icon: <FileCheck className="w-5 h-5" />,
    title: 'Audit and Compliance',
    description: 'Complete audit trail and compliance with major regulatory frameworks.',
    details: [
      'SOC 2 Type I preparation in progress',
      'GDPR compliant with full data export and 72-hour deletion',
      'CCPA compliant',
      'AI audit log records every AI decision with model, tokens, confidence',
      'Authentication and admin event audit logging',
      'Dependency vulnerability scanning (Snyk/Dependabot)',
    ],
  },
  {
    icon: <Globe className="w-5 h-5" />,
    title: 'Data Sovereignty',
    description: 'Full control over your data with export and deletion capabilities.',
    details: [
      'Complete data export in JSON format at any time',
      'Account deletion within 72 hours of request',
      'ON DELETE CASCADE for complete data removal',
      'Backup data purged within 30 days of deletion',
      'No data lock-in: your data is always portable',
    ],
  },
]

export default function SecurityPage() {
  return (
    <div style={{ backgroundColor: 'var(--bg-primary)', minHeight: '100vh' }}>
      <LegalNav />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        {/* Hero */}
        <div className="text-center mb-16">
          <div
            className="inline-flex items-center justify-center w-16 h-16 mb-6"
            style={{ backgroundColor: 'var(--accent-subtle)', border: '1px solid var(--border-subtle)' }}
          >
            <Shield className="w-8 h-8" style={{ color: 'var(--accent)' }} />
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
            Security at Regent
          </h1>
          <p className="text-base max-w-2xl mx-auto leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            Your emails contain your most sensitive professional communications. We built Regent with security as a foundational requirement, not an afterthought.
          </p>
          <p className="text-sm mt-4" style={{ color: 'var(--text-muted)' }}>
            Last updated: March 15, 2026
          </p>
        </div>

        {/* Security Stats Bar */}
        <div
          className="grid grid-cols-2 sm:grid-cols-4 gap-px mb-16"
          style={{ backgroundColor: 'var(--border-default)' }}
        >
          {[
            { label: 'Encryption', value: 'AES-256-GCM' },
            { label: 'Transit', value: 'TLS 1.3' },
            { label: 'Isolation', value: 'RLS per tenant' },
            { label: 'Deletion', value: '72 hours' },
          ].map((stat) => (
            <div
              key={stat.label}
              className="p-5 text-center"
              style={{ backgroundColor: 'var(--bg-card)' }}
            >
              <p className="font-display text-lg font-semibold" style={{ color: 'var(--accent)' }}>
                {stat.value}
              </p>
              <p className="text-xs mt-1 uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        {/* Security Feature Cards */}
        <div className="space-y-4 mb-16">
          {SECURITY_FEATURES.map((feature) => (
            <SecurityCard key={feature.title} {...feature} />
          ))}
        </div>

        {/* Self-Host Section */}
        <div
          className="p-8 mb-16"
          style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-default)' }}
        >
          <div className="flex items-start gap-4">
            <Server className="w-6 h-6 shrink-0 mt-1" style={{ color: 'var(--accent)' }} />
            <div>
              <h2 className="font-display text-xl font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                Self-Host Option
              </h2>
              <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>
                For organizations with strict data residency requirements, Regent can be self-hosted on your own infrastructure. The Go backend compiles to a single binary under 20MB, deployable via Docker on any Linux server.
              </p>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                Contact us at <a href="mailto:enterprise@regent.ai" style={{ color: 'var(--accent)' }}>enterprise@regent.ai</a> for self-hosted deployment options.
              </p>
            </div>
          </div>
        </div>

        {/* Vulnerability Reporting */}
        <div
          className="p-8"
          style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-default)' }}
        >
          <div className="flex items-start gap-4">
            <AlertTriangle className="w-6 h-6 shrink-0 mt-1" style={{ color: 'var(--accent)' }} />
            <div>
              <h2 className="font-display text-xl font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                Vulnerability Reporting
              </h2>
              <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>
                We take security vulnerabilities seriously. If you discover a security issue, please report it responsibly.
              </p>
              <ul className="text-sm leading-relaxed space-y-2" style={{ color: 'var(--text-secondary)' }}>
                <li><strong style={{ color: 'var(--text-primary)' }}>Email:</strong> <a href="mailto:security@regent.ai" style={{ color: 'var(--accent)' }}>security@regent.ai</a></li>
                <li><strong style={{ color: 'var(--text-primary)' }}>Response time:</strong> We acknowledge reports within 24 hours and provide an initial assessment within 72 hours.</li>
                <li><strong style={{ color: 'var(--text-primary)' }}>Scope:</strong> All Regent services, APIs, and infrastructure are in scope.</li>
                <li><strong style={{ color: 'var(--text-primary)' }}>Policy:</strong> We will not take legal action against researchers who report vulnerabilities in good faith and follow responsible disclosure practices.</li>
              </ul>
            </div>
          </div>
        </div>
      </main>

      <LegalFooter />
    </div>
  )
}
