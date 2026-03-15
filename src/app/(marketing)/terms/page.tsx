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

export default function TermsOfServicePage() {
  return (
    <div style={{ backgroundColor: 'var(--bg-primary)', minHeight: '100vh' }}>
      <LegalNav />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <p className="text-xs uppercase tracking-[0.15em] mb-4" style={{ color: 'var(--accent)' }}>
          Legal
        </p>
        <h1 className="font-display text-3xl sm:text-4xl font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
          Terms of Service
        </h1>
        <p className="text-sm mb-12" style={{ color: 'var(--text-muted)' }}>
          Last updated: March 15, 2026
        </p>

        <div className="space-y-10" style={{ color: 'var(--text-secondary)' }}>
          <section>
            <h2 className="font-display text-xl font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
              1. Acceptance of Terms
            </h2>
            <p className="text-sm leading-relaxed">
              By accessing or using the Regent platform (&quot;Service&quot;) operated by Regent Technologies, Inc. (&quot;Regent,&quot; &quot;we,&quot; &quot;us,&quot; or &quot;our&quot;), you agree to be bound by these Terms of Service (&quot;Terms&quot;). If you do not agree to these Terms, do not use the Service. These Terms constitute a legally binding agreement between you and Regent Technologies, Inc.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
              2. Service Description
            </h2>
            <p className="text-sm leading-relaxed mb-3">
              Regent is an AI-powered executive assistant platform that connects to your email accounts and provides:
            </p>
            <ul className="text-sm leading-relaxed space-y-2 list-disc list-inside">
              <li>Automated email categorization, prioritization, and summarization</li>
              <li>AI-generated draft replies based on your communication style</li>
              <li>Behavior intelligence and productivity analytics</li>
              <li>Private briefings delivered via your preferred channels</li>
              <li>Additional modules including calendar intelligence, task extraction, contact management, travel orchestration, document vault, and expense tracking (availability varies by plan and development phase)</li>
            </ul>
            <p className="text-sm leading-relaxed mt-3">
              The Service operates as an always-on assistant, processing your emails 24/7 regardless of whether you are actively logged in.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
              3. Account Registration
            </h2>
            <p className="text-sm leading-relaxed mb-3">
              To use Regent, you must create an account. You may register using email/password or through Google or Microsoft OAuth. You agree to:
            </p>
            <ul className="text-sm leading-relaxed space-y-2 list-disc list-inside">
              <li>Provide accurate and complete registration information</li>
              <li>Maintain the security of your account credentials</li>
              <li>Notify us immediately of any unauthorized use of your account</li>
              <li>Be responsible for all activities that occur under your account</li>
            </ul>
            <p className="text-sm leading-relaxed mt-3">
              You must be at least 18 years old to create an account and use the Service.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
              4. Subscription and Billing
            </h2>
            <p className="text-sm leading-relaxed mb-3">
              Regent offers four subscription tiers:
            </p>
            <ul className="text-sm leading-relaxed space-y-2 list-disc list-inside">
              <li><strong style={{ color: 'var(--text-primary)' }}>Free</strong> -- 1 email account, 50K daily AI tokens, 10 AI drafts/day</li>
              <li><strong style={{ color: 'var(--text-primary)' }}>Attach&eacute;</strong> ($97/month) -- 10 email accounts, 500K daily tokens, unlimited drafts</li>
              <li><strong style={{ color: 'var(--text-primary)' }}>Privy Council</strong> ($297/month) -- 25 email accounts, 2M daily tokens, premium AI model access</li>
              <li><strong style={{ color: 'var(--text-primary)' }}>Estate</strong> ($697/month) -- Unlimited accounts and tokens, full premium access</li>
            </ul>
            <p className="text-sm leading-relaxed mt-3 mb-3">
              All paid subscriptions are billed monthly through Stripe. By subscribing, you authorize us to charge your payment method on a recurring monthly basis.
            </p>
            <h3 className="font-display text-base font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
              Cancellation
            </h3>
            <p className="text-sm leading-relaxed mb-3">
              You may cancel your subscription at any time through your account settings or the Stripe customer portal. Upon cancellation, your subscription remains active until the end of the current billing period. No refunds are provided for partial months.
            </p>
            <h3 className="font-display text-base font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
              Failed Payments
            </h3>
            <p className="text-sm leading-relaxed">
              If a payment fails, we will retry up to 3 times over a 7-day period. If all retries fail, your subscription will be suspended and your account will revert to the Free tier. Your data will be retained for 30 days, after which it may be deleted.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
              5. Acceptable Use
            </h2>
            <p className="text-sm leading-relaxed mb-3">
              You agree not to use the Service to:
            </p>
            <ul className="text-sm leading-relaxed space-y-2 list-disc list-inside">
              <li>Violate any applicable laws or regulations</li>
              <li>Send spam, phishing emails, or other unsolicited bulk communications</li>
              <li>Attempt to gain unauthorized access to other users&apos; data or accounts</li>
              <li>Interfere with or disrupt the Service or its infrastructure</li>
              <li>Reverse-engineer, decompile, or disassemble any part of the Service</li>
              <li>Use the Service to process data you do not have the right to access</li>
              <li>Resell or redistribute the Service without our written consent</li>
              <li>Circumvent usage limits, rate limits, or feature restrictions</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
              6. AI-Generated Content
            </h2>
            <p className="text-sm leading-relaxed mb-3">
              Regent generates AI content including email summaries, draft replies, behavior reports, and briefings. You acknowledge and agree that:
            </p>
            <ul className="text-sm leading-relaxed space-y-2 list-disc list-inside">
              <li><strong style={{ color: 'var(--text-primary)' }}>Draft replies require your approval:</strong> AI-generated draft replies are never sent automatically. You must explicitly review, edit (if desired), and approve each draft before it is sent from your email account.</li>
              <li><strong style={{ color: 'var(--text-primary)' }}>No guarantee of accuracy:</strong> AI-generated content may contain errors, inaccuracies, or inappropriate suggestions. You are solely responsible for reviewing all AI-generated content before acting on it.</li>
              <li><strong style={{ color: 'var(--text-primary)' }}>Not professional advice:</strong> AI-generated summaries, categorizations, and analytics do not constitute legal, financial, medical, or other professional advice.</li>
              <li><strong style={{ color: 'var(--text-primary)' }}>Continuous improvement:</strong> AI models may be updated, which could change the quality or style of generated content over time.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
              7. Data Ownership
            </h2>
            <p className="text-sm leading-relaxed mb-3">
              You retain full ownership of your email data, personal information, and any content you provide to the Service. By using Regent, you grant us a limited, non-exclusive license to process your data solely for the purpose of providing the Service.
            </p>
            <p className="text-sm leading-relaxed">
              We do not sell your data to third parties. We do not use your data to train general-purpose AI models. Your data is used exclusively to provide and improve your personal Regent experience.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
              8. Intellectual Property
            </h2>
            <p className="text-sm leading-relaxed">
              The Regent platform, including its software, algorithms, AI models, user interface, design, and documentation, is owned by Regent Technologies, Inc. and is protected by intellectual property laws. You may not copy, modify, distribute, or create derivative works of any part of the Service without our prior written consent.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
              9. Service Availability
            </h2>
            <p className="text-sm leading-relaxed mb-3">
              We target 99.9% uptime for the Regent platform. However, we do not guarantee uninterrupted access. The Service may be temporarily unavailable due to:
            </p>
            <ul className="text-sm leading-relaxed space-y-2 list-disc list-inside">
              <li>Scheduled maintenance (with advance notice when possible)</li>
              <li>Emergency maintenance to address security vulnerabilities</li>
              <li>Factors beyond our control (e.g., third-party service outages, natural disasters)</li>
            </ul>
            <p className="text-sm leading-relaxed mt-3">
              We will make reasonable efforts to notify you of planned maintenance and to restore service as quickly as possible during unplanned outages.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
              10. Limitation of Liability
            </h2>
            <p className="text-sm leading-relaxed mb-3">
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, REGENT TECHNOLOGIES, INC. SHALL NOT BE LIABLE FOR:
            </p>
            <ul className="text-sm leading-relaxed space-y-2 list-disc list-inside">
              <li>Any indirect, incidental, special, consequential, or punitive damages</li>
              <li>Loss of profits, data, business, or goodwill</li>
              <li>Damages arising from AI-generated content that you choose to send or act upon</li>
              <li>Damages resulting from unauthorized access to your account due to your failure to maintain credential security</li>
              <li>Service interruptions or data loss caused by third-party service providers</li>
            </ul>
            <p className="text-sm leading-relaxed mt-3">
              Our total aggregate liability for any claims arising from or related to these Terms or the Service shall not exceed the total amount you paid to Regent in the 12 months preceding the claim.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
              11. Termination
            </h2>
            <p className="text-sm leading-relaxed mb-3">
              You may terminate your account at any time by contacting us or using the account deletion feature in your settings. Upon termination:
            </p>
            <ul className="text-sm leading-relaxed space-y-2 list-disc list-inside">
              <li>Your subscription will be canceled at the end of the current billing period</li>
              <li>All your data will be deleted within 72 hours of your deletion request</li>
              <li>Any active IMAP connections will be immediately disconnected</li>
              <li>Background AI processing for your account will cease</li>
            </ul>
            <p className="text-sm leading-relaxed mt-3">
              We may suspend or terminate your account if you violate these Terms, with or without notice depending on the severity of the violation.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
              12. Governing Law
            </h2>
            <p className="text-sm leading-relaxed">
              These Terms shall be governed by and construed in accordance with the laws of the State of Delaware, United States, without regard to its conflict of law principles.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
              13. Dispute Resolution
            </h2>
            <p className="text-sm leading-relaxed mb-3">
              Any dispute arising from or relating to these Terms or the Service shall first be attempted to be resolved through good-faith negotiation. If negotiation fails, disputes shall be resolved through binding arbitration administered by the American Arbitration Association (AAA) in accordance with its Commercial Arbitration Rules.
            </p>
            <p className="text-sm leading-relaxed">
              You agree to waive your right to a jury trial and to participate in a class action lawsuit or class-wide arbitration.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
              14. Changes to These Terms
            </h2>
            <p className="text-sm leading-relaxed">
              We reserve the right to modify these Terms at any time. We will provide at least 30 days&apos; notice of material changes via email or a prominent notice within the Service. Your continued use of Regent after the effective date of the revised Terms constitutes acceptance of the changes.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
              15. Contact
            </h2>
            <p className="text-sm leading-relaxed">
              For questions about these Terms of Service, contact us at:
            </p>
            <div className="mt-4 p-5" style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-default)' }}>
              <p className="text-sm leading-relaxed">
                <strong style={{ color: 'var(--text-primary)' }}>Regent Technologies, Inc.</strong><br />
                Email: <a href="mailto:legal@regent.ai" style={{ color: 'var(--accent)' }}>legal@regent.ai</a><br />
                General Inquiries: <a href="mailto:support@regent.ai" style={{ color: 'var(--accent)' }}>support@regent.ai</a>
              </p>
            </div>
          </section>
        </div>
      </main>

      <LegalFooter />
    </div>
  )
}
