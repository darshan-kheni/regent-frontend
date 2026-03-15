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

export default function GDPRCompliancePage() {
  return (
    <div style={{ backgroundColor: 'var(--bg-primary)', minHeight: '100vh' }}>
      <LegalNav />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <p className="text-xs uppercase tracking-[0.15em] mb-4" style={{ color: 'var(--accent)' }}>
          Compliance
        </p>
        <h1 className="font-display text-3xl sm:text-4xl font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
          GDPR Compliance
        </h1>
        <p className="text-sm mb-12" style={{ color: 'var(--text-muted)' }}>
          Last updated: March 15, 2026
        </p>

        <div className="space-y-10" style={{ color: 'var(--text-secondary)' }}>
          <section>
            <h2 className="font-display text-xl font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
              1. Our Commitment
            </h2>
            <p className="text-sm leading-relaxed">
              Regent Technologies, Inc. is committed to protecting the privacy and rights of individuals in accordance with the General Data Protection Regulation (EU) 2016/679 (&quot;GDPR&quot;). This page outlines how we comply with GDPR requirements and how you can exercise your rights as a data subject. We apply these protections to all users, regardless of their location.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
              2. Legal Basis for Processing
            </h2>
            <p className="text-sm leading-relaxed mb-3">
              We process your personal data under the following legal bases as defined by Article 6 of the GDPR:
            </p>
            <ul className="text-sm leading-relaxed space-y-3 list-disc list-inside">
              <li><strong style={{ color: 'var(--text-primary)' }}>Contract performance (Art. 6(1)(b)):</strong> Processing necessary to provide the Regent AI assistant service you have subscribed to, including email syncing, AI categorization, summarization, draft generation, and behavior analytics.</li>
              <li><strong style={{ color: 'var(--text-primary)' }}>Legitimate interest (Art. 6(1)(f)):</strong> Processing necessary for service improvement, security monitoring, fraud prevention, and maintaining service reliability. We conduct balancing tests to ensure our interests do not override your rights.</li>
              <li><strong style={{ color: 'var(--text-primary)' }}>Consent (Art. 6(1)(a)):</strong> Processing based on your explicit consent, such as connecting additional email accounts or enabling optional notification channels. You may withdraw consent at any time.</li>
              <li><strong style={{ color: 'var(--text-primary)' }}>Legal obligation (Art. 6(1)(c)):</strong> Processing necessary to comply with tax, accounting, and regulatory requirements.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
              3. Data We Process
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm" style={{ borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-default)' }}>
                    <th className="text-left py-3 pr-4 font-semibold" style={{ color: 'var(--text-primary)' }}>Data Category</th>
                    <th className="text-left py-3 pr-4 font-semibold" style={{ color: 'var(--text-primary)' }}>Examples</th>
                    <th className="text-left py-3 font-semibold" style={{ color: 'var(--text-primary)' }}>Legal Basis</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    <td className="py-3 pr-4">Identity data</td>
                    <td className="py-3 pr-4">Name, email address</td>
                    <td className="py-3">Contract</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    <td className="py-3 pr-4">Authentication data</td>
                    <td className="py-3 pr-4">OAuth tokens, session tokens</td>
                    <td className="py-3">Contract</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    <td className="py-3 pr-4">Email data</td>
                    <td className="py-3 pr-4">Headers, bodies, threads, attachments</td>
                    <td className="py-3">Contract</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    <td className="py-3 pr-4">Credentials</td>
                    <td className="py-3 pr-4">IMAP passwords (AES-256-GCM encrypted)</td>
                    <td className="py-3">Contract</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    <td className="py-3 pr-4">AI-generated data</td>
                    <td className="py-3 pr-4">Summaries, drafts, categories, scores</td>
                    <td className="py-3">Contract</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    <td className="py-3 pr-4">Behavioral data</td>
                    <td className="py-3 pr-4">Communication patterns, preferences</td>
                    <td className="py-3">Consent / Legitimate interest</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    <td className="py-3 pr-4">Billing data</td>
                    <td className="py-3 pr-4">Stripe customer ID, invoices</td>
                    <td className="py-3">Contract / Legal obligation</td>
                  </tr>
                  <tr>
                    <td className="py-3 pr-4">Usage data</td>
                    <td className="py-3 pr-4">Token consumption, feature usage</td>
                    <td className="py-3">Legitimate interest</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
              4. Where Data is Stored
            </h2>
            <p className="text-sm leading-relaxed mb-3">
              Your data is stored in Supabase PostgreSQL, hosted on Amazon Web Services (AWS) in the <strong style={{ color: 'var(--text-primary)' }}>us-east-1</strong> region (N. Virginia, United States). This location applies to:
            </p>
            <ul className="text-sm leading-relaxed space-y-2 list-disc list-inside">
              <li>All email data, AI-generated content, and user profiles</li>
              <li>Encrypted credentials (AES-256-GCM)</li>
              <li>AI audit logs and usage records</li>
              <li>Vector embeddings for RAG retrieval</li>
            </ul>
            <p className="text-sm leading-relaxed mt-3">
              Redis (Upstash) is used for caching and job queuing only. No personally identifiable information is stored in Redis.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
              5. International Transfers
            </h2>
            <p className="text-sm leading-relaxed mb-3">
              As our infrastructure is hosted in the United States, personal data of EU/EEA residents is transferred to the US. We rely on the following mechanisms to ensure adequate protection:
            </p>
            <ul className="text-sm leading-relaxed space-y-2 list-disc list-inside">
              <li><strong style={{ color: 'var(--text-primary)' }}>EU-US Data Privacy Framework:</strong> Our infrastructure providers (AWS, Stripe) are certified under the EU-US Data Privacy Framework.</li>
              <li><strong style={{ color: 'var(--text-primary)' }}>Standard Contractual Clauses (SCCs):</strong> We maintain SCCs with all sub-processors that handle personal data of EU/EEA residents.</li>
              <li><strong style={{ color: 'var(--text-primary)' }}>Technical safeguards:</strong> AES-256-GCM encryption, TLS 1.3, and Row-Level Security ensure data protection regardless of storage location.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
              6. Your Rights Under GDPR
            </h2>
            <p className="text-sm leading-relaxed mb-4">
              As a data subject, you have the following rights under the GDPR. We honor these rights for all users, not just EU/EEA residents:
            </p>
            <div className="space-y-4">
              <div className="p-4" style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-default)' }}>
                <h3 className="font-display text-base font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>Right of Access (Art. 15)</h3>
                <p className="text-sm leading-relaxed">Request a complete copy of all personal data we process about you. Available via your account settings or by emailing us. We respond within 30 days.</p>
              </div>
              <div className="p-4" style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-default)' }}>
                <h3 className="font-display text-base font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>Right to Rectification (Art. 16)</h3>
                <p className="text-sm leading-relaxed">Request correction of inaccurate or incomplete personal data. You can update most information directly in your account settings.</p>
              </div>
              <div className="p-4" style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-default)' }}>
                <h3 className="font-display text-base font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>Right to Erasure (Art. 17)</h3>
                <p className="text-sm leading-relaxed">Request complete deletion of your account and all associated data. We process erasure requests within <strong style={{ color: 'var(--text-primary)' }}>72 hours</strong>. This includes all emails, AI-generated content, credentials, preferences, audit logs, and behavioral data. Deletion cascades through all related tables.</p>
              </div>
              <div className="p-4" style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-default)' }}>
                <h3 className="font-display text-base font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>Right to Restrict Processing (Art. 18)</h3>
                <p className="text-sm leading-relaxed">Request that we limit processing of your data while a complaint or correction is being resolved. We will pause AI processing for your account while maintaining data storage.</p>
              </div>
              <div className="p-4" style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-default)' }}>
                <h3 className="font-display text-base font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>Right to Data Portability (Art. 20)</h3>
                <p className="text-sm leading-relaxed">Receive your personal data in a structured, commonly used, machine-readable format (JSON). You can export your complete data set at any time from your account settings.</p>
              </div>
              <div className="p-4" style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-default)' }}>
                <h3 className="font-display text-base font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>Right to Object (Art. 21)</h3>
                <p className="text-sm leading-relaxed">Object to processing based on legitimate interest or for direct marketing purposes. We will cease the objected processing unless we demonstrate compelling legitimate grounds.</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
              7. Data Protection Officer
            </h2>
            <p className="text-sm leading-relaxed">
              Our Data Protection Officer can be contacted at <a href="mailto:dpo@regent.ai" style={{ color: 'var(--accent)' }}>dpo@regent.ai</a> for any questions or concerns regarding the processing of your personal data. You also have the right to lodge a complaint with your local supervisory authority.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
              8. Data Processing Agreements
            </h2>
            <p className="text-sm leading-relaxed mb-3">
              We maintain Data Processing Agreements (DPAs) with all sub-processors that handle personal data on our behalf. Our current sub-processors include:
            </p>
            <ul className="text-sm leading-relaxed space-y-2 list-disc list-inside">
              <li><strong style={{ color: 'var(--text-primary)' }}>Supabase</strong> -- Database hosting and authentication (AWS us-east-1)</li>
              <li><strong style={{ color: 'var(--text-primary)' }}>Stripe</strong> -- Payment processing</li>
              <li><strong style={{ color: 'var(--text-primary)' }}>Ollama Cloud</strong> -- AI inference (private infrastructure)</li>
              <li><strong style={{ color: 'var(--text-primary)' }}>Upstash</strong> -- Redis caching (no PII)</li>
              <li><strong style={{ color: 'var(--text-primary)' }}>Cloudflare</strong> -- CDN and security</li>
              <li><strong style={{ color: 'var(--text-primary)' }}>Twilio</strong> -- SMS notifications (if configured)</li>
            </ul>
            <p className="text-sm leading-relaxed mt-3">
              We will notify you before adding new sub-processors that handle personal data, giving you the opportunity to object.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
              9. Breach Notification
            </h2>
            <p className="text-sm leading-relaxed mb-3">
              In the event of a personal data breach that is likely to result in a risk to your rights and freedoms, we will:
            </p>
            <ul className="text-sm leading-relaxed space-y-2 list-disc list-inside">
              <li>Notify the relevant supervisory authority within <strong style={{ color: 'var(--text-primary)' }}>72 hours</strong> of becoming aware of the breach (Art. 33)</li>
              <li>Notify affected data subjects without undue delay if the breach is likely to result in a high risk to their rights and freedoms (Art. 34)</li>
              <li>Document the breach, its effects, and remedial actions taken</li>
              <li>Take immediate steps to contain and remediate the breach</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
              10. Automated Decision-Making
            </h2>
            <p className="text-sm leading-relaxed mb-3">
              Regent uses AI-powered automated processing for the following purposes:
            </p>
            <ul className="text-sm leading-relaxed space-y-2 list-disc list-inside">
              <li><strong style={{ color: 'var(--text-primary)' }}>Email categorization:</strong> Automated classification of emails into categories (work, personal, finance, urgent, etc.) using AI models</li>
              <li><strong style={{ color: 'var(--text-primary)' }}>Priority scoring:</strong> Automated assignment of priority levels to incoming emails</li>
              <li><strong style={{ color: 'var(--text-primary)' }}>Summarization:</strong> Automated generation of executive briefs from email content</li>
              <li><strong style={{ color: 'var(--text-primary)' }}>Draft reply generation:</strong> AI-suggested responses that require explicit user approval before sending</li>
              <li><strong style={{ color: 'var(--text-primary)' }}>Behavior analysis:</strong> Automated analysis of communication patterns and productivity metrics</li>
            </ul>
            <p className="text-sm leading-relaxed mt-3">
              None of these automated processes produce decisions that have legal or similarly significant effects on you. All AI-generated draft replies must be explicitly approved by you before any action is taken. Every AI decision is logged in our audit trail with full transparency, including the model used, confidence scores, and timestamps. You can review and contest any AI-generated output.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
              11. Data Retention Periods
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm" style={{ borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-default)' }}>
                    <th className="text-left py-3 pr-4 font-semibold" style={{ color: 'var(--text-primary)' }}>Data Type</th>
                    <th className="text-left py-3 pr-4 font-semibold" style={{ color: 'var(--text-primary)' }}>Retention Period</th>
                    <th className="text-left py-3 font-semibold" style={{ color: 'var(--text-primary)' }}>After Deletion</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    <td className="py-3 pr-4">Email data</td>
                    <td className="py-3 pr-4">While account is active</td>
                    <td className="py-3">72 hours</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    <td className="py-3 pr-4">AI-generated content</td>
                    <td className="py-3 pr-4">While account is active</td>
                    <td className="py-3">72 hours</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    <td className="py-3 pr-4">Encrypted credentials</td>
                    <td className="py-3 pr-4">While account is active</td>
                    <td className="py-3">72 hours</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    <td className="py-3 pr-4">AI audit logs</td>
                    <td className="py-3 pr-4">12 months (rolling)</td>
                    <td className="py-3">72 hours</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    <td className="py-3 pr-4">Billing records</td>
                    <td className="py-3 pr-4">24 months</td>
                    <td className="py-3">Retained for legal obligations</td>
                  </tr>
                  <tr>
                    <td className="py-3 pr-4">Backups</td>
                    <td className="py-3 pr-4">30 days</td>
                    <td className="py-3">30 days after deletion</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
              12. Cookie Policy
            </h2>
            <p className="text-sm leading-relaxed mb-3">
              Regent uses only essential cookies required for the Service to function:
            </p>
            <ul className="text-sm leading-relaxed space-y-2 list-disc list-inside">
              <li><strong style={{ color: 'var(--text-primary)' }}>Session cookies:</strong> HttpOnly, Secure, SameSite=Strict. Required for authentication.</li>
              <li><strong style={{ color: 'var(--text-primary)' }}>Theme preference:</strong> Local storage of your dark/light mode selection.</li>
            </ul>
            <p className="text-sm leading-relaxed mt-3">
              We do not use tracking cookies, advertising cookies, or third-party analytics. No cookie consent banner is required as we only use strictly necessary cookies (Recital 30, Art. 5(3) ePrivacy Directive).
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
              13. How to Exercise Your Rights
            </h2>
            <p className="text-sm leading-relaxed mb-3">
              You can exercise your GDPR rights through the following channels:
            </p>
            <ul className="text-sm leading-relaxed space-y-2 list-disc list-inside">
              <li><strong style={{ color: 'var(--text-primary)' }}>Self-service:</strong> Use the data management tools in your account settings to export data, delete your account, or modify your preferences.</li>
              <li><strong style={{ color: 'var(--text-primary)' }}>Email:</strong> Contact our Data Protection Officer at <a href="mailto:dpo@regent.ai" style={{ color: 'var(--accent)' }}>dpo@regent.ai</a></li>
              <li><strong style={{ color: 'var(--text-primary)' }}>Written request:</strong> Mail your request to our registered address.</li>
            </ul>
            <p className="text-sm leading-relaxed mt-3">
              We will respond to all requests within 30 days. If we need additional time (up to 60 additional days for complex requests), we will inform you within the initial 30-day period along with the reason for the delay.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
              14. Contact
            </h2>
            <p className="text-sm leading-relaxed">
              For GDPR-related inquiries or to exercise your rights:
            </p>
            <div className="mt-4 p-5" style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-default)' }}>
              <p className="text-sm leading-relaxed">
                <strong style={{ color: 'var(--text-primary)' }}>Regent Technologies, Inc.</strong><br />
                Data Protection Officer: <a href="mailto:dpo@regent.ai" style={{ color: 'var(--accent)' }}>dpo@regent.ai</a><br />
                Privacy inquiries: <a href="mailto:privacy@regent.ai" style={{ color: 'var(--accent)' }}>privacy@regent.ai</a><br />
                General support: <a href="mailto:support@regent.ai" style={{ color: 'var(--accent)' }}>support@regent.ai</a>
              </p>
            </div>
          </section>
        </div>
      </main>

      <LegalFooter />
    </div>
  )
}
