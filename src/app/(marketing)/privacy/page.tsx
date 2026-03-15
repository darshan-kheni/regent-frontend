'use client'

import Link from 'next/link'
import { useTheme } from 'next-themes'
import { useState, useEffect } from 'react'
import { Sun, Moon, Lock, Shield, Eye, ArrowLeft } from 'lucide-react'

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

export default function PrivacyPolicyPage() {
  return (
    <div style={{ backgroundColor: 'var(--bg-primary)', minHeight: '100vh' }}>
      <LegalNav />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <p className="text-xs uppercase tracking-[0.15em] mb-4" style={{ color: 'var(--accent)' }}>
          Legal
        </p>
        <h1 className="font-display text-3xl sm:text-4xl font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
          Privacy Policy
        </h1>
        <p className="text-sm mb-12" style={{ color: 'var(--text-muted)' }}>
          Last updated: March 15, 2026
        </p>

        <div className="space-y-10" style={{ color: 'var(--text-secondary)' }}>
          <section>
            <p className="text-sm leading-relaxed">
              Regent Technologies, Inc. (&quot;Regent,&quot; &quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) operates the Regent AI executive assistant platform. This Privacy Policy explains how we collect, use, store, and protect your personal information when you use our services.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
              1. What We Collect
            </h2>
            <h3 className="font-display text-base font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
              Account Information
            </h3>
            <p className="text-sm leading-relaxed mb-3">
              When you register, we collect your name, email address, and authentication credentials through Supabase Auth. If you sign in via Google or Microsoft OAuth, we receive your profile information and authorized scopes (including email access).
            </p>
            <h3 className="font-display text-base font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
              Email Data
            </h3>
            <p className="text-sm leading-relaxed mb-3">
              When you connect email accounts, we sync your emails via IMAP or Gmail API. This includes message headers (sender, recipient, subject, date), message bodies, thread information, and attachment metadata. We store this data in our database to provide AI-powered categorization, summarization, and draft reply generation.
            </p>
            <h3 className="font-display text-base font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
              IMAP Credentials
            </h3>
            <p className="text-sm leading-relaxed mb-3">
              If you connect via IMAP, we store your IMAP credentials (server, port, username, password). These credentials are encrypted using AES-256-GCM with per-tenant encryption keys derived via HKDF from a master key that is never stored in the database.
            </p>
            <h3 className="font-display text-base font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
              Usage Data
            </h3>
            <p className="text-sm leading-relaxed mb-3">
              We collect information about how you interact with Regent, including AI feature usage, token consumption, preference signals (e.g., when you approve or modify a draft reply), and platform activity logs.
            </p>
            <h3 className="font-display text-base font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
              Payment Information
            </h3>
            <p className="text-sm leading-relaxed">
              Billing is processed through Stripe. We do not store your credit card number, CVV, or full card details. We retain your Stripe customer ID, subscription status, and invoice history.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
              2. How We Use Your Data
            </h2>
            <ul className="text-sm leading-relaxed space-y-2 list-disc list-inside">
              <li>Providing the Regent AI assistant service, including email categorization, summarization, and draft reply generation</li>
              <li>Learning your communication preferences to improve AI accuracy over time</li>
              <li>Generating behavior intelligence reports (communication patterns, work-life balance, productivity metrics)</li>
              <li>Delivering private briefings via your configured notification channels</li>
              <li>Processing subscription payments and enforcing plan-based feature limits</li>
              <li>Monitoring service health, performance, and security</li>
              <li>Complying with legal obligations</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
              3. AI Processing
            </h2>
            <p className="text-sm leading-relaxed mb-3">
              Regent uses AI models to process your email content. This processing occurs on private infrastructure through Ollama Cloud, which is our primary AI provider. Your email data is <strong style={{ color: 'var(--text-primary)' }}>not sent to OpenAI, Google, or any third-party AI provider</strong> under normal operation. In rare fallback scenarios (if our primary infrastructure is unavailable), we may use Google Gemini Flash with minimal data.
            </p>
            <p className="text-sm leading-relaxed mb-3">
              AI processing includes:
            </p>
            <ul className="text-sm leading-relaxed space-y-2 list-disc list-inside">
              <li><strong style={{ color: 'var(--text-primary)' }}>Categorization</strong> -- classifying emails into categories (work, personal, finance, urgent, etc.)</li>
              <li><strong style={{ color: 'var(--text-primary)' }}>Summarization</strong> -- generating concise executive briefs of email content</li>
              <li><strong style={{ color: 'var(--text-primary)' }}>Draft Replies</strong> -- generating suggested responses based on your communication style</li>
              <li><strong style={{ color: 'var(--text-primary)' }}>Behavior Analysis</strong> -- identifying communication patterns, tone distribution, and productivity metrics</li>
            </ul>
            <p className="text-sm leading-relaxed mt-3">
              Every AI decision is logged in our AI audit log, including the model used, input/output token counts, confidence scores, and timestamps. You can review this audit trail within the platform.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
              4. Data Storage and Security
            </h2>
            <p className="text-sm leading-relaxed mb-3">
              Your data is stored in Supabase PostgreSQL, hosted on AWS infrastructure in the us-east-1 region.
            </p>
            <ul className="text-sm leading-relaxed space-y-2 list-disc list-inside">
              <li><strong style={{ color: 'var(--text-primary)' }}>Encryption at rest:</strong> All stored credentials (IMAP passwords, OAuth tokens) are encrypted with AES-256-GCM using per-tenant keys derived via HKDF</li>
              <li><strong style={{ color: 'var(--text-primary)' }}>Encryption in transit:</strong> All communications use TLS 1.3</li>
              <li><strong style={{ color: 'var(--text-primary)' }}>Multi-tenant isolation:</strong> PostgreSQL Row-Level Security (RLS) policies enforce strict data isolation between tenants. Every database query is scoped to your tenant, preventing cross-tenant data access at the database level</li>
              <li><strong style={{ color: 'var(--text-primary)' }}>Authentication:</strong> Supabase Auth with PKCE flow, JWT/JWKS validation, secure cookie handling (HttpOnly, Secure, SameSite=Strict)</li>
              <li><strong style={{ color: 'var(--text-primary)' }}>Master encryption key:</strong> Stored exclusively in environment variables, never in the database</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
              5. Third-Party Services
            </h2>
            <p className="text-sm leading-relaxed mb-3">
              We use the following third-party services to operate Regent:
            </p>
            <ul className="text-sm leading-relaxed space-y-3 list-disc list-inside">
              <li><strong style={{ color: 'var(--text-primary)' }}>Supabase</strong> -- Database hosting (PostgreSQL), authentication, and real-time subscriptions. Data is stored on AWS us-east-1.</li>
              <li><strong style={{ color: 'var(--text-primary)' }}>Stripe</strong> -- Payment processing. Stripe handles all credit card data directly; we never see or store your full card details.</li>
              <li><strong style={{ color: 'var(--text-primary)' }}>Ollama Cloud</strong> -- AI inference on private infrastructure. Email content is processed through Ollama Cloud models for categorization, summarization, and draft generation.</li>
              <li><strong style={{ color: 'var(--text-primary)' }}>Upstash (Redis)</strong> -- Caching and job queuing. No personally identifiable information (PII) is stored in Redis.</li>
              <li><strong style={{ color: 'var(--text-primary)' }}>Cloudflare</strong> -- CDN and DDoS protection.</li>
              <li><strong style={{ color: 'var(--text-primary)' }}>Twilio / WhatsApp / FCM</strong> -- Notification delivery for private briefings, if configured by you.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
              6. Data Retention
            </h2>
            <p className="text-sm leading-relaxed mb-3">
              We retain your data for as long as your account is active and as needed to provide our services. Specific retention periods:
            </p>
            <ul className="text-sm leading-relaxed space-y-2 list-disc list-inside">
              <li><strong style={{ color: 'var(--text-primary)' }}>Email data:</strong> Retained while your account is active. Deleted within 72 hours of account deletion.</li>
              <li><strong style={{ color: 'var(--text-primary)' }}>AI audit logs:</strong> Retained for 12 months (partitioned monthly), then automatically purged.</li>
              <li><strong style={{ color: 'var(--text-primary)' }}>Usage and billing data:</strong> Retained for 24 months for legal and accounting purposes.</li>
              <li><strong style={{ color: 'var(--text-primary)' }}>Backup data:</strong> Removed from all backups within 30 days of account deletion.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
              7. Your Rights
            </h2>
            <p className="text-sm leading-relaxed mb-3">
              You have the following rights regarding your personal data:
            </p>
            <ul className="text-sm leading-relaxed space-y-2 list-disc list-inside">
              <li><strong style={{ color: 'var(--text-primary)' }}>Access:</strong> Request a copy of all personal data we hold about you.</li>
              <li><strong style={{ color: 'var(--text-primary)' }}>Export:</strong> Download your complete data in a portable format (JSON) at any time from your account settings.</li>
              <li><strong style={{ color: 'var(--text-primary)' }}>Delete:</strong> Request complete deletion of your account and all associated data. We will process deletion requests within 72 hours.</li>
              <li><strong style={{ color: 'var(--text-primary)' }}>Restrict:</strong> Request that we limit how we process your data.</li>
              <li><strong style={{ color: 'var(--text-primary)' }}>Rectification:</strong> Request correction of inaccurate personal data.</li>
              <li><strong style={{ color: 'var(--text-primary)' }}>Object:</strong> Object to processing of your data for specific purposes.</li>
            </ul>
            <p className="text-sm leading-relaxed mt-3">
              To exercise any of these rights, contact us at <a href="mailto:privacy@regent.ai" style={{ color: 'var(--accent)' }}>privacy@regent.ai</a> or use the data management tools in your account settings.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
              8. Cookies
            </h2>
            <p className="text-sm leading-relaxed mb-3">
              Regent uses essential cookies required for authentication and session management. These cookies are:
            </p>
            <ul className="text-sm leading-relaxed space-y-2 list-disc list-inside">
              <li><strong style={{ color: 'var(--text-primary)' }}>Authentication cookies:</strong> HttpOnly, Secure, SameSite=Strict. Used to maintain your session.</li>
              <li><strong style={{ color: 'var(--text-primary)' }}>Theme preference:</strong> Stores your dark/light mode selection locally.</li>
            </ul>
            <p className="text-sm leading-relaxed mt-3">
              We do not use advertising cookies, tracking pixels, or third-party analytics cookies.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
              9. Children
            </h2>
            <p className="text-sm leading-relaxed">
              Regent is not intended for use by individuals under the age of 18. We do not knowingly collect personal information from children. If we become aware that we have collected data from a child under 18, we will delete that information promptly.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
              10. Changes to This Policy
            </h2>
            <p className="text-sm leading-relaxed">
              We may update this Privacy Policy from time to time. We will notify you of material changes by email or through a prominent notice on our platform at least 30 days before the changes take effect. Your continued use of Regent after the effective date constitutes acceptance of the updated policy.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
              11. Contact
            </h2>
            <p className="text-sm leading-relaxed">
              For questions about this Privacy Policy or to exercise your data rights, contact us at:
            </p>
            <div className="mt-4 p-5" style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-default)' }}>
              <p className="text-sm leading-relaxed">
                <strong style={{ color: 'var(--text-primary)' }}>Regent Technologies, Inc.</strong><br />
                Email: <a href="mailto:privacy@regent.ai" style={{ color: 'var(--accent)' }}>privacy@regent.ai</a><br />
                Data Protection Officer: <a href="mailto:dpo@regent.ai" style={{ color: 'var(--accent)' }}>dpo@regent.ai</a>
              </p>
            </div>
          </section>
        </div>
      </main>

      <LegalFooter />
    </div>
  )
}
