# Regent Frontend

**The Dashboard for Your AI Secretary**

Regent Frontend is the executive-grade web interface where busy professionals review AI-processed emails, approve draft replies with one click, monitor behavior intelligence, manage tasks, and configure how their AI assistant operates — all updating in real-time without page refreshes.

---

## What This Does

When you open Regent in the morning, everything is already waiting:

- **Dashboard** — Emails processed, pending drafts, urgent items, AI activity feed, category chart
- **Inbox** — Every email categorized, prioritized, and summarized. Filter by account or category
- **Summaries** — AI-generated briefs for all emails. Filter by today, yesterday, this week, or custom dates
- **Reply Queue** — AI-drafted replies waiting for one-click approval
- **Tasks** — Action items auto-extracted from emails, organized in a Kanban board
- **Calendar** — Google + Outlook sync with conflict detection and smart scheduling
- **Intelligence** — Communication patterns, work-life balance, stress indicators, relationships
- **Analytics** — Token usage, AI speed, service breakdown, 7-day trends
- **Briefings** — Configure SMS, WhatsApp, Signal, push, or email digest delivery
- **AI Memory** — Set rules, add context briefs, view learned patterns
- **Modules** — Toggle AI services on/off per your subscription plan
- **Audit Log** — Every AI decision with model, tokens, latency, and reasoning
- **Settings** — Profile, AI preferences (formality + reply style), notifications, timezone, language

**Everything updates live.** No manual refresh needed.

## Who This Is For

Executives and professionals who receive 100-500+ emails daily, need AI to triage and draft replies 24/7, want full control over AI behavior, and require audit trails for compliance.

## Design Philosophy

- **EB Garamond** serif headings — authority and sophistication
- **Inter** body text — clean readability for data-heavy screens
- **Gold accent** (`#C9A96E`) — consistent luxury identity
- **Zero border-radius** — sharp corners everywhere, modern and decisive
- **Dark/Light themes** — CSS variable-driven, one-click toggle
- **Subscription-aware** — locked features show upgrade overlay, not broken pages

---

## Tech Stack

| Layer | Technology | Why |
|-------|-----------|-----|
| Framework | Next.js 16.1 (App Router) | Server components, automatic code splitting, standalone Docker |
| Language | TypeScript 5 (strict) | Catch bugs at compile time |
| React | 19.2 + React Compiler | Auto-memoization, no manual useMemo bloat |
| Styling | Tailwind CSS 4 | Utility-first, zero runtime CSS, custom tokens |
| State | Zustand 5 | Lightweight, TypeScript-first (vs Redux boilerplate) |
| Realtime | Supabase Realtime | RLS-aware WebSocket, zero infrastructure |
| Auth | Supabase Auth | Google + Microsoft OAuth, JWT, PKCE |
| Charts | Recharts 3.8 | Composable, responsive, SSR-compatible |
| Drag & Drop | @dnd-kit | Accessible, touch-friendly Kanban |
| Icons | Lucide React | Tree-shakeable, consistent |

## Quick Start

```bash
cp .env.local.example .env.local
# Edit: NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY

npm install
npm run dev     # http://localhost:3000
```

### Environment Variables

```bash
NEXT_PUBLIC_SUPABASE_URL=https://...supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
BACKEND_URL=http://localhost:8080    # Server-side only (API proxy)
```

---

## Architecture

### Data Flow

```
Go Backend (port 8080)
    |
    |-- Next.js rewrites: /api/v1/* -> backend:8080/api/v1/*
    |
Frontend Hook (e.g. useEmails)
    |-- api.get<Email[]>('/emails')        -> HTTP with JWT
    |-- useRealtimeSubscription('emails')  -> WebSocket for live updates
    |-- Zustand store (emailStore)         -> React re-renders
    |
Page Component (InboxPage)
```

### Realtime Subscriptions

| Page | What Updates Live |
|------|-------------------|
| Dashboard | Email count, AI stats, draft count, activity feed |
| Inbox | New emails, category changes, sync status |
| Reply Queue | New drafts, approval status changes |
| Pipeline | Processing stages (categorizing -> summarizing -> complete) |
| Summaries | New AI summaries |
| Tasks | Task creation, status changes |
| Analytics | Token usage via audit log |
| Token Meter | Every AI call updates the sidebar |
| Notifications | New notification entries |

### Auto-Timezone

On first login, `TimezoneSync` detects the browser timezone and saves it to the user profile. The entire system uses it for all date calculations.

---

## Pages (22 routes)

### Core Workflow

| Route | Purpose |
|-------|---------|
| `/` | Dashboard — morning overview with metrics and urgent items |
| `/inbox` | Email list with account/category filtering |
| `/inbox/[emailId]` | Full email detail with AI summary |
| `/summaries` | AI brief feed with date range filters |
| `/reply-queue` | AI draft replies — approve, edit, or reject |
| `/compose` | AI-assisted email composition |
| `/sent` | Sent email history with detail view |

### Intelligence

| Route | Purpose |
|-------|---------|
| `/intelligence` | 5-tab behavior analysis (Overview, Communication, WLB, Relationships, Productivity) |
| `/behavior` | AI Memory — rules, context briefs, learned patterns |
| `/analytics` | Token usage, AI speed, service breakdown, 7-day trend |
| `/audit-log` | Every AI decision — filter by Categorize, Summarize, Draft, Behavior |

### Configuration

| Route | Purpose |
|-------|---------|
| `/briefings` | Toggle notification channels, preview digest format |
| `/modules` | Enable/disable AI services per subscription plan |
| `/tasks` | Kanban board for AI-extracted action items |
| `/calendar` | Google/Outlook sync with conflict detection |
| `/billing` | Plans, invoices, promo codes, Stripe portal |
| `/settings` | Profile, AI prefs, notifications, timezone, language |

---

## Project Structure

```
src/
  app/
    (auth)/login/              # OAuth login (Google, Microsoft)
    (auth)/callback/           # OAuth redirect handler
    (dashboard)/               # Protected layout (sidebar + topbar)
      page.tsx                 # Dashboard home
      inbox/                   # Email list + [emailId] detail
      summaries/               # AI summary feed
      reply-queue/             # Draft approval queue
      ...20 more pages
  components/                  # 107 components in 18 directories
    ui/          16 base       # Button, Card, Modal, Toggle, Badge, etc.
    layout/       9            # Sidebar, Topbar, TokenMeter, PipelineStatus
    inbox/        9            # EmailList, EmailDetail, CategoryTabs
    dashboard/    8            # MetricsRow, ActivityFeed, CategoryChart
    intelligence/ 9            # OverviewTab, WLBTab, ScoreRing, ToneChart
    calendar/    10            # MonthView, WeekView, EventCreateModal
    analytics/    7            # TokenHero, StatsRow, ServiceBreakdown
    settings/     7            # ProfileSection, AIPrefs, ConnectedAccounts
    behavior/     6            # RulesTab, BriefsTab, LearnedTab
    tasks/        5            # KanbanBoard, TaskCard, QuickAdd
    compose/      5            # ComposeForm, AICompose
    billing/      5            # PlanCard, InvoiceHistory, PromoCode
    audit-log/    3            # LogEntry, LogFilters, LogExport
    modules/      3            # PipelineGroup, ServiceRow
    reply-queue/  3            # ReplyCard, ReplyEditor
    sent/         2            # SentRow, SentDetail
  hooks/         15 hooks      # Data fetching + realtime subscriptions
  stores/         5 stores     # Zustand state management
  types/          8 files      # TypeScript interfaces
  lib/                         # API client, Supabase client, utilities
  providers/                   # Theme, Toast
```

## Hooks (15)

| Hook | Purpose |
|------|---------|
| `use-emails` | Emails with pagination, filtering, realtime |
| `use-summaries` | AI summaries with date range filtering |
| `use-replies` | Draft replies with optimistic approve/reject |
| `use-tasks` | Task CRUD, kanban drag-drop, snooze, delegate |
| `use-calendar-events` | Calendar events with conflict detection |
| `use-dashboard-data` | Dashboard metrics + activity feed |
| `use-analytics` | Token usage, service breakdown, trends |
| `use-behavior-data` | Behavior profiles, WLB, stress, relationships |
| `use-ai-memory` | Rules, briefs, patterns with plan-based limits |
| `use-audit-log` | Audit trail with type filtering + pagination |
| `use-service-config` | Module toggles (backend-driven, persisted) |
| `use-pipeline-status` | AI pipeline state (5s poll + realtime) |
| `use-realtime` | Generic Supabase postgres_changes subscription |
| `use-connection-status` | WebSocket connection health |
| `use-optimistic-mutation` | Optimistic UI with automatic revert |

## Stores (Zustand)

| Store | State |
|-------|-------|
| `auth-store` | User session, isAuthenticated |
| `email-store` | Email list, selected email, category/account filters |
| `ui-store` | Sidebar collapsed, mobile drawer, theme |
| `task-store` | Tasks, kanban columns, filters, timer |
| `calendar-store` | View mode, selected date, events |

---

## Key Patterns

**Optimistic mutations** — Update UI immediately, revert on failure:
```typescript
await mutate({
  onMutate: (current) => current.filter(r => r.id !== id),
  mutationFn: () => api.post(`/drafts/${id}/approve`),
})
```

**Plan gating** — 402 response triggers upgrade overlay:
```typescript
if (response.planGated) return <PlanGateOverlay requiredPlan="attache" />
```

**Realtime sync** — Every hook pairs fetch + subscription:
```typescript
const emails = await api.get<Email[]>('/emails')
useRealtimeSubscription({ table: 'emails', onInsert: addEmail })
```

---

## Build & Deploy

```bash
npm run dev        # Development (hot reload, :3000)
npm run build      # Production build (standalone)
npm start          # Production server
npm run lint       # ESLint
```

### Docker

```bash
docker build -t regent-frontend .
docker run -p 3000:3000 regent-frontend
```

Multi-stage: deps -> build (BACKEND_URL baked) -> runner (Node 20 Alpine, standalone)

## Performance

| Metric | Target |
|--------|--------|
| First Contentful Paint | < 1.5s |
| Lighthouse Score | > 90 |
| Code splitting | Automatic (App Router) |
| Memoization | Automatic (React Compiler) |

---

## License

Proprietary. All rights reserved.
