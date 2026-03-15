'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import { useTheme } from 'next-themes'
import {
  Sun,
  Moon,
  Mail,
  CalendarDays,
  CheckSquare,
  Plane,
  Users,
  FileText,
  Receipt,
  Brain,
  Bell,
  Activity,
  Shield,
  ChevronDown,
  Clock,
  Zap,
  Eye,
  BarChart3,
  Heart,
  MessageSquare,
  TrendingUp,
  Server,
  Lock,
  Check,
  X,
  Sparkles,
  ArrowRight,
  Menu,
} from 'lucide-react'

// ─── Types ───

interface FeatureModule {
  icon: React.ReactNode
  title: string
  description: string
  plan: string
  phase: string
}

interface PricingTier {
  name: string
  price: string
  period: string
  description: string
  features: string[]
  metrics: { label: string; value: string }[]
  cta: string
  recommended?: boolean
  comingSoon?: boolean
}

interface FAQItem {
  question: string
  answer: string
}

// ─── Data ───

const FEATURES: FeatureModule[] = [
  {
    icon: <Mail className="w-6 h-6" />,
    title: 'Email Intelligence',
    description: 'AI categorization, executive summaries, and draft replies across all your accounts. Every email processed in under 3 seconds.',
    plan: 'Free+',
    phase: 'Live',
  },
  {
    icon: <Brain className="w-6 h-6" />,
    title: 'AI Memory',
    description: 'Custom rules, context briefs, and learned behavior patterns. Regent remembers your preferences and adapts over time.',
    plan: 'Free+',
    phase: 'Live',
  },
  {
    icon: <Activity className="w-6 h-6" />,
    title: 'Behavior Intelligence',
    description: 'Work-life balance scoring, stress detection, communication profiling, and relationship intelligence.',
    plan: 'Attache+',
    phase: 'Live',
  },
  {
    icon: <Bell className="w-6 h-6" />,
    title: 'Private Briefings',
    description: 'Multi-channel notifications via SMS, WhatsApp, Signal, and push. Priority-based routing ensures you never miss what matters.',
    plan: 'Free+',
    phase: 'Live',
  },
  {
    icon: <BarChart3 className="w-6 h-6" />,
    title: 'Analytics & Audit',
    description: 'Token usage tracking, AI decision audit trails, and performance analytics with CSV/PDF export.',
    plan: 'Free+',
    phase: 'Live',
  },
  {
    icon: <Sparkles className="w-6 h-6" />,
    title: 'AI Compose',
    description: 'Draft emails from scratch with AI assistance. Context-aware composition using your communication style.',
    plan: 'Free+',
    phase: 'Live',
  },
  {
    icon: <CalendarDays className="w-6 h-6" />,
    title: 'Calendar Intelligence',
    description: 'Cross-calendar conflict detection, smart scheduling suggestions, and automated meeting prep briefs.',
    plan: 'Attache+',
    phase: 'Phase 2',
  },
  {
    icon: <CheckSquare className="w-6 h-6" />,
    title: 'Task Extraction',
    description: 'AI detects action items from your emails. Kanban board with deadline parsing and delegation tracking.',
    plan: 'Attache+',
    phase: 'Phase 2',
  },
  {
    icon: <Users className="w-6 h-6" />,
    title: 'Contact Intelligence',
    description: 'Auto-populated CRM from email interactions. Relationship scoring with last-touch alerts for VIP contacts.',
    plan: 'Attache+',
    phase: 'Phase 3',
  },
  {
    icon: <Plane className="w-6 h-6" />,
    title: 'Travel Orchestration',
    description: 'Unified itineraries from booking emails. Real-time disruption alerts and pre-trip intelligence briefs.',
    plan: 'Privy Council+',
    phase: 'Phase 3',
  },
  {
    icon: <FileText className="w-6 h-6" />,
    title: 'Document Vault',
    description: 'Automatic attachment filing with AI categorization. Full-text search with OCR for scanned documents.',
    plan: 'Attache+',
    phase: 'Phase 4',
  },
  {
    icon: <Receipt className="w-6 h-6" />,
    title: 'Expense Tracking',
    description: 'Receipt detection and amount extraction from emails. Auto-categorized monthly reports with multi-currency support.',
    plan: 'Attache+',
    phase: 'Phase 4',
  },
]

const PRICING: PricingTier[] = [
  {
    name: 'Free',
    price: '$0',
    period: '/month',
    description: 'Experience AI email intelligence with one account.',
    features: [
      '1 email account',
      '50K daily AI tokens',
      '10 AI drafts per day',
      '10 AI Memory rules',
      '3 context briefs',
      'Standard draft model',
    ],
    metrics: [
      { label: 'Accounts', value: '1' },
      { label: 'Daily Tokens', value: '50K' },
      { label: 'AI Drafts', value: '10/day' },
    ],
    cta: 'Start Free',
  },
  {
    name: 'Attache',
    price: '$97',
    period: '/month',
    description: 'For professionals managing multiple inboxes.',
    features: [
      '10 email accounts',
      '500K daily AI tokens',
      'Unlimited AI drafts',
      '25 AI Memory rules',
      '10 context briefs',
      '20 premium drafts/month',
      'Basic Behavior Intelligence',
    ],
    metrics: [
      { label: 'Accounts', value: '10' },
      { label: 'Daily Tokens', value: '500K' },
      { label: 'AI Drafts', value: 'Unlimited' },
    ],
    cta: 'Start Trial',
  },
  {
    name: 'Privy Council',
    price: '$297',
    period: '/month',
    description: 'Full executive intelligence suite with premium AI.',
    features: [
      '25 email accounts',
      '2M daily AI tokens',
      'Unlimited AI drafts',
      '50 AI Memory rules',
      '25 context briefs',
      '200 premium drafts/month',
      'Full Behavior Intelligence',
      'Wellness monitoring',
      'Premium AI model access',
    ],
    metrics: [
      { label: 'Accounts', value: '25' },
      { label: 'Daily Tokens', value: '2M' },
      { label: 'Premium Drafts', value: '200/mo' },
    ],
    cta: 'Start Trial',
    recommended: true,
  },
  {
    name: 'Estate',
    price: '$697',
    period: '/month',
    description: 'Unlimited everything. For those who demand the best.',
    features: [
      'Unlimited email accounts',
      'Unlimited daily AI tokens',
      'Unlimited AI drafts',
      'Unlimited AI Memory rules',
      'Unlimited context briefs',
      'Unlimited premium drafts',
      'Full Intelligence + Coaching',
      'Priority support',
      'Custom AI model tuning',
    ],
    metrics: [
      { label: 'Accounts', value: 'Unlimited' },
      { label: 'Daily Tokens', value: 'Unlimited' },
      { label: 'Premium Drafts', value: 'Unlimited' },
    ],
    cta: 'Start Trial',
  },
]

const FAQ_ITEMS: FAQItem[] = [
  {
    question: 'How does Regent access my email?',
    answer: 'Regent connects via OAuth (Google, Microsoft) or IMAP with encrypted credentials. Your email credentials are encrypted with AES-256-GCM using per-tenant encryption keys. We never store plaintext passwords. All connections use TLS 1.3.',
  },
  {
    question: 'Is my data private? Can Regent employees read my emails?',
    answer: 'Your data is isolated via PostgreSQL Row-Level Security policies. Each tenant operates in a cryptographically separated environment. No Regent employee can access your email content. All AI processing uses our private infrastructure with no data sent to third-party AI providers.',
  },
  {
    question: 'What happens if I cancel my subscription?',
    answer: 'You can export all your data at any time. Upon cancellation, your account downgrades to the Free tier. If you choose to delete your account, all data is permanently removed within 72 hours per GDPR compliance, including all AI-generated content, embeddings, and audit logs.',
  },
  {
    question: 'How accurate is the AI categorization?',
    answer: 'Our multi-model pipeline achieves 94%+ accuracy on email categorization using purpose-built models. The system continuously learns from your corrections via preference signals, improving accuracy over time for your specific communication patterns.',
  },
  {
    question: 'Can I use Regent with multiple email providers?',
    answer: 'Yes. Regent supports Gmail (via OAuth + API), Outlook/Microsoft 365 (via OAuth), and any IMAP-compatible email provider. All accounts are unified in a single inbox with cross-account search and intelligence.',
  },
  {
    question: 'What makes Regent different from other AI email tools?',
    answer: 'Regent is an always-on executive assistant, not a browser extension. It processes your email 24/7 on our servers, independent of your login state. When you open Regent, everything is already categorized, summarized, and drafted. Most AI email tools require you to be actively using them.',
  },
]

const COMPARISON_ROWS = [
  { feature: 'Availability', regent: '24/7/365', human: '40 hrs/week' },
  { feature: 'Email Processing', regent: '<3 seconds', human: '5-15 minutes' },
  { feature: 'Annual Cost', regent: '$0 - $8,364', human: '$78,000 - $120,000' },
  { feature: 'Sick Days', regent: 'None', human: '8-12 per year' },
  { feature: 'Vacation', regent: 'Never', human: '15-20 days' },
  { feature: 'Learning Curve', regent: 'Instant', human: '3-6 months' },
  { feature: 'Multi-language', regent: '100+ languages', human: '1-3 languages' },
  { feature: 'Scales With You', regent: 'Unlimited', human: 'Hire another' },
]

// ─── Scroll Animation Hook ───

function useScrollReveal() {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.unobserve(el)
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return { ref, visible }
}

function RevealSection({
  children,
  className = '',
  delay = 0,
}: {
  children: React.ReactNode
  className?: string
  delay?: number
}) {
  const { ref, visible } = useScrollReveal()
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(24px)',
        transition: `opacity 0.7s cubic-bezier(0.25, 0.1, 0.25, 1) ${delay}ms, transform 0.7s cubic-bezier(0.25, 0.1, 0.25, 1) ${delay}ms`,
      }}
    >
      {children}
    </div>
  )
}

// ─── Components ───

function NavBar() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [servicesOpen, setServicesOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setServicesOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const serviceItems = [
    { icon: <Mail className="w-4 h-4" />, label: 'Email Intelligence', live: true },
    { icon: <Brain className="w-4 h-4" />, label: 'AI Memory', live: true },
    { icon: <Activity className="w-4 h-4" />, label: 'Behavior Intelligence', live: true },
    { icon: <Bell className="w-4 h-4" />, label: 'Private Briefings', live: true },
    { icon: <BarChart3 className="w-4 h-4" />, label: 'Analytics', live: true },
    { icon: <Sparkles className="w-4 h-4" />, label: 'AI Compose', live: true },
    { icon: <CalendarDays className="w-4 h-4" />, label: 'Calendar', live: false },
    { icon: <CheckSquare className="w-4 h-4" />, label: 'Tasks', live: false },
    { icon: <Users className="w-4 h-4" />, label: 'Contacts', live: false },
    { icon: <Plane className="w-4 h-4" />, label: 'Travel', live: false },
    { icon: <FileText className="w-4 h-4" />, label: 'Documents', live: false },
  ]

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        backgroundColor: scrolled ? 'var(--bg-primary)' : 'transparent',
        borderBottom: scrolled ? '1px solid var(--border-default)' : '1px solid transparent',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
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

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            {/* Services Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setServicesOpen(!servicesOpen)}
                className="flex items-center gap-1 text-sm transition-colors"
                style={{ color: 'var(--text-secondary)' }}
                onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--text-primary)' }}
                onMouseLeave={(e) => { if (!servicesOpen) e.currentTarget.style.color = 'var(--text-secondary)' }}
              >
                Services
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${servicesOpen ? 'rotate-180' : ''}`} />
              </button>

              {servicesOpen && (
                <div
                  className="absolute top-full left-0 mt-2 w-64 py-2 z-50"
                  style={{
                    backgroundColor: 'var(--bg-elevated)',
                    border: '1px solid var(--border-default)',
                    boxShadow: 'var(--shadow-lg)',
                  }}
                >
                  {serviceItems.map((item) => (
                    <div
                      key={item.label}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm"
                      style={{ color: item.live ? 'var(--text-primary)' : 'var(--text-muted)' }}
                    >
                      <span style={{ color: item.live ? 'var(--accent)' : 'var(--text-muted)' }}>
                        {item.icon}
                      </span>
                      <span className="flex-1">{item.label}</span>
                      {item.live ? (
                        <span
                          className="text-[10px] font-medium uppercase tracking-wider px-1.5 py-0.5"
                          style={{
                            color: 'var(--color-ok)',
                            backgroundColor: 'rgba(111, 173, 118, 0.1)',
                          }}
                        >
                          Live
                        </span>
                      ) : (
                        <span
                          className="text-[10px] font-medium uppercase tracking-wider px-1.5 py-0.5"
                          style={{
                            color: 'var(--text-muted)',
                            backgroundColor: 'var(--accent-subtle)',
                          }}
                        >
                          Soon
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <a
              href="#pricing"
              className="text-sm transition-colors"
              style={{ color: 'var(--text-secondary)' }}
              onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--text-primary)' }}
              onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-secondary)' }}
            >
              Pricing
            </a>

            <a
              href="#faq"
              className="text-sm transition-colors"
              style={{ color: 'var(--text-secondary)' }}
              onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--text-primary)' }}
              onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-secondary)' }}
            >
              FAQ
            </a>

            {/* Theme Toggle */}
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

            {/* Sign In */}
            <Link
              href="/login"
              className="text-sm px-4 py-2 transition-colors"
              style={{
                color: 'var(--text-primary)',
                border: '1px solid var(--border-default)',
              }}
            >
              Sign In
            </Link>

            {/* Get Started */}
            <Link
              href="/login"
              className="text-sm px-4 py-2 font-medium transition-colors"
              style={{
                backgroundColor: 'var(--btn-primary-bg)',
                color: 'var(--btn-primary-text)',
              }}
            >
              Get Started
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-3">
            {mounted && (
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="p-2"
                style={{ color: 'var(--text-muted)' }}
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>
            )}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2"
              style={{ color: 'var(--text-primary)' }}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div
            className="md:hidden py-4 space-y-3"
            style={{ borderTop: '1px solid var(--border-default)' }}
          >
            <a
              href="#features"
              onClick={() => setMobileOpen(false)}
              className="block text-sm py-2"
              style={{ color: 'var(--text-secondary)' }}
            >
              Features
            </a>
            <a
              href="#pricing"
              onClick={() => setMobileOpen(false)}
              className="block text-sm py-2"
              style={{ color: 'var(--text-secondary)' }}
            >
              Pricing
            </a>
            <a
              href="#faq"
              onClick={() => setMobileOpen(false)}
              className="block text-sm py-2"
              style={{ color: 'var(--text-secondary)' }}
            >
              FAQ
            </a>
            <div className="flex gap-3 pt-2">
              <Link
                href="/login"
                className="flex-1 text-center text-sm py-2"
                style={{
                  color: 'var(--text-primary)',
                  border: '1px solid var(--border-default)',
                }}
              >
                Sign In
              </Link>
              <Link
                href="/login"
                className="flex-1 text-center text-sm py-2 font-medium"
                style={{
                  backgroundColor: 'var(--btn-primary-bg)',
                  color: 'var(--btn-primary-text)',
                }}
              >
                Get Started
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

function HeroSection() {
  return (
    <section className="relative pt-32 pb-20 sm:pt-40 sm:pb-28 overflow-hidden">
      {/* Gold accent line animation */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-24 sm:h-32"
        style={{
          background: 'linear-gradient(to bottom, transparent, var(--accent), transparent)',
          animation: 'goldLine 3s ease-in-out infinite',
        }}
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Tag */}
        <RevealSection>
          <span
            className="inline-block text-xs font-medium uppercase tracking-[0.2em] px-4 py-2 mb-8"
            style={{
              color: 'var(--accent)',
              border: '1px solid var(--accent)',
              backgroundColor: 'var(--accent-subtle)',
            }}
          >
            Your AI Executive Assistant
          </span>
        </RevealSection>

        {/* Headline */}
        <RevealSection delay={100}>
          <h1
            className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold leading-[1.1] mb-6"
            style={{ color: 'var(--text-primary)' }}
          >
            The Secretary That
            <br />
            <span style={{ color: 'var(--accent)' }}>Never Sleeps</span>
          </h1>
        </RevealSection>

        {/* Description */}
        <RevealSection delay={200}>
          <p
            className="max-w-2xl mx-auto text-base sm:text-lg mb-10 leading-relaxed"
            style={{ color: 'var(--text-secondary)' }}
          >
            Regent processes every email, drafts every reply, and briefs you on what matters
            — 24 hours a day, 7 days a week. No sick days. No vacation. No salary.
          </p>
        </RevealSection>

        {/* CTAs */}
        <RevealSection delay={300}>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/login"
              className="w-full sm:w-auto px-8 py-3.5 text-sm font-medium tracking-wide transition-all duration-200 flex items-center justify-center gap-2 group"
              style={{
                backgroundColor: 'var(--btn-primary-bg)',
                color: 'var(--btn-primary-text)',
              }}
            >
              Begin Your Trial
              <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
            <a
              href="#how-it-works"
              className="w-full sm:w-auto px-8 py-3.5 text-sm font-medium tracking-wide transition-colors"
              style={{
                color: 'var(--text-primary)',
                border: '1px solid var(--border-default)',
              }}
            >
              See How It Works
            </a>
          </div>
        </RevealSection>

        {/* Stats */}
        <RevealSection delay={400}>
          <div
            className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 mt-16 sm:mt-20 pt-10 sm:pt-12"
            style={{ borderTop: '1px solid var(--border-default)' }}
          >
            {[
              { value: '4.2 hrs', label: 'Saved daily', icon: <Clock className="w-4 h-4" /> },
              { value: '$78K', label: 'Cost eliminated', icon: <TrendingUp className="w-4 h-4" /> },
              { value: '<3s', label: 'Processing time', icon: <Zap className="w-4 h-4" /> },
              { value: '24/7', label: 'Always on', icon: <Eye className="w-4 h-4" /> },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <span style={{ color: 'var(--accent)' }}>{stat.icon}</span>
                  <span
                    className="font-display text-2xl sm:text-3xl font-semibold"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    {stat.value}
                  </span>
                </div>
                <p className="text-xs sm:text-sm" style={{ color: 'var(--text-muted)' }}>
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </RevealSection>
      </div>
    </section>
  )
}

function ProblemSection() {
  const costRows = [
    { label: 'Human Executive Assistant', value: '$78,000 - $120,000', color: 'var(--color-critical)' },
    { label: 'Regent (Free to $697/mo)', value: '$0 - $8,364 / year', color: 'var(--color-ok, #6FAD76)' },
    { label: 'Your Annual Savings', value: '$111,636 - $120,000', color: 'var(--accent)' },
  ]

  return (
    <section className="py-20 sm:py-28 px-5 sm:px-20">
      <div className="max-w-[1200px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-center">
          {/* Left: Problem description */}
          <RevealSection>
            <div>
              <span
                className="inline-block text-[11px] font-semibold uppercase tracking-[0.18em] px-3.5 py-1.5 mb-5"
                style={{
                  color: 'var(--accent)',
                  border: '1px solid var(--accent)',
                  backgroundColor: 'var(--accent-subtle)',
                }}
              >
                The Problem
              </span>
              <h2
                className="font-display text-3xl sm:text-4xl lg:text-[48px] font-light leading-[1.15] tracking-tight mb-4"
                style={{ color: 'var(--text-primary)' }}
              >
                You Pay $78,000 a Year for Someone Who Still Misses Things
              </h2>
              <p className="text-sm sm:text-base leading-relaxed mb-4" style={{ color: 'var(--text-muted)', maxWidth: 640 }}>
                A human executive assistant manages 40 hours a week. They take holidays, call in sick, and can only read emails at human speed. When they leave, your institutional knowledge walks out the door with them.
              </p>
              <p className="text-sm sm:text-base leading-relaxed" style={{ color: 'var(--text-muted)', maxWidth: 640 }}>
                Meanwhile, your inbox grows at 3AM. Meeting conflicts pile up across time zones. Important contacts fall through the cracks. Travel confirmations scatter across four email accounts.
              </p>
            </div>
          </RevealSection>

          {/* Right: Cost comparison card */}
          <RevealSection delay={200}>
            <div
              className="p-6 sm:p-10"
              style={{
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border-default)',
              }}
            >
              <div
                className="font-display text-lg sm:text-[22px] font-normal mb-6"
                style={{ color: 'var(--text-primary)' }}
              >
                Annual Cost Comparison
              </div>
              {costRows.map((row, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between flex-wrap gap-2 py-4"
                  style={{ borderBottom: i < 2 ? '1px solid var(--border-default)' : 'none' }}
                >
                  <span className="text-sm" style={{ color: 'var(--text-muted)' }}>
                    {row.label}
                  </span>
                  <span
                    className="font-display text-[15px] font-semibold tracking-wide"
                    style={{ color: row.color }}
                  >
                    {row.value}
                  </span>
                </div>
              ))}
              <div
                className="mt-6 flex items-center gap-2.5 p-3.5"
                style={{
                  backgroundColor: 'var(--accent-subtle)',
                  border: '1px solid var(--accent)',
                }}
              >
                <Sparkles className="h-4 w-4 flex-shrink-0" style={{ color: 'var(--accent)' }} />
                <span className="text-[13px] font-medium" style={{ color: 'var(--accent)' }}>
                  Regent processes emails in under 3 seconds, 24 hours a day, 365 days a year.
                </span>
              </div>
            </div>
          </RevealSection>
        </div>
      </div>
    </section>
  )
}

function FeaturesSection() {
  return (
    <section id="features" className="py-20 sm:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <RevealSection>
          <div className="text-center mb-12 sm:mb-16">
            <h2
              className="font-display text-3xl sm:text-4xl md:text-5xl font-semibold mb-4"
              style={{ color: 'var(--text-primary)' }}
            >
              Everything Your Secretary Does.
              <br />
              <span style={{ color: 'var(--accent)' }}>Automated.</span>
            </h2>
            <p
              className="max-w-xl mx-auto text-base sm:text-lg"
              style={{ color: 'var(--text-secondary)' }}
            >
              11 integrated modules working together, powered by a 4-tier AI engine
              that routes each task to the optimal model.
            </p>
          </div>
        </RevealSection>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {FEATURES.map((feature, i) => (
            <RevealSection key={feature.title} delay={i * 60}>
              <div
                className="h-full p-6 transition-all duration-200 group"
                style={{
                  backgroundColor: 'var(--bg-card)',
                  border: '1px solid var(--border-default)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--accent)'
                  e.currentTarget.style.backgroundColor = 'var(--bg-elevated)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border-default)'
                  e.currentTarget.style.backgroundColor = 'var(--bg-card)'
                }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div
                    className="p-2"
                    style={{
                      color: 'var(--accent)',
                      backgroundColor: 'var(--accent-subtle)',
                    }}
                  >
                    {feature.icon}
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className="text-[10px] font-medium uppercase tracking-wider px-1.5 py-0.5"
                      style={{
                        color: feature.phase === 'Live' ? 'var(--color-ok)' : 'var(--text-muted)',
                        backgroundColor: feature.phase === 'Live' ? 'rgba(111, 173, 118, 0.1)' : 'var(--accent-subtle)',
                      }}
                    >
                      {feature.phase}
                    </span>
                  </div>
                </div>

                <h3
                  className="font-display text-lg font-semibold mb-2"
                  style={{ color: 'var(--text-primary)' }}
                >
                  {feature.title}
                </h3>

                <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--text-secondary)' }}>
                  {feature.description}
                </p>

                <span
                  className="text-xs font-medium"
                  style={{ color: 'var(--accent)' }}
                >
                  {feature.plan}
                </span>
              </div>
            </RevealSection>
          ))}
        </div>
      </div>
    </section>
  )
}

function HowItWorksSection() {
  const steps = [
    {
      number: '01',
      title: 'Connect',
      description: 'Link your email accounts via OAuth or IMAP. Regent begins syncing immediately with AES-256-GCM encrypted credentials.',
      icon: <Lock className="w-6 h-6" />,
    },
    {
      number: '02',
      title: 'AI Takes Over',
      description: 'Every email is categorized, summarized, and prioritized. Draft replies are generated using your communication style. 24/7, whether you are logged in or not.',
      icon: <Brain className="w-6 h-6" />,
    },
    {
      number: '03',
      title: 'You Decide',
      description: 'Open Regent to find everything processed and waiting. Review AI drafts, approve with one click, or edit and send. You stay in control.',
      icon: <Check className="w-6 h-6" />,
    },
  ]

  return (
    <section id="how-it-works" className="py-20 sm:py-28" style={{ backgroundColor: 'var(--bg-secondary)' }}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <RevealSection>
          <div className="text-center mb-12 sm:mb-16">
            <h2
              className="font-display text-3xl sm:text-4xl md:text-5xl font-semibold mb-4"
              style={{ color: 'var(--text-primary)' }}
            >
              Three Steps to
              <br />
              <span style={{ color: 'var(--accent)' }}>Reclaim Your Time</span>
            </h2>
          </div>
        </RevealSection>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {steps.map((step, i) => (
            <RevealSection key={step.number} delay={i * 150}>
              <div className="relative text-center">
                {/* Connector line (desktop) */}
                {i < steps.length - 1 && (
                  <div
                    className="hidden md:block absolute top-8 left-[60%] w-[80%] h-px"
                    style={{ backgroundColor: 'var(--border-default)' }}
                  />
                )}

                <div
                  className="w-16 h-16 mx-auto mb-6 flex items-center justify-center"
                  style={{
                    border: '1px solid var(--accent)',
                    color: 'var(--accent)',
                  }}
                >
                  {step.icon}
                </div>

                <span
                  className="text-xs font-medium uppercase tracking-[0.2em] mb-2 block"
                  style={{ color: 'var(--accent)' }}
                >
                  Step {step.number}
                </span>

                <h3
                  className="font-display text-xl font-semibold mb-3"
                  style={{ color: 'var(--text-primary)' }}
                >
                  {step.title}
                </h3>

                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  {step.description}
                </p>
              </div>
            </RevealSection>
          ))}
        </div>
      </div>
    </section>
  )
}

function PricingSection() {
  const [promoCode, setPromoCode] = useState('')

  return (
    <section id="pricing" className="py-20 sm:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <RevealSection>
          <div className="text-center mb-12 sm:mb-16">
            <h2
              className="font-display text-3xl sm:text-4xl md:text-5xl font-semibold mb-4"
              style={{ color: 'var(--text-primary)' }}
            >
              Transparent Pricing.
              <br />
              <span style={{ color: 'var(--accent)' }}>No Surprises.</span>
            </h2>
            <p
              className="max-w-xl mx-auto text-base sm:text-lg"
              style={{ color: 'var(--text-secondary)' }}
            >
              Start free. Upgrade when you need more power.
              Every plan includes the core AI email intelligence engine.
            </p>
          </div>
        </RevealSection>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-12">
          {PRICING.map((tier, i) => (
            <RevealSection key={tier.name} delay={i * 80}>
              <div
                className="relative h-full flex flex-col p-6"
                style={{
                  backgroundColor: 'var(--bg-card)',
                  border: tier.recommended ? '2px solid var(--accent)' : '1px solid var(--border-default)',
                }}
              >
                {tier.recommended && (
                  <div
                    className="absolute -top-px left-0 right-0 h-0.5"
                    style={{ backgroundColor: 'var(--accent)' }}
                  />
                )}

                {tier.recommended && (
                  <span
                    className="inline-block text-[10px] font-medium uppercase tracking-[0.15em] px-2 py-1 mb-4 self-start"
                    style={{
                      backgroundColor: 'var(--accent)',
                      color: 'var(--accent-text)',
                    }}
                  >
                    Recommended
                  </span>
                )}

                <h3
                  className="font-display text-xl font-semibold"
                  style={{ color: 'var(--text-primary)' }}
                >
                  {tier.name}
                </h3>

                <div className="flex items-baseline gap-1 mt-2 mb-3">
                  <span
                    className="font-display text-3xl sm:text-4xl font-semibold"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    {tier.price}
                  </span>
                  <span className="text-sm" style={{ color: 'var(--text-muted)' }}>
                    {tier.period}
                  </span>
                </div>

                <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
                  {tier.description}
                </p>

                {/* Key Metrics */}
                <div
                  className="grid grid-cols-3 gap-2 mb-6 py-3"
                  style={{ borderTop: '1px solid var(--border-default)', borderBottom: '1px solid var(--border-default)' }}
                >
                  {tier.metrics.map((metric) => (
                    <div key={metric.label} className="text-center">
                      <p
                        className="text-xs font-semibold"
                        style={{ color: 'var(--accent)' }}
                      >
                        {metric.value}
                      </p>
                      <p
                        className="text-[10px]"
                        style={{ color: 'var(--text-muted)' }}
                      >
                        {metric.label}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Features */}
                <ul className="space-y-2.5 mb-8 flex-1">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2">
                      <Check
                        className="w-3.5 h-3.5 mt-0.5 flex-shrink-0"
                        style={{ color: 'var(--accent)' }}
                      />
                      <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <Link
                  href="/login"
                  className="block w-full py-2.5 text-sm font-medium text-center transition-colors"
                  style={
                    tier.recommended
                      ? {
                          backgroundColor: 'var(--btn-primary-bg)',
                          color: 'var(--btn-primary-text)',
                        }
                      : {
                          color: 'var(--text-primary)',
                          border: '1px solid var(--border-default)',
                        }
                  }
                >
                  {tier.cta}
                </Link>
              </div>
            </RevealSection>
          ))}
        </div>

        {/* Trust Strip */}
        <RevealSection>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-10 mb-8">
            {[
              { icon: <Shield className="w-4 h-4" />, text: '14-day free trial on all paid plans' },
              { icon: <Zap className="w-4 h-4" />, text: 'Pay only for modules that are live' },
              { icon: <Lock className="w-4 h-4" />, text: 'Secured by Stripe' },
            ].map((item) => (
              <div key={item.text} className="flex items-center gap-2">
                <span style={{ color: 'var(--accent)' }}>{item.icon}</span>
                <span className="text-xs sm:text-sm" style={{ color: 'var(--text-muted)' }}>
                  {item.text}
                </span>
              </div>
            ))}
          </div>
        </RevealSection>

        {/* Promo Code */}
        <RevealSection>
          <div className="max-w-md mx-auto">
            <div className="flex">
              <input
                type="text"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                placeholder="Enter promo code"
                className="flex-1 px-4 py-2.5 text-sm outline-none"
                style={{
                  backgroundColor: 'var(--bg-elevated)',
                  border: '1px solid var(--border-default)',
                  borderRight: 'none',
                  color: 'var(--text-primary)',
                }}
              />
              <button
                className="px-6 py-2.5 text-sm font-medium transition-colors"
                style={{
                  backgroundColor: 'var(--btn-primary-bg)',
                  color: 'var(--btn-primary-text)',
                }}
              >
                Apply
              </button>
            </div>
          </div>
        </RevealSection>
      </div>
    </section>
  )
}

function BehaviorSection() {
  const features = [
    {
      icon: <Heart className="w-5 h-5" />,
      title: 'Work-Life Balance Score',
      description: 'Real-time WLB scoring based on after-hours activity, weekend work, and boundary violations. Computed nightly from existing data.',
    },
    {
      icon: <MessageSquare className="w-5 h-5" />,
      title: 'Communication Profile',
      description: 'Tone distribution analysis piggybacked on email categorization. Understand your communication patterns at zero extra AI cost.',
    },
    {
      icon: <Activity className="w-5 h-5" />,
      title: 'Stress Detection',
      description: 'Five behavioral metrics computed nightly: response urgency, volume spikes, late-night activity, tone shifts, and boundary erosion.',
    },
    {
      icon: <Users className="w-5 h-5" />,
      title: 'Relationship Intelligence',
      description: 'Contact-level scoring with sentiment trends, interaction frequency, and last-touch alerts for VIP relationships.',
    },
    {
      icon: <TrendingUp className="w-5 h-5" />,
      title: 'Productivity Mapping',
      description: 'Peak hours identification, decision velocity tracking, and delegation rate analysis. Know when you perform best.',
    },
  ]

  return (
    <section className="py-20 sm:py-28" style={{ backgroundColor: 'var(--bg-secondary)' }}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <RevealSection>
          <div className="text-center mb-12 sm:mb-16">
            <span
              className="inline-block text-xs font-medium uppercase tracking-[0.2em] px-4 py-2 mb-6"
              style={{
                color: 'var(--accent)',
                border: '1px solid var(--accent)',
                backgroundColor: 'var(--accent-subtle)',
              }}
            >
              Behavior Intelligence
            </span>
            <h2
              className="font-display text-3xl sm:text-4xl md:text-5xl font-semibold mb-4"
              style={{ color: 'var(--text-primary)' }}
            >
              Know Yourself Better
              <br />
              <span style={{ color: 'var(--accent)' }}>Than Your Secretary Does</span>
            </h2>
          </div>
        </RevealSection>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {features.map((feature, i) => (
            <RevealSection
              key={feature.title}
              delay={i * 80}
              className={i === 4 ? 'sm:col-span-2 lg:col-span-1' : ''}
            >
              <div
                className="h-full p-6"
                style={{
                  backgroundColor: 'var(--bg-card)',
                  border: '1px solid var(--border-default)',
                }}
              >
                <div
                  className="w-10 h-10 flex items-center justify-center mb-4"
                  style={{
                    color: 'var(--accent)',
                    backgroundColor: 'var(--accent-subtle)',
                  }}
                >
                  {feature.icon}
                </div>
                <h3
                  className="font-display text-lg font-semibold mb-2"
                  style={{ color: 'var(--text-primary)' }}
                >
                  {feature.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  {feature.description}
                </p>
              </div>
            </RevealSection>
          ))}
        </div>
      </div>
    </section>
  )
}

function TrustSection() {
  const cards = [
    {
      icon: <Shield className="w-6 h-6" />,
      title: 'Swiss-Grade Security',
      description: 'AES-256-GCM encryption, PostgreSQL Row-Level Security, per-tenant isolation, and TLS 1.3 everywhere. Your data is cryptographically separated from every other customer.',
    },
    {
      icon: <Server className="w-6 h-6" />,
      title: 'Self-Host Option',
      description: 'Run Regent on your own infrastructure. Our Docker image is under 20MB. Full control over your data, your models, and your compliance requirements.',
    },
    {
      icon: <Eye className="w-6 h-6" />,
      title: 'Full Transparency',
      description: 'Every AI decision is logged in the audit trail. See exactly which model processed each email, what confidence score was assigned, and why. No black boxes.',
    },
  ]

  return (
    <section className="py-20 sm:py-28">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <RevealSection>
          <div className="text-center mb-12 sm:mb-16">
            <h2
              className="font-display text-3xl sm:text-4xl md:text-5xl font-semibold mb-4"
              style={{ color: 'var(--text-primary)' }}
            >
              Built for People Who
              <br />
              <span style={{ color: 'var(--accent)' }}>Cannot Afford a Breach</span>
            </h2>
          </div>
        </RevealSection>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {cards.map((card, i) => (
            <RevealSection key={card.title} delay={i * 120}>
              <div
                className="h-full p-6 sm:p-8"
                style={{
                  backgroundColor: 'var(--bg-card)',
                  border: '1px solid var(--border-default)',
                }}
              >
                <div
                  className="w-12 h-12 flex items-center justify-center mb-5"
                  style={{
                    color: 'var(--accent)',
                    border: '1px solid var(--accent)',
                  }}
                >
                  {card.icon}
                </div>
                <h3
                  className="font-display text-xl font-semibold mb-3"
                  style={{ color: 'var(--text-primary)' }}
                >
                  {card.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  {card.description}
                </p>
              </div>
            </RevealSection>
          ))}
        </div>
      </div>
    </section>
  )
}

function TestimonialSection() {
  const testimonials = [
    {
      quote: 'Regent processes my 200+ daily emails before I wake up. I open my laptop to find everything categorized, summarized, and drafted. It saved my sanity.',
      name: 'Victoria H.',
      title: 'Managing Director, Private Equity',
      metric: '4.5 hours saved daily',
    },
    {
      quote: 'The AI Memory feature is extraordinary. After two weeks, Regent understood my communication style better than any assistant I have ever hired.',
      name: 'Marcus T.',
      title: 'CEO, Family Office',
      metric: '$78K annual savings',
    },
    {
      quote: 'I was skeptical about AI handling sensitive financial correspondence. The audit trail and encryption convinced me. Six months in, I cannot imagine going back.',
      name: 'Dr. Elaine K.',
      title: 'Chief Investment Officer',
      metric: '94% draft accuracy',
    },
  ]

  return (
    <section className="py-20 sm:py-28" style={{ backgroundColor: 'var(--bg-secondary)' }}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <RevealSection>
          <div className="text-center mb-12 sm:mb-16">
            <h2
              className="font-display text-3xl sm:text-4xl md:text-5xl font-semibold mb-4"
              style={{ color: 'var(--text-primary)' }}
            >
              Trusted by
              <br />
              <span style={{ color: 'var(--accent)' }}>Discerning Professionals</span>
            </h2>
          </div>
        </RevealSection>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {testimonials.map((t, i) => (
            <RevealSection key={t.name} delay={i * 120}>
              <div
                className="h-full p-6 sm:p-8 flex flex-col"
                style={{
                  backgroundColor: 'var(--bg-card)',
                  border: '1px solid var(--border-default)',
                }}
              >
                {/* Gold quote mark */}
                <span
                  className="font-display text-4xl leading-none mb-4 block"
                  style={{ color: 'var(--accent)' }}
                >
                  &ldquo;
                </span>

                <p
                  className="text-sm leading-relaxed flex-1 mb-6"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  {t.quote}
                </p>

                <div>
                  <div
                    className="h-px w-8 mb-4"
                    style={{ backgroundColor: 'var(--accent)' }}
                  />
                  <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                    {t.name}
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                    {t.title}
                  </p>
                  <p
                    className="text-xs font-medium mt-2"
                    style={{ color: 'var(--accent)' }}
                  >
                    {t.metric}
                  </p>
                </div>
              </div>
            </RevealSection>
          ))}
        </div>
      </div>
    </section>
  )
}

function ComparisonSection() {
  return (
    <section className="py-20 sm:py-28">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <RevealSection>
          <div className="text-center mb-12 sm:mb-16">
            <h2
              className="font-display text-3xl sm:text-4xl md:text-5xl font-semibold mb-4"
              style={{ color: 'var(--text-primary)' }}
            >
              The Full
              <span style={{ color: 'var(--accent)' }}> Comparison</span>
            </h2>
          </div>
        </RevealSection>

        <RevealSection delay={100}>
          <div
            className="overflow-x-auto"
            style={{
              border: '1px solid var(--border-default)',
            }}
          >
            <table className="w-full min-w-[500px]">
              <thead>
                <tr style={{ backgroundColor: 'var(--bg-secondary)' }}>
                  <th
                    className="text-left text-sm font-medium py-3.5 px-5"
                    style={{ color: 'var(--text-muted)', borderBottom: '1px solid var(--border-default)' }}
                  >
                    Feature
                  </th>
                  <th
                    className="text-center text-sm font-medium py-3.5 px-5"
                    style={{ color: 'var(--accent)', borderBottom: '1px solid var(--border-default)' }}
                  >
                    Regent
                  </th>
                  <th
                    className="text-center text-sm font-medium py-3.5 px-5"
                    style={{ color: 'var(--text-muted)', borderBottom: '1px solid var(--border-default)' }}
                  >
                    Human EA
                  </th>
                </tr>
              </thead>
              <tbody>
                {COMPARISON_ROWS.map((row, i) => (
                  <tr key={row.feature}>
                    <td
                      className="text-sm py-3.5 px-5"
                      style={{
                        color: 'var(--text-primary)',
                        borderBottom: i < COMPARISON_ROWS.length - 1 ? '1px solid var(--border-default)' : 'none',
                      }}
                    >
                      {row.feature}
                    </td>
                    <td
                      className="text-center text-sm font-medium py-3.5 px-5"
                      style={{
                        color: 'var(--accent)',
                        borderBottom: i < COMPARISON_ROWS.length - 1 ? '1px solid var(--border-default)' : 'none',
                      }}
                    >
                      {row.regent}
                    </td>
                    <td
                      className="text-center text-sm py-3.5 px-5"
                      style={{
                        color: 'var(--text-muted)',
                        borderBottom: i < COMPARISON_ROWS.length - 1 ? '1px solid var(--border-default)' : 'none',
                      }}
                    >
                      {row.human}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </RevealSection>
      </div>
    </section>
  )
}

function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggle = useCallback((index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index))
  }, [])

  return (
    <section id="faq" className="py-20 sm:py-28" style={{ backgroundColor: 'var(--bg-secondary)' }}>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <RevealSection>
          <div className="text-center mb-12 sm:mb-16">
            <h2
              className="font-display text-3xl sm:text-4xl md:text-5xl font-semibold mb-4"
              style={{ color: 'var(--text-primary)' }}
            >
              Questions
              <span style={{ color: 'var(--accent)' }}> Answered</span>
            </h2>
          </div>
        </RevealSection>

        <div className="space-y-0">
          {FAQ_ITEMS.map((item, i) => (
            <RevealSection key={i} delay={i * 60}>
              <div
                style={{ borderBottom: '1px solid var(--border-default)' }}
                className={i === 0 ? '' : ''}
              >
                <button
                  onClick={() => toggle(i)}
                  className="w-full flex items-center justify-between py-5 text-left group"
                  style={{ borderTop: i === 0 ? '1px solid var(--border-default)' : 'none' }}
                >
                  <span
                    className="font-display text-base sm:text-lg font-medium pr-4"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    {item.question}
                  </span>
                  <ChevronDown
                    className="w-4 h-4 flex-shrink-0 transition-transform duration-200"
                    style={{
                      color: 'var(--accent)',
                      transform: openIndex === i ? 'rotate(180deg)' : 'rotate(0deg)',
                    }}
                  />
                </button>
                <div
                  className="overflow-hidden transition-all duration-300"
                  style={{
                    maxHeight: openIndex === i ? '300px' : '0',
                    opacity: openIndex === i ? 1 : 0,
                  }}
                >
                  <p
                    className="pb-5 text-sm leading-relaxed"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    {item.answer}
                  </p>
                </div>
              </div>
            </RevealSection>
          ))}
        </div>
      </div>
    </section>
  )
}

function CTASection() {
  return (
    <section className="py-20 sm:py-28">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <RevealSection>
          {/* Gold line */}
          <div
            className="w-px h-16 mx-auto mb-10"
            style={{ background: 'linear-gradient(to bottom, transparent, var(--accent))' }}
          />

          <h2
            className="font-display text-3xl sm:text-4xl md:text-5xl font-semibold mb-6 leading-tight"
            style={{ color: 'var(--text-primary)' }}
          >
            Your Time Is the Only Asset
            <br />
            <span style={{ color: 'var(--accent)' }}>You Cannot Buy More Of</span>
          </h2>

          <p
            className="max-w-xl mx-auto text-base sm:text-lg mb-10"
            style={{ color: 'var(--text-secondary)' }}
          >
            Stop paying six figures for a role that artificial intelligence
            performs with greater speed, precision, and availability.
          </p>

          <Link
            href="/login"
            className="inline-flex items-center gap-2 px-10 py-4 text-sm font-medium tracking-wide transition-all duration-200 group"
            style={{
              backgroundColor: 'var(--btn-primary-bg)',
              color: 'var(--btn-primary-text)',
            }}
          >
            Apply for Early Access
            <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
          </Link>

          <p className="text-xs mt-4" style={{ color: 'var(--text-muted)' }}>
            Free tier available. No credit card required.
          </p>
        </RevealSection>
      </div>
    </section>
  )
}

function Footer() {
  const footerLinks = {
    Product: [
      { label: 'Email Intelligence', href: '#features' },
      { label: 'AI Memory', href: '#features' },
      { label: 'Behavior Intelligence', href: '#features' },
      { label: 'Pricing', href: '#pricing' },
    ],
    Company: [
      { label: 'About', href: '#' },
      { label: 'Blog', href: '#' },
      { label: 'Careers', href: '#' },
      { label: 'Contact', href: '#' },
    ],
    Legal: [
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms of Service', href: '/terms' },
      { label: 'GDPR Compliance', href: '/gdpr' },
      { label: 'Security', href: '/security' },
    ],
  }

  return (
    <footer style={{ backgroundColor: 'var(--bg-secondary)', borderTop: '1px solid var(--border-default)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 sm:gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5 mb-4">
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
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
              AI-powered executive assistant for professionals who value their time
              above all else.
            </p>
          </div>

          {/* Link Columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4
                className="text-xs font-medium uppercase tracking-[0.15em] mb-4"
                style={{ color: 'var(--text-primary)' }}
              >
                {title}
              </h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm transition-colors"
                      style={{ color: 'var(--text-muted)' }}
                      onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--accent)' }}
                      onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-muted)' }}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div
          className="mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4"
          style={{ borderTop: '1px solid var(--border-default)' }}
        >
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
            MMXXVI Regent. All rights reserved.
          </p>
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
        </div>
      </div>
    </footer>
  )
}

// ─── Page ───

export default function LandingPage() {
  return (
    <div style={{ backgroundColor: 'var(--bg-primary)' }}>
      <NavBar />
      <HeroSection />
      <ProblemSection />
      <FeaturesSection />
      <HowItWorksSection />
      <PricingSection />
      <BehaviorSection />
      <TrustSection />
      <TestimonialSection />
      <ComparisonSection />
      <FAQSection />
      <CTASection />
      <Footer />
    </div>
  )
}
