# Regent Frontend

Next.js 16.1 dashboard for the Regent AI executive assistant platform. TypeScript strict mode, Tailwind CSS 4 with a luxury design system, Supabase Realtime for live updates, and Zustand for state management.

## Tech Stack

| Component | Technology |
|-----------|-----------|
| Framework | Next.js 16.1 (App Router) |
| Language | TypeScript 5 (strict mode) |
| React | 19.2 with React Compiler |
| Styling | Tailwind CSS 4 |
| State | Zustand 5 (5 stores) |
| Realtime | Supabase Realtime (postgres_changes) |
| Auth | Supabase Auth (Google + Microsoft OAuth) |
| Charts | Recharts 3.8 |
| Drag & Drop | @dnd-kit |
| Icons | Lucide React |

## Quick Start

```bash
# Prerequisites: Node 20+

# Setup
cp .env.local.example .env.local
# Edit with your Supabase URL and anon key

# Development
npm install
npm run dev           # http://localhost:3000

# Production
npm run build
npm start

# Lint
npm run lint

# Docker
docker build -t regent-frontend .
docker run -p 3000:3000 regent-frontend
```

## Environment Variables

```bash
NEXT_PUBLIC_SUPABASE_URL=https://...supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
BACKEND_URL=http://localhost:8080    # Server-side only (API proxy)
```

## Design System

### Typography
- **Display/Headings**: EB Garamond (serif, luxury)
- **Body**: Inter (clean, readable)
- **Monospace**: JetBrains Mono (code, numbers)

### Colors
- **Gold Accent**: `#C9A96E` (dark) / `#8A6E3A` (light)
- **Dark Theme**: `#020202` background, cream text
- **Light Theme**: `#F8F6F2` background, dark text
- **Category Colors**: Urgent (red), Work (blue), Finance (gold), Personal (rose), etc.

### Design Rules
- Zero border-radius everywhere (sharp corners)
- CSS variables for dark/light theme switching
- Gold accent system throughout
- Responsive: mobile-first with `lg:` breakpoints

## Pages (22 routes)

| Route | Purpose |
|-------|---------|
| `/login` | OAuth login (Google, Microsoft) |
| `/` | Dashboard (metrics, activity, attention) |
| `/inbox` | Email list + category tabs |
| `/inbox/[emailId]` | Email detail (full page) |
| `/summaries` | AI email summaries with date filters |
| `/reply-queue` | Pending AI draft replies |
| `/sent` | Sent emails history |
| `/compose` | AI-assisted email composition |
| `/tasks` | Kanban task board |
| `/calendar` | Calendar with event management |
| `/analytics` | Token usage, AI speed, service breakdown |
| `/behavior` | AI Memory (rules, briefs, patterns) |
| `/intelligence` | Behavior analytics (5 tabs) |
| `/briefings` | Notification channel config |
| `/modules` | Service toggles (plan-gated) |
| `/audit-log` | AI decision trail |
| `/billing` | Plans, invoices, promo codes |
| `/settings` | Profile, notifications, AI prefs, timezone, language |

## Project Structure

```
frontend/
  src/
    app/
      (auth)/
        login/page.tsx           # Login page
        callback/route.ts        # OAuth callback
      (dashboard)/
        layout.tsx               # Sidebar + topbar + TimezoneSync
        page.tsx                 # Dashboard home
        inbox/                   # Email list + detail
        summaries/               # AI summaries
        reply-queue/             # Draft replies
        sent/                    # Sent emails
        compose/                 # AI compose
        tasks/                   # Kanban board
        calendar/                # Calendar
        analytics/               # Usage analytics
        behavior/                # AI Memory
        intelligence/            # Behavior analytics
        briefings/               # Notification config
        modules/                 # Service toggles
        audit-log/               # Audit trail
        billing/                 # Plans & payments
        settings/                # User settings
    components/                  # 107 components in 18 directories
      ui/                        # 16 base components (Button, Card, Modal, etc.)
      layout/                    # 9 (Sidebar, Topbar, TokenMeter, PipelineStatus, etc.)
      inbox/                     # 9 (EmailList, EmailDetail, CategoryTabs, etc.)
      dashboard/                 # 8 (MetricsRow, ActivityFeed, CategoryChart, etc.)
      intelligence/              # 9 (OverviewTab, WLBTab, ScoreRing, ToneChart, etc.)
      calendar/                  # 10 (MonthView, WeekView, EventCreateModal, etc.)
      analytics/                 # 7 (TokenHero, StatsRow, ServiceBreakdown, etc.)
      settings/                  # 7 (ProfileSection, NotificationPrefs, AIPrefs, etc.)
      behavior/                  # 6 (RulesTab, BriefsTab, LearnedTab, etc.)
      tasks/                     # 5 (KanbanBoard, TaskCard, QuickAdd, etc.)
      compose/                   # 5 (ComposeForm, AICompose, etc.)
      billing/                   # 5 (PlanCard, InvoiceHistory, etc.)
      audit-log/                 # 3 (LogEntry, LogFilters, LogExport)
      modules/                   # 3 (PipelineGroup, ServiceRow, ModuleStats)
      reply-queue/               # 3 (ReplyCard, ReplyEditor, ReplyStats)
      sent/                      # 2 (SentRow, SentDetail)
    hooks/                       # 15 custom hooks
    stores/                      # 5 Zustand stores
    types/                       # 8 type definition files
    lib/                         # API client, Supabase client, utilities
    providers/                   # Theme, Toast
  public/                        # Static assets
  next.config.ts                 # React Compiler, standalone output, API rewrites
  tailwind.config.ts             # Custom theme tokens
  tsconfig.json                  # Strict mode, path aliases
  Dockerfile                     # Multi-stage (Node 20 Alpine)
```

## Hooks

| Hook | Purpose |
|------|---------|
| `use-emails` | Fetch emails with pagination, filtering, realtime |
| `use-summaries` | AI summaries with date range filtering |
| `use-replies` | Draft replies with optimistic approve/reject |
| `use-tasks` | Task CRUD, kanban state, drag-drop |
| `use-calendar-events` | Calendar events with conflict detection |
| `use-dashboard-data` | Dashboard metrics + activity feed |
| `use-analytics` | Token usage, service breakdown, trends |
| `use-behavior-data` | Behavior profiles, WLB, stress, relationships |
| `use-ai-memory` | Rules, briefs, patterns with plan-based limits |
| `use-audit-log` | Audit trail with type filtering + pagination |
| `use-service-config` | Module toggles (backend-driven) |
| `use-pipeline-status` | AI pipeline state (5s poll + realtime) |
| `use-realtime` | Generic Supabase postgres_changes subscription |
| `use-connection-status` | WebSocket connection health |
| `use-optimistic-mutation` | Optimistic UI updates with revert |

## Stores (Zustand)

| Store | State |
|-------|-------|
| `auth-store` | User session, isAuthenticated |
| `email-store` | Email list, selected email, category filter, account filter |
| `ui-store` | Sidebar collapsed, mobile drawer, theme |
| `task-store` | Tasks array, kanban columns, filters, active timer |
| `calendar-store` | View mode, selected date, events |

## Data Flow

```
Backend API (/api/v1/*)
    |
    |-- Next.js rewrites proxy (localhost:3000/api/v1 -> backend:8080/api/v1)
    |
    v
Frontend Hook (use-emails, use-replies, etc.)
    |-- api.get<T>('/emails') -> fetches with JWT from Supabase session
    |-- useRealtimeSubscription('emails') -> live INSERT/UPDATE/DELETE
    |-- Zustand store (addEmail, updateEmail) -> React re-render
    |
    v
Component (EmailList, ReplyCard, etc.)
```

## Realtime Subscriptions

Every critical page has live updates via Supabase Realtime:

| Page | Tables Subscribed |
|------|-------------------|
| Dashboard | emails, email_categories, draft_replies, ai_audit_log |
| Inbox | emails, user_accounts |
| Reply Queue | draft_replies |
| Pipeline Status | email_ai_status |
| Summaries | email_summaries |
| Tasks | tasks |
| Analytics | ai_audit_log |
| Token Meter | ai_audit_log |
| Notifications | notification_log |

## API Client

```typescript
// lib/api.ts — Singleton with auto JWT injection
const data = await api.get<Email[]>('/emails?category=work&page=1')
await api.post('/drafts/123/approve')
await api.put('/settings/profile', { timezone: 'America/Chicago' })
```

Response format: `{ data: T, meta?: {}, request_id: string }`

## Key Patterns

**Optimistic mutations**: Update UI immediately, revert on API failure
```typescript
await mutate({
  onMutate: (current) => current.filter(r => r.id !== id),
  mutationFn: () => api.post(`/drafts/${id}/approve`),
})
```

**Plan gating**: 402 responses trigger upgrade overlay
```typescript
if (response.planGated) return <PlanGateOverlay requiredPlan="attache" />
```

**Timezone auto-sync**: `TimezoneSync` component detects browser timezone on first login and saves to profile

**Realtime subscription pattern**:
```typescript
useRealtimeSubscription<Email>({
  table: 'emails',
  event: 'INSERT',
  onInsert: (email) => addEmail(email),
})
```

## Build & Deploy

```bash
# Development
npm run dev                    # Hot reload on :3000

# Production build
npm run build                  # Standalone output for Docker
npm start                      # Production server

# Docker
docker build -t regent-frontend .
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_SUPABASE_URL=... \
  -e NEXT_PUBLIC_SUPABASE_ANON_KEY=... \
  regent-frontend
```

### Docker Build (multi-stage)
1. **deps**: Install node_modules
2. **builder**: `npm run build` with `BACKEND_URL` build arg
3. **runner**: Minimal Node 20 Alpine with standalone output

## Performance

- React Compiler enabled (auto-memoization)
- App Router automatic code splitting
- Standalone Docker output
- Target: Lighthouse > 90, FCP < 1.5s
