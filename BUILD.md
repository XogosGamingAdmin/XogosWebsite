# XogosBoard - Complete Developer Guide

## Table of Contents
1. [Project Overview](#project-overview)
2. [Tech Stack](#tech-stack)
3. [Project Structure](#project-structure)
4. [Environment Setup](#environment-setup)
5. [Database Setup (Supabase)](#database-setup-supabase)
6. [Authentication System](#authentication-system)
7. [Frontend Architecture](#frontend-architecture)
8. [Backend Architecture](#backend-architecture)
9. [Deployment (AWS Amplify)](#deployment-aws-amplify)
10. [Feature Documentation](#feature-documentation)
11. [Development Workflow](#development-workflow)
12. [Troubleshooting](#troubleshooting)
13. [Session History](#session-history)

---

## Project Overview

**XogosBoard** is a Next.js 14 application for Xogos Gaming Inc, deployed at https://www.xogosgaming.com

### Main Components:
- **Public Marketing Website** - Games, Blog (700+ posts), About, Documentation
- **Board of Directors Portal** - Secured dashboard with Google OAuth
- **Admin Panel** - Statistics, Financials, Blog management, Image library
- **Financial Dashboard** - Stripe integration for membership tracking
- **Real-time Collaboration** - Liveblocks for documents (Text, Whiteboard, Spreadsheet)

### Key URLs:
| URL | Description | Access |
|-----|-------------|--------|
| `/` | Homepage — "Arcade 2.0 Supercharged" (audience switcher, game cabinet, subject cartridges, quest log, power-up meter, pricing) | Public |
| `/games` | Games showcase (16 games) | Public |
| `/blog` | Blog with 700+ posts | Public |
| `/board` | Board room visualization (public dashboard) | Public |
| `/boardroom` | Board member menu (6 cards) | Authenticated |
| `/boardroom/skills-matrix` | Skills self-assessment | Authenticated |
| `/boardroom/skills-matrix/results` | Team skills & gap analysis | Authenticated |
| `/boardroom/enterprise` | Corporate structure | Authenticated |
| `/dashboard` | Board member dashboard | Authenticated |
| `/admin/posts` | Blog post management | Zack only |
| `/admin/images` | Image library | Zack only |
| `/admin/statistics` | Statistics management | Zack only |
| `/finance` | Financial dashboard | Audit Committee |

---

## Tech Stack

### Frontend
- **Framework:** Next.js 14.2.3 (App Router)
- **Language:** TypeScript
- **Styling:** CSS Modules
- **Charts:** Recharts 2.15.0
- **Real-time:** Liveblocks 2.24.4 (DO NOT UPGRADE - v3 has bugs)

### Backend
- **Runtime:** Node.js (server actions + API routes)
- **Auth:** NextAuth v5.0.0-beta with Google OAuth
- **Payments:** Stripe (webhooks for membership tracking)

### Database
- **Primary:** Supabase PostgreSQL (via pooler)
- **Storage:** Supabase Storage (blog images)

### Deployment
- **Hosting:** AWS Amplify
- **Domain:** www.xogosgaming.com
- **CI/CD:** Auto-deploy on push to `main` branch

### Package Manager
- **npm** (package-lock.json) - primary
- **yarn** (yarn.lock) - also present

---

## Project Structure

```
XogosWebsite/
├── app/                          # Next.js App Router pages
│   ├── (boardroom)/              # Authenticated board member portal
│   │   ├── layout.tsx            # Auth check, redirects to /signin
│   │   └── boardroom/            # /boardroom routes
│   │       ├── page.tsx          # Main menu (6 cards)
│   │       ├── skills-matrix/    # Skills assessment
│   │       ├── enterprise/       # Corporate structure
│   │       ├── bylaws/           # Bylaws
│   │       ├── initiatives/      # Initiatives
│   │       └── website-schema/   # Site map
│   ├── (auth)/                   # Auth-related pages
│   ├── admin/                    # Admin pages
│   │   ├── checklists/           # Checklist management
│   │   ├── financials/           # Financial data entry
│   │   ├── images/               # Image library
│   │   ├── posts/                # Blog post management
│   │   └── statistics/           # Statistics management
│   ├── api/                      # API routes
│   │   ├── auth/[...nextauth]/   # NextAuth handler
│   │   ├── blog/                 # Blog CRUD + image upload
│   │   ├── initiatives/          # Board initiatives
│   │   ├── liveblocks-auth/      # Liveblocks authentication
│   │   ├── newsletter/           # Newsletter subscriptions
│   │   ├── public-stats/         # Public statistics API
│   │   └── stripe-webhook/       # Stripe event handler
│   ├── board/                    # Public board pages
│   ├── blog/                     # Blog pages
│   ├── dashboard/                # Board member dashboard
│   ├── designs/                  # Homepage design lab (UNTRACKED, local only)
│   ├── finance/                  # Financial dashboard
│   ├── games/                    # Games showcase
│   ├── page.tsx                  # Homepage - "Arcade 2.0 Supercharged"
│   └── ...                       # Other public pages
├── components/                   # React components
│   ├── admin/                    # Admin components (ImageUpload)
│   ├── Dashboard/                # Dashboard cards and grid
│   ├── Documents/                # Document management
│   ├── Marketing/                # Header, Footer
│   └── Newsletter/               # Newsletter form
├── lib/                          # Utilities and business logic
│   ├── actions/                  # Server actions
│   ├── auth/                     # Auth utilities (admin.ts, financial.ts)
│   ├── database.ts               # PostgreSQL connection pool
│   └── supabase.ts               # Supabase Storage client
├── database/                     # SQL schema files
│   ├── schema.sql                # Core tables
│   ├── stripe-schema.sql         # Stripe integration tables
│   ├── manual-entries-schema.sql # Manual entry tables
│   └── blog-images-schema.sql    # Blog images table
├── public/                       # Static assets
│   └── images/                   # Images (logos, board photos, games)
├── content/                      # Markdown blog posts
│   └── posts/                    # 339+ markdown files
└── data/                         # Static data files
    └── generated-posts.json      # Combined blog posts (700+ total)
```

---

## Environment Setup

### Required Environment Variables

Create `.env.local` for local development. These must also be set in AWS Amplify:

```bash
# ====================================
# DATABASE (Supabase PostgreSQL)
# ====================================
DATABASE_HOST=aws-0-us-east-1.pooler.supabase.com
DATABASE_PORT=6543
DATABASE_NAME=postgres
DATABASE_USER=postgres.YOUR_PROJECT_ID
DATABASE_PASSWORD=your_database_password
DATABASE_SSL=true

# ====================================
# AUTHENTICATION (NextAuth + Google)
# ====================================
NEXTAUTH_URL=https://www.xogosgaming.com
NEXTAUTH_SECRET=your_nextauth_secret_key
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# ====================================
# REAL-TIME (Liveblocks)
# ====================================
LIVEBLOCKS_SECRET_KEY=sk_prod_your_liveblocks_key

# ====================================
# PAYMENTS (Stripe)
# ====================================
STRIPE_SECRET_KEY=sk_live_your_stripe_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# ====================================
# STORAGE (Supabase - Blog Images)
# ====================================
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### Getting the Values

1. **Database credentials** → Supabase Dashboard → Settings → Database → Connection string
2. **NEXTAUTH_SECRET** → Generate with `openssl rand -base64 32`
3. **Google OAuth** → Google Cloud Console → APIs & Services → Credentials
4. **Liveblocks** → Liveblocks Dashboard → API Keys
5. **Stripe** → Stripe Dashboard → Developers → API Keys & Webhooks
6. **Supabase Storage** → Supabase Dashboard → Settings → API

---

## Database Setup (Supabase)

### Current Configuration
- **Project ID:** bqeurqjjrcrbrtsgmnlp
- **Region:** US East 1
- **Connection:** Via Supabase Pooler (Transaction mode)

### Database Tables

Run these SQL files in order in Supabase SQL Editor:

1. **`database/schema.sql`** - Core tables:
   - `users` - Board members
   - `groups` - Document access groups
   - `user_groups` - Junction table
   - `checklist_items` - Monthly meeting tasks
   - `board_member_profiles` - RSS preferences
   - `xogos_statistics` - Company metrics
   - `xogos_financials` - Financial data
   - `newsletter_subscriptions` - Newsletter signups
   - `page_visits` - Analytics
   - `error_logs` - Error tracking
   - `board_initiatives` - Published initiatives
   - `rss_subscriptions` - RSS feed subscriptions

2. **`database/stripe-schema.sql`** - Stripe integration:
   - `stripe_events` - Webhook event log
   - `stripe_customers` - Customer records
   - `stripe_subscriptions` - Membership subscriptions
   - `stripe_payments` - Payment records

3. **`database/manual-entries-schema.sql`** - Manual data entry:
   - `manual_members` - Manually added members
   - `manual_revenue` - Manually added revenue

4. **`database/blog-images-schema.sql`** - Image storage:
   - `blog_images` - Uploaded image metadata

### Supabase Storage Setup

1. Go to Supabase Dashboard → Storage
2. Create bucket: `blog-images`
3. Make it **Public**
4. Set file size limit: **5MB**
5. Allow MIME types: `image/jpeg, image/png, image/webp, image/gif`

---

## Authentication System

### How It Works

1. **Public pages** - No auth required
2. **Board Dashboard** (`/dashboard`) - Requires Google sign-in with whitelisted email
3. **Admin pages** (`/admin/*`) - Requires specific admin permissions
4. **Financial Dashboard** (`/finance`) - Requires audit committee membership

### Email Whitelists

Located in `lib/auth/`:

**`authorized-emails.ts`** - Board members who can access dashboard:
- zack@xogosgaming.com
- enjoyweaver@gmail.com
- braden@kennyhertzperry.com
- mckaylaareece@gmail.com
- sturs49@gmail.com
- terrence@terrencegatsby.com

**`admin.ts`** - Admin functions:
```typescript
// General admins (dashboard admin features)
ADMIN_EMAILS = ["zack@xogosgaming.com", "enjoyweaver@gmail.com"]

// Statistics/Financials updates
STATISTICS_ADMIN_EMAILS = ["zack@xogosgaming.com"]

// Blog post management
BLOG_ADMIN_EMAILS = ["zack@xogosgaming.com"]
```

**`financial.ts`** - Financial dashboard access:
```typescript
FINANCIAL_ADMIN_EMAILS = ["zack@xogosgaming.com", "enjoyweaver@gmail.com"]
```

### Auth Flow

```
User clicks "Board Sign-In"
    ↓
/signin?callbackUrl=/dashboard
    ↓
Google OAuth (only whitelisted emails)
    ↓
/api/auth/callback/google
    ↓
Session created with user.info
    ↓
Redirect to /dashboard
```

---

## Frontend Architecture

### Key Components

**Dashboard Cards** (`components/Dashboard/Cards/`):
- `BoardMemberProfileCard` - User profile with avatar
- `XogosStatisticsCard` - Stats with growth chart
- `XogosFinancialsCard` - Financial overview
- `QuickLinksCard` - Links to Scholarships, Finance (conditional)
- `RecentBoardInsightsCard` - Recent documents & initiatives
- `MonthlyMeetingChecklistCard` - Task checklist
- `RSSFeedCard` / `MultiRSSFeedCard` - News feeds
- `SiteAnalyticsCard` - Page visit stats (admin only)
- `AllBoardMemberTasksCard` - All tasks overview (admin only)
- `ErrorLoggingCard` - Error monitoring (admin only)

**Admin Components** (`components/admin/`):
- `ImageUpload` - Drag & drop image upload with preview

### Styling Pattern

- CSS Modules (`.module.css` files)
- Dark theme with gradients (`#0d0d1a`, `#1a1a2e`)
- Accent colors: Red (`#e62739`), Purple (`#7928ca`), Gold (`#e6bb84`)
- The homepage maps these to the Play/Learn/Earn theme: red = PLAY, purple = LEARN, gold = EARN
- Animation-heavy sections include `@media (prefers-reduced-motion: reduce)` fallbacks — keep that up when adding new ones

---

## Backend Architecture

### Server Actions (`lib/actions/`)

Server actions are the primary way to interact with the database:

```typescript
// Statistics
getStatistics()           // Get latest stats
getStatisticsHistory()    // Get stats for chart
updateStatistics()        // Add new stats entry (Zack only)

// Financials
getFinancials()           // Get latest financials
updateFinancials()        // Add new financials entry (Zack only)

// Checklists
getChecklists(userId)     // Get user's tasks
createChecklistItem()     // Create task (admin only)
updateChecklistItem()     // Toggle completion
deleteChecklistItem()     // Remove task

// Blog
getBlogPosts()            // Get all posts
createBlogPost()          // Create post (Zack only)
updateBlogPost()          // Edit post (Zack only)

// Financial Dashboard
getMembershipMetrics()    // Combined Stripe + manual data
getRecentStripeEvents()   // Recent webhook events

// Manual Entries
addManualMember()         // Add member manually (Zack only)
addManualRevenue()        // Add revenue manually (Zack only)
```

### API Routes (`app/api/`)

| Route | Method | Description |
|-------|--------|-------------|
| `/api/blog` | GET | List all blog posts |
| `/api/blog/create` | POST | Create new post |
| `/api/blog/[slug]` | GET/PUT | Get or update post |
| `/api/blog/images/upload` | POST | Upload image to Supabase |
| `/api/blog/images/[id]` | GET/PATCH/DELETE | Manage image |
| `/api/blog/images` | GET | List all images |
| `/api/stripe-webhook` | POST | Receive Stripe events |
| `/api/newsletter` | POST | Subscribe to newsletter |
| `/api/initiatives` | GET/POST | Board initiatives |
| `/api/liveblocks-auth` | POST | Liveblocks authentication |
| `/api/public-stats` | GET | Public member count |

### Stripe Webhook Integration

**Setup in Stripe Dashboard:**
1. Go to Developers → Webhooks
2. Add endpoint: `https://www.xogosgaming.com/api/stripe-webhook`
3. Select events:
   - `customer.created`, `customer.updated`, `customer.deleted`
   - `customer.subscription.created`, `customer.subscription.updated`, `customer.subscription.deleted`
   - `invoice.paid`, `invoice.payment_failed`
4. Copy signing secret to `STRIPE_WEBHOOK_SECRET` env var

**Data Flow:**
```
Stripe Event
    ↓
POST /api/stripe-webhook
    ↓
Verify signature
    ↓
Log to stripe_events table
    ↓
Update appropriate table (customers, subscriptions, payments)
    ↓
Financial Dashboard reflects changes
```

---

## Deployment (AWS Amplify)

### Configuration

- **Repository:** GitHub - XogosGamingAdmin/XogosWebsite
- **Branch:** main
- **Build Command:** `npm run build`
- **Output Directory:** `.next`

### Build Process

1. Push to `main` branch
2. Amplify detects change and starts build
3. Runs `npm run prebuild` (merges blog posts)
4. Runs `npm run build` (Next.js build)
5. Deploys to production
6. Available at https://www.xogosgaming.com

### Updating Environment Variables

1. AWS Console → Amplify → XogosWebsite
2. App settings → Environment variables
3. Add/edit variables
4. **Redeploy** for changes to take effect

### Common Build Issues

1. **Prettier errors** - Run `npm run lint -- --fix` locally
2. **TypeScript errors** - Fix type issues before pushing
3. **Missing env vars** - Check Amplify environment variables
4. **Liveblocks errors** - Ensure version is 2.24.4 (not 3.x)

---

## Feature Documentation

### 1. Blog System

**Location:** `/admin/posts` (create/edit), `/blog` (view)

**Features:**
- 700+ posts from markdown files + database
- Categories: AI Education, Debt Free Millionaire, Education, Financial Literacy, Historical Conquest, History, Lesson Plans, Creator's Notes
- Image upload via drag & drop (stored in Supabase)
- HTML content support

**Files:**
- `app/admin/posts/page.tsx` - Post manager
- `app/admin/posts/[id]/page.tsx` - Post editor
- `app/api/blog/create/route.ts` - Create endpoint
- `components/admin/ImageUpload.tsx` - Upload component

### 2. Image Library

**Location:** `/admin/images`

**Features:**
- View all uploaded images
- Copy URL to clipboard
- Delete images
- Filter unused (orphaned) images
- Upload new images directly

**Files:**
- `app/admin/images/page.tsx` - Image library page
- `app/api/blog/images/` - Image API routes
- `lib/supabase.ts` - Supabase Storage client

### 3. Financial Dashboard

**Location:** `/finance`

**Features:**
- Total members (Stripe + manual)
- Revenue breakdown (Stripe vs manual)
- New members this month
- Churn rate
- Revenue trend chart
- Manual entry forms (Zack only)

**Files:**
- `app/finance/page.tsx` - Dashboard page
- `lib/actions/getMembershipMetrics.ts` - Combined metrics
- `lib/actions/manualEntries.ts` - Manual entry CRUD
- `lib/auth/financial.ts` - Access control

### 4. Quick Links Card

**Location:** Dashboard sidebar

**Features:**
- Xogos Scholarships link (all board members)
- Financial Dashboard link (audit committee only)
- Extensible for future links

**Files:**
- `components/Dashboard/Cards/QuickLinksCard.tsx`

### 5. Statistics Dashboard

**Location:** `/admin/statistics` (edit), Dashboard card (view)

**Features:**
- Track accounts, active users, total hours
- Growth chart showing trends over time
- History table in admin view
- Only Zack can update

**Files:**
- `app/admin/statistics/page.tsx`
- `components/Dashboard/Cards/XogosStatisticsCard.tsx`
- `lib/actions/getStatistics.ts`
- `lib/actions/updateStatistics.ts`

### 6. Board Initiatives

**Location:** `/board/initiatives`, `/dashboard/public-post`

**Features:**
- Board members can publish initiatives
- Public visibility on board page
- Member-specific detail pages

**Files:**
- `app/board/initiatives/page.tsx`
- `app/dashboard/public-post/page.tsx`
- `app/api/initiatives/route.ts`

### 7. Real-time Documents (Liveblocks)

**Location:** `/dashboard` → Documents

**Features:**
- Text documents (rich text editor)
- Whiteboards (drawing canvas)
- Spreadsheets (tabular data)
- Real-time collaboration
- Multi-select delete

**Important:** Keep Liveblocks at version 2.24.4. Version 3.x has initialization bugs.

### 8. Homepage — "Arcade 2.0 Supercharged"

**Location:** `/` — `app/page.tsx` + `app/page.module.css`

A single `"use client"` component (~2,200 lines) aimed at homeschool families
and educators, keeping the Play/Learn/Earn theme. Shipped August 2026,
replacing the Game Boy arcade homepage.

**How it is organized:** the page defines each section as an element in a
`Record<SectionKey, React.ReactElement>`, then renders them in the order given
by `sectionOrder: Record<Audience, SectionKey[]>`. Changing the selected
audience re-messages *and* reorders the page.

**Key mechanics:**
- `Audience = "student" | "parent" | "educator"` — defaults to `"parent"`
- `cartridgeGames(subject)` — builds each Subject Cartridge and appends
  Lightning Round to all six (cross-subject quiz). "N GAMES LOADED" counts are
  computed from `games.length`; **do not hardcode them**
- `METER_MAX` — derived from the daily-quest checklist total, so adding a quest
  automatically rebalances the Scholarship Power-Up Meter
- `CtaLink.external` — renders `<a target="_blank">` for outbound links
  (myXogos portal, Historical Conquest signup) vs Next `<Link>` for internal
- Achievements, confetti, and screen shake are driven by `useEffect` watching
  derived coin totals

**Data it depends on:**
- `/api/public-stats` → the Players Learning stat (falls back to "500+")
- Everything else is hardcoded in the file (games, pricing, schedules, reviews)

**When editing:** the games array here is separate from the one in
`app/games/page.tsx` — adding a game means updating both, or `/games` and the
homepage cabinet will disagree.

---

## Development Workflow

### Local Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Or on another port if 3000 is taken
npm run dev -- -p 4321

# Open browser
# http://localhost:3000
```

**Do not run `npm run build` / `npx next build` while the dev server is
running.** The build overwrites `.next`, and the running dev server then serves
404s for its JS chunks — pages render but never hydrate, which looks like a
mysterious CSS or React bug. Stop the dev server first, and if it happens,
`rm -rf .next` and restart.

### Making Changes

1. Create feature branch (optional)
2. Make code changes
3. Run `npm run lint -- --fix` to fix formatting
   - This reformats the **whole repo**, not just your files. If it touches
     files unrelated to your change, commit that formatting separately so your
     feature diff stays reviewable.
4. Run `npm run typecheck` — must be clean
5. Test locally
6. Stop the dev server, then run `npx next build` to confirm it compiles
7. Commit with descriptive message
8. Push to `main` branch
9. Amplify auto-deploys
10. Verify on production

**Adding images:** put files in `public/images/`, reference them with
`next/image`, and confirm they are tracked by git before pushing
(`git status`). Untracked images resolve fine locally and 404 in production —
a fast way to ship a page full of broken images.

### Git Commit Convention

```bash
git commit -m "$(cat <<'EOF'
Short description of changes

- Bullet point details
- What was added/changed/removed

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>
EOF
)"
```

### Adding New Features

1. **New Page:** Create in `app/` directory
2. **New Component:** Create in `components/`
3. **New Server Action:** Create in `lib/actions/`
4. **New API Route:** Create in `app/api/`
5. **New Database Table:** Add SQL to `database/` and run in Supabase

---

## Troubleshooting

### Common Issues

**"Cannot read properties of undefined (reading 'as')"**
- Liveblocks version issue
- Ensure `@liveblocks/*` packages are at 2.24.4
- Do NOT upgrade to 3.x

**Database connection errors**
- Check `DATABASE_HOST` is correct Supabase pooler URL
- Verify `DATABASE_SSL=true` is set
- Check password doesn't have special characters that need escaping

**Stripe webhooks not working**
- Verify webhook endpoint URL in Stripe Dashboard
- Check `STRIPE_WEBHOOK_SECRET` matches
- Ensure events are selected in webhook configuration

**Images not uploading**
- Check Supabase Storage bucket exists (`blog-images`)
- Verify bucket is public
- Check `SUPABASE_SERVICE_ROLE_KEY` is set

**Authentication issues**
- Verify `NEXTAUTH_URL` matches deployed URL
- Check `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`
- Ensure redirect URI in Google Console matches

### Debug Mode

Enable NextAuth debug in `auth.ts`:
```typescript
export const config = {
  debug: true,
  // ...
}
```

### Checking Logs

1. AWS Amplify → App → Build logs (build issues)
2. AWS Amplify → App → Access logs (runtime issues)
3. Browser DevTools → Console (client errors)
4. Supabase Dashboard → Logs (database issues)

---

## Session History

### Latest Session: August 5-7, 2026 — New Homepage Shipped

#### TL;DR for the next developer

The homepage was completely replaced. `app/page.tsx` is no longer the Game Boy
arcade page — it is now **"Arcade 2.0 Supercharged"**, an audience-aware page
built for homeschool families and educators. It is **live in production**
(pushed to `main`, commit `44c4f91`).

Three things that will surprise you if nobody tells you:

1. **`app/designs/` is untracked and local-only.** It holds the 5 design
   concepts and an archive of the old homepage. It was deliberately NOT
   committed, so a fresh clone will not have it — but a working copy from this
   session will show it as untracked. Do not "clean it up" assuming it is
   stale; it is the design history. See *Design Lab* below.
2. **`app/designs/design5/` is a near-duplicate of `app/page.tsx`.** Design 5
   became the homepage. The two were kept in sync manually. If you edit the
   homepage, either re-sync design5 or delete the design lab.
3. **Never run `npx next build` while `next dev` is running** — see *Gotchas*.

#### What is live now

Pushed to `main` (auto-deploys to https://www.xogosgaming.com via Amplify):

| Commit | What |
|--------|------|
| `587b92a` | Prettier formatting only — 26 files reformatted by `npm run lint`. Line wrapping, no behavior change. Isolated so it does not muddy the feature diff. |
| `44c4f91` | The new homepage, `/games` additions, social share image, 10 new images. |

#### The new homepage (`app/page.tsx`, `app/page.module.css`)

A single large `"use client"` component (~2,200 lines). Structure:

- **"Choose Your Player" audience switcher** — `Audience = "student" | "parent" | "educator"`, defaults to `"parent"`. Selecting a player swaps the hero subtitle, CTAs, and a benefits panel, and **reorders the page sections** via `sectionOrder: Record<Audience, SectionKey[]>`. Sections are built as elements in a `Record<SectionKey, React.ReactElement>` and rendered in that order.
- **The Game Cabinet** — 12 games in a fixed 4-column grid (3 rows of 4) with subject filter chips and a modal carrying a youtube-nocookie embed. Its `allGames` array is local to this file and is a subset of the 16 titles on `/games` — the two lists are maintained separately.
- **Subject Cartridges** — six 3D flip cards, one per subject. Built by mapping `cartridgeDefs` through `cartridgeGames()`, which appends **Lightning Round to every cartridge** (it is a cross-subject quiz; the History cartridge skips the duplicate). The "N GAMES LOADED" hints are computed from `games.length` — do not hardcode them again, they drifted badly when they were literals.
- **Weekly Quest Log** — Mon–Fri tabs showing sample homeschool day schedules with Xogos rows highlighted.
- **Scholarship Power-Up Meter** — a daily quest checklist; checking items animates coins into a jar, fills a meter (`METER_MAX` is derived from the checklist total), and drives a rank from ROOKIE to SCHOLAR. Completing everything triggers confetti, a screen shake, and an achievement.
- **Pricing — "SELECT YOUR PASS"** — $7/month, $70/year, $150 lifetime.
- **Achievements** — six unlockable achievements with slide-in toasts and a trophy HUD; plus an event ticker marquee and count-up stat cards.

Homepage-only details that differ from the design5 preview:
- `<PageTracker pagePath="/" pageName="Homepage" />` is present (previews omit it so they do not pollute analytics).
- **Players Learning** stat is fetched from `/api/public-stats` (fed by Admin → Statistics → Accounts) and falls back to "500+" when the API returns nothing.
- No "All Designs" corner badge.

#### Subscription links (important — two different destinations)

| Button | Destination |
|--------|-------------|
| Start Monthly | `https://www.myXogos.com` |
| Go Yearly | `https://www.historicalconquest.com/xogos-gaming` |
| Unlock Lifetime | `https://www.historicalconquest.com/xogos-gaming` |
| "Start Playing" CTAs (hero + final) | `https://www.myXogos.com` |

External links render as `<a target="_blank" rel="noopener noreferrer">`; the
`CtaLink` type carries an `external?: boolean` flag so the hero can render a
Next `<Link>` for internal destinations and an `<a>` for outbound ones.

The Lifetime tier is badged **"2026 LAUNCH SPECIAL"** and carries a note that it
is available in 2026 only, as a promotion for the platform's opening year.
Membership runs through age 19.

#### Content and data changes

- **Splunker** — new game added to the homepage cabinet and to `/games`. Image `public/images/games/Splunker.png`, video `uSYO-wM6t90`.
- **Historical Conquest** — tutorial video `OUg4Bu6AbnI` added (it previously had none) in both `app/page.tsx` and `app/games/page.tsx`.
- **Body Battle** and **TimeQuest** added to the homepage cabinet (both already existed on `/games`).
- Stats strip: Educational Games set to **18**.

#### Generated art (10 new images)

| Image | Path | Used for |
|-------|------|----------|
| Player portraits (3) | `public/images/players/player-{student,parent,educator}.png` | "Choose Your Player" cards, circular pixel-art portraits (replaced 🎮/🏠/🏫 emoji) |
| Review avatars (3) | `public/images/players/review-{1,2,3}.png` | Player Reviews (review-2→Sarah, review-3→Marcus, review-1→Denise) |
| iPlay coin mascot | `public/images/iplay-coin.png` | Hero, circular frame with a bob animation |
| Homeschool family photo | `public/images/homeschool-family.png` | "Built for Homeschool Families" banner |
| Social share image | `public/images/og-homepage.png` | `app/layout.tsx` openGraph + twitter metadata |
| Splunker key art | `public/images/games/Splunker.png` | Game cabinet + `/games` |

Supporting CSS appended to `app/page.module.css`: `.playerPortrait`,
`.coinMascot`, `.familyBanner`, `.familyPhotoWrap`, `.familyCopy`,
`.familyStamp`, `.reviewAvatar`, `.pricingPromoNote` (+ responsive and
`prefers-reduced-motion` variants).

Known limitations of the art:
- **The OG image is 1024×1024, not 1200×630** — social platforms will crop or letterbox it. Regenerating at 1200×630 is the highest-value fix.
- The coin mascot has a **baked-in gold background** (not transparent), so it is shown inside a circular frame. A transparent version would allow free-floating placement.
- Source PNGs are 0.5–2.4 MB. `next/image` resizes on delivery (avatars serve at 64px), so page weight is fine, but the repo carries full-size files. `sharp` is not installed, so there is no local downscaling step.

#### Design Lab (`app/designs/`) — UNTRACKED, local only

Five homepage concepts plus an archive of the previous homepage, each a
standalone `"use client"` page in `MarketingLayout` with hardcoded stats, no
DB/API calls, and no `PageTracker`. Gallery index at `/designs`.

| Route | Concept |
|-------|---------|
| `/designs/original` | The previous Game Boy homepage, archived for comparison |
| `/designs/design1` | "Homeschool Command Center" — warm cream/navy, day planner, curriculum map, scholarship calculator |
| `/designs/design2` | "Adventure Quest Map" — twilight quest path, hidden coin hunt, subject islands |
| `/designs/design3` | "The Homeschool Notebook" — scrapbook/washi tape, flip flashcards, lesson planner, sticker chart |
| `/designs/design4` | "Arcade 2.0: Choose Your Player" — the basis for the final design |
| `/designs/design5` | "Arcade 2.0 Supercharged" — what became the homepage |

Deliberately not committed: pushing it would publish six extra pages
(including rejected concepts) on the production marketing site where they
could be indexed. To ship it anyway, `git add app/designs/` — it builds clean.

#### Verification performed

- `npm run typecheck` — clean.
- `npx next build` — exits 0 with the full site (443 static pages).
- Browser-verified with Puppeteer (project devDependency): hero hydration, all six cartridges flipped and inspected, CTA destinations dumped per audience, pricing and reviews screenshotted.
- Only ESLint error in the repo is pre-existing in `lib/blog/getPosts.ts`; `next.config.js` sets `eslint.ignoreDuringBuilds: true`, so it does not block deploys.

#### Gotchas learned this session

- **Never run `npx next build` while `next dev` is running.** It overwrites the dev server's `.next`, the browser then 404s on `_next/static/chunks/*`, React never hydrates, and the hero renders invisible (it sits at `opacity: 0` waiting on `isLoaded`). It looks exactly like a CSS bug and is not one. Fix: stop dev, `rm -rf .next`, restart.
- Dev preview ran on **port 4321** this session (`npm run dev -- -p 4321`); port 3000 was in use.
- `/api/track-visit` and `/api/public-stats` return 500 locally without database credentials. Expected in dev — they work in production.
- The `extra/` folder is a local scratch area for source images. It is untracked by convention and should stay that way; copy what you need into `public/images/`.

#### Xogos YouTube channel reference (verified Aug 6, 2026)

Channel: **Xogos Educational Gaming Platform** — `https://www.youtube.com/channel/UCzT0I4sluqM3Eor8WE7vfag`
Authoritative video list via YouTube's own RSS feed:
`https://www.youtube.com/feeds/videos.xml?channel_id=UCzT0I4sluqM3Eor8WE7vfag`

**Verify every video ID before embedding** with
`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=<ID>&format=json`
— it returns the real title and channel, and a wrong ID renders a dead player.
(Channel pages are JavaScript-rendered and cannot be scraped directly; use the
RSS feed. Do not route through third-party reader proxies.)

Verified video IDs not yet used on the site: Classics Games `SJ2eKK0gE-A`,
Life of a City `6cwoINDCuN4`, Debate Arena `klRAotCaK9M`, Turbo Type
`vtS56-tjnO0`, Xogos Banking/Scholarships `-pYdT1wYXSg`, Time Quest
`CoGNW2n37qg`, Body Battle `rYno4aLSEVw`, Medical Diagnosis `RuGAsyLPpJE`,
Monster Math `rgP4ryHnZgY`, Bug and Seek `tH1npwYQkUM`, Totally Medieval
`KM30p99cjPk`, Lightning Round `0krDj6C9du0`, Exploration Library `Gzv3I_oA33Y`.

#### Where we left off / next steps

Verify on production first:
- [ ] **Players Learning** stat shows the real number, not the "500+" fallback (confirms `/api/public-stats` is reachable).
- [ ] Social preview when sharing the URL (it will use the new arcade art, cropped from square).
- [ ] Interactive sections on a real phone — cartridges, quest log, power meter.

Then, in rough priority order:
- [ ] **Regenerate the OG image at 1200×630** so social previews are not cropped.
- [ ] **Reconcile the game count.** The homepage stat claims 18 Educational Games; `/games` lists 16 titles. The YouTube channel shows Classics Games, Life of a City, Debate Arena, and Turbo Type exist but are not on the site — adding them would make 18 true and is the cleanest fix.
- [ ] **Add missing tutorial videos** on `/games`: Debt-Free Millionaire, iServ Volunteer, Shakespeare's Conspiracy, TimeQuest (candidate IDs above).
- [ ] **No parent + student on a laptop video exists** on the channel — the homepage uses a generated still instead. Real footage would be the strongest asset for the parent audience and needs to be filmed or licensed.
- [ ] **Decide the fate of `app/designs/`** — commit it, delete it, or leave it local. While it exists, homepage edits should be mirrored to `design5` or the two will silently diverge.
- [ ] The Player Reviews are clearly labeled sample quotes. Replace them with real testimonials when available.

---

### Previous Session: July 21-22, 2026

#### Work Completed

1. **Fixed Blog Post Ordering (Newest First)**
   - Issue: New blog posts weren't appearing at the top of the blog page
   - Root cause: The API merged DB posts with static posts without re-sorting by date
   - Solution: Added server-side sorting in `app/api/blog/route.ts` using a date parsing helper

2. **Fixed Blog Post Link Preview Images (Open Graph)**
   - Issue: When sharing blog post links, the image didn't show up in the preview
   - Root cause: Blog post page was a client component (`"use client"`) which doesn't support `generateMetadata`
   - Solution: Restructured the blog post page into:
     - `page.tsx` - Server component with `generateMetadata` for OG tags (title, description, image)
     - `BlogPostClient.tsx` - Client component for interactivity
   - Now properly exports Open Graph metadata including the post's image, title, and description

3. **Fixed Paragraph Preservation from Pasted Text**
   - Issue: When pasting plain text into the Content field, paragraph breaks were lost
   - Root cause: The content was stored as-is without HTML formatting
   - Solution: Added `convertPlainTextToHtml()` helper that:
     - Detects if content already has HTML tags (p, div, h1-h6, ul, ol, etc.)
     - If plain text, splits on double newlines and wraps each paragraph in `<p>` tags
     - Converts single newlines within paragraphs to `<br>` tags
   - Applied to both create (`/api/blog/create`) and update (`/api/blog/[slug]`) routes

4. **Added Rich Text Editor Toolbar**
   - Added formatting buttons: Bold, Italic, Underline, Heading
   - Added Color dropdown: Red, Purple, Gold, Green, Blue, White
   - Added Size dropdown: Small, Normal, Large, X-Large, Huge
   - Select text and click a button to wrap it in HTML tags

5. **Added Post Scheduling**
   - New "Schedule Post" date/time picker in the create form
   - Posts scheduled for the future won't appear on the blog until that date
   - Immediate publish if no date selected
   - Database column `scheduled_at` added to `blog_posts` table

6. **Fixed Newest Post as Featured Article**
   - Issue: The featured article was hardcoded to a specific post with `featured: true`
   - Solution: Changed logic so the first post in the sorted list (newest) is always featured
   - Removed dependency on the `featured` boolean flag for display

7. **Fixed Blog Caching Issues**
   - Issue: New posts weren't appearing even after database had them
   - Root cause: Next.js was caching the API response at the edge/CDN level
   - Solution: 
     - Added `export const dynamic = "force-dynamic"` to API route
     - Added `Cache-Control: no-store` headers to API response
     - Added `cache: "no-store"` option to fetch call on blog page
   - Blog now always fetches fresh data from the database

#### Files Modified
- `app/api/blog/route.ts` - Date sorting, cache control, dynamic rendering
- `app/blog/page.tsx` - Newest-first featured logic, cache-busting fetch
- `app/blog/[slug]/page.tsx` - Server component with `generateMetadata`
- `app/blog/[slug]/BlogPostClient.tsx` - New client component for interactivity
- `app/api/blog/create/route.ts` - Plain text conversion, scheduling support
- `app/api/blog/[slug]/route.ts` - Plain text conversion for updates
- `app/admin/posts/page.tsx` - Rich text toolbar, schedule date picker
- `app/admin/posts/page.module.css` - Toolbar and date input styles
- `database/schema.sql` - Added `scheduled_at` column to blog_posts

#### Database Changes (Already Applied)

The following SQL was run in Supabase:

```sql
-- Add scheduled_at column to blog_posts table
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS scheduled_at TIMESTAMP WITH TIME ZONE;

-- Create index for efficient filtering
CREATE INDEX IF NOT EXISTS idx_blog_posts_scheduled_at ON blog_posts(scheduled_at);
```

#### Architecture Notes
- **OG Metadata**: The `generateMetadata` function fetches the post server-side and returns proper Open Graph tags including the image URL (converted to absolute URL for external use)
- **Plain Text Detection**: The converter checks for HTML block-level tags (`<p>`, `<div>`, `<h1-h6>`, `<ul>`, `<ol>`, etc.) to determine if content is already HTML
- **Caching**: Blog API uses `dynamic = "force-dynamic"` to bypass Next.js static generation and always query the database
- **Featured Post**: Always the first item in the date-sorted list, not based on a `featured` flag
- **Scheduling**: Posts with `scheduled_at` in the future are filtered out by the SQL query `WHERE scheduled_at IS NULL OR scheduled_at <= NOW()`

#### Key Commits
```
4c1c88b - Fix blog caching - force fresh data on every request
19684bf - Add rich text editor, post scheduling, fix TypeScript error
05d9bd4 - Fix blog post display: newest post as featured, OG images, paragraph preservation
```

#### Pending
- Verify new blog posts appear correctly on production after hard refresh
- Test the rich text editor formatting buttons
- Test scheduling a post for a future date

---

### Previous Session: July 20, 2026

#### Work Completed

1. **Fixed Blog Image Upload to Supabase Storage**
   - Issue: "Failed to upload image" error when uploading images in `/admin/posts`
   - Root cause: Supabase environment variables were not exposed in `next.config.js`
   - Solution: Added `NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` to the `env` config in `next.config.js`

2. **Created `blog_images` Table in Supabase**
   - Table was missing from the Supabase database
   - Created table with proper schema for storing image metadata

3. **Improved Error Handling in Image Upload API**
   - Added specific error messages to `app/api/blog/images/upload/route.ts`
   - Now returns detailed errors: missing env vars, storage errors, database errors

4. **Added Supabase Domain to Image Config**
   - Added `bqeurqjjrcrbrtsgmnlp.supabase.co` to allowed image domains in `next.config.js`

#### Environment Variables Required in AWS Amplify

Make sure these are set in Amplify → App settings → Environment variables:

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://bqeurqjjrcrbrtsgmnlp.supabase.co` |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key from Supabase Dashboard → Settings → API |

**Important:** These variables MUST also be listed in `next.config.js` under the `env` section, or they won't be available to the Next.js runtime on Amplify.

#### Database Changes Required

Run this SQL in Supabase SQL Editor (already done):

```sql
-- Blog Images Table
DROP TABLE IF EXISTS blog_images;

CREATE TABLE blog_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  storage_path TEXT NOT NULL,
  public_url TEXT NOT NULL,
  original_filename TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  mime_type TEXT NOT NULL,
  alt_text TEXT,
  uploaded_by TEXT NOT NULL,
  post_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_blog_images_post_id ON blog_images(post_id);
CREATE INDEX idx_blog_images_orphaned ON blog_images(post_id) WHERE post_id IS NULL;
CREATE INDEX idx_blog_images_created_at ON blog_images(created_at DESC);
```

#### Supabase Storage Setup

1. Go to Supabase Dashboard → Storage
2. Create bucket: `blog-images` (if not exists)
3. Set bucket to **Public**
4. Allowed MIME types: `image/jpeg, image/png, image/webp, image/gif`
5. Max file size: 5MB

#### Key Commits
```
3462004 - Add detailed error messages to image upload API
3f511a2 - Add Supabase environment variables to Next.js config
```

#### Files Modified
- `next.config.js` - Added Supabase env vars and image domain
- `app/api/blog/images/upload/route.ts` - Added detailed error messages

#### Pending
- Test image upload after Amplify redeploys with the new config
- Confirm images persist and display correctly in blog posts

---

### Previous Session: May 29-30, 2026

#### Work Completed

1. **Homepage Layout Redesign**
   - Active Incentive Programs: Changed to text-left, images-right layout (matching Classes section)
   - Student Protection: Changed to text-left, 2x3 image grid on right
   - Special Events: Made event cards smaller and more compact
   - Players Learning stat now pulls dynamically from database (Admin Statistics → Accounts field)

2. **Student Protection Page Updates**
   - Changed "parent approval" to "student approval"
   - Replaced all `/membership` links with `https://www.xogosgaming.com`

3. **Incentives Page Updates**
   - Changed Pryde Gym banner from "Coming Soon - End of 2026" to "Coming 2026"
   - Changed "1 Hour = 1 iPlay Coin" stat to "Convert Coins from Savings"

4. **ByLaws Page Updates** (`/boardroom/bylaws`)
   - Renamed "Crypto & Exchanges" board role to "Technology"
   - Updated description: "Manages technology and evergreen programs to fund scholarships"
   - Removed "Cryptocurrency Audit" requirement
   - Changed "Cryptocurrency Focus" to "Evergreen Funding Focus"
   - Updated mission statement to reference "technology" instead of "cryptocurrency"

5. **Board Dashboard Financials Card**
   - Added line chart showing Revenue vs Expenses trends over time
   - Financial numbers now appear below the graph

6. **Admin Financials History**
   - Removed "Updated By" column, replaced with "Actions" column
   - Added delete button (×) for each row
   - Changed Monthly Pay and Yearly Pay columns to plain numbers (no $ sign)

7. **Board Transparency Feature** (NEW)
   - New page at `/boardroom/transparency` - view meeting attendance records
   - Admin page at `/admin/transparency` - create meetings and edit attendance
   - Tracks for each board member per meeting:
     - Attendance: Absent, Part Time, Full Time
     - Prepared: checkbox (had initiatives ready)
     - In-Person: checkbox (video was on)
   - Only Zack can edit; all board members can view
   - Legend with centered badges on two rows

8. **Security Images**
   - Moved 6 security images from `/extra` to `/public/images/security/`

#### Database Changes Required

Run these SQL commands in Supabase SQL Editor:

```sql
-- Board Transparency Tables
CREATE TABLE IF NOT EXISTS board_meetings (
  id SERIAL PRIMARY KEY,
  meeting_date DATE NOT NULL,
  meeting_name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS meeting_attendance (
  id SERIAL PRIMARY KEY,
  meeting_id INTEGER REFERENCES board_meetings(id) ON DELETE CASCADE,
  member_name TEXT NOT NULL,
  member_email TEXT NOT NULL,
  attendance TEXT NOT NULL CHECK (attendance IN ('absent', 'part_time', 'full_time')),
  prepared BOOLEAN DEFAULT FALSE,
  in_person BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(meeting_id, member_email)
);
```

#### New Files Created
- `app/(boardroom)/boardroom/transparency/page.tsx` - Public transparency view
- `app/(boardroom)/boardroom/transparency/page.module.css` - Transparency styles
- `app/admin/transparency/page.tsx` - Admin attendance editor
- `lib/actions/getMeetings.ts` - Get all meetings
- `lib/actions/createMeeting.ts` - Create new meeting (admin only)
- `lib/actions/deleteMeeting.ts` - Delete meeting (admin only)
- `lib/actions/getAttendance.ts` - Get attendance records
- `lib/actions/upsertAttendance.ts` - Save attendance (admin only)

#### Key Commits
```
38a1186 - Make Players Learning stat dynamic from admin statistics
eff9ed5 - Add Board Transparency feature for tracking meeting attendance
8503cd0 - Rename Half Time to Part Time, center legend badges
16607e3 - Center legend items and move Prepared/In-Person to second row
```

#### Architecture Notes
- **Public Stats API** (`/api/public-stats`) now returns both `totalMembers` and `playersLearning`
- **Transparency Access Control**: Uses `canUpdateStatistics()` from `lib/auth/admin.ts` (Zack only)
- **Attendance Options**: `absent`, `part_time`, `full_time` (note: code uses underscores, display shows "Part Time")

#### Pending
- Google Ad tag integration (user will provide the code)

---

### Previous Session: May 16, 2026

#### Work Completed

1. **Scholarships Page** (`/scholarships`) - Complete redesign
   - Removed fixed $0.10/coin value
   - Added quarterly distribution model explanation
   - Each quarter: Innovate the Future announces fundraising total, students convert coins into a pot, each student receives percentage based on their share of converted coins
   - Example: If $5,000 raised and 10 students each convert 10 coins (100 total), each gets 10% = $500
   - Updated transparency section: digital tracking in Xogos Bank, quarterly FDIC-secured audits

2. **Audit Results Page** (`/audits`) - New page created
   - Changed Q3 2026 audit from August to July
   - Updated 4-step distribution process: Fundraising → Students Convert Coins → Proportional Distribution → Verification & Tracking
   - Added audit timeline with Q1-Q4 2026 schedule

3. **Classes Page** (`/classes`) - Major updates
   - Added "15 Classes launching by end of July 2026!" banner
   - Listed upcoming classes: Personal Finance, Journalism, Game Design, Business, Marine Biology
   - New "Earn Coins While You Learn" section with examples:
     - KitchenLab Academy: Submit recipes with photos = earn coins
     - Journalism: Submit article = 1 coin, article published = 5 coins

4. **Active Incentives Page** (`/incentives`) - Section reorder
   - Moved "Active Incentive Programs" section above "How Active Incentives Work"
   - Updated stat from "$0.10 Per Coin Value" to "Quarterly Fund Distribution"

5. **Games Page** (`/games`) - YouTube video integration
   - Added embedded YouTube players in game modals
   - Privacy-enhanced: youtube-nocookie.com with rel=0, modestbranding=1, disablekb=1
   - Added overlay blockers to prevent clicking YouTube links:
     - Top blocker (70px) - blocks title/channel/share links
     - Bottom-right blocker (150x50px) - blocks YouTube logo
   - Video IDs added for: Digital Frontier, Totally Medieval, Bug and Seek, Monster Math, Body Battle, Exploration Library, Hunt the Past, Lightning Round, Medical Diagnosis, GeoTag
   - Games without videos show "Video Coming Soon": Debt-Free Millionaire, Historical Conquest, iServ, Shakespeare's Conspiracy, TimeQuest

6. **Header Navigation** - Added new links
   - Added "Classes" link to `/classes`
   - Added "Incentives" link to `/incentives`

7. **Footer Navigation** - Added Audit Results link

8. **Homepage** (`/`) - Play + Learn = Earn redesign
   - New intro section with "PLAY + LEARN = EARN" headline
   - Three columns explaining Play (safe gaming), Learn (elective classes), Earn (scholarships)
   - Added PLAY/LEARN/EARN keywords above corresponding sections
   - Removed iServ from games rotation
   - Added YouTube video players in game modals with link blockers
   - Reordered: Free Elective Classes now after Select Your Game
   - Updated text throughout sections

#### Key Commits
```
78a0f84 - Add Play+Learn=Earn intro section, video players in game modals
752b223 - Add scholarships/audits pages, YouTube videos, nav updates
ab86ebb - Add Classes and Incentives pages, update homepage and games with new images
```

#### New Files Created
- `app/scholarships/page.tsx` - Scholarship program page
- `app/scholarships/page.module.css` - Scholarship styles
- `app/audits/page.tsx` - Audit results page
- `app/audits/page.module.css` - Audit page styles

#### Architecture Notes
- **YouTube Embedding:** Uses youtube-nocookie.com for privacy-enhanced mode
- **Link Blocking:** Transparent overlay divs intercept clicks on YouTube branding/links
- **Coin System:** No fixed $ value per coin - proportional quarterly distribution based on total raised funds and coins converted

---

### Previous Session: May 14, 2026

#### Work Completed

1. **Skills Matrix Feature** - Added board member competency tracking system
   - Personal assessment page at `/boardroom/skills-matrix` (31 skills, 6 categories, 1-5 rating)
   - Team results page at `/boardroom/skills-matrix/results` (gap analysis, collective averages)
   - Database table `board_skills` on AWS RDS PostgreSQL
   - API routes: `/api/skills` (all skills) and `/api/skills/my` (user's skills)

2. **New Boardroom Route Group** - Created authenticated board member portal
   - `/boardroom` - Main menu with 6 cards (Dashboard, Skills Matrix, Initiatives, Bylaws, Website Schema, Enterprise)
   - `/boardroom/skills-matrix` - Skills assessment form
   - `/boardroom/skills-matrix/results` - Team skills visualization
   - `/boardroom/bylaws` - Corporate bylaws
   - `/boardroom/documents` - Documents page
   - `/boardroom/initiatives` - Board initiatives
   - `/boardroom/enterprise` - Corporate structure visualization
   - `/boardroom/website-schema` - Website sitemap

3. **Navigation Updates** - Fixed board navigation links
   - Updated footer "Board Room" link: `/board` → `/boardroom`
   - Updated header "Board" nav link: `/board` → `/boardroom`
   - Updated timeline "Return to Board Room" link: `/board` → `/boardroom`
   - Note: `/board` is the PUBLIC board dashboard, `/boardroom` is the AUTHENTICATED menu

4. **Enterprise Page Enhancements**
   - Made product cards clickable (URLs open in new browser tab)
   - Moved RankAI from Xogos Media to Xogos AI
   - Added "Math" category to Monster Math
   - Added www.iservapp.org URL to iServ
   - Moved "Battles and Thrones" to bottom of Xogos Gaming list

#### Key Commits
```
058cb12 - Make enterprise product cards clickable links
ae14202 - Update enterprise page product listings
6ac1463 - Update all pending changes for production deployment
2250cba - Fix board navigation links to point to /boardroom
c8bd13a - Fix TypeScript error in enterprise page product types
b4e58e3 - Add Skills Matrix feature for board member competency tracking
```

#### New Files Created
- `app/(boardroom)/` - Route group for authenticated boardroom pages
- `app/api/skills/` - Skills API routes
- `database/board-skills-schema.sql` - PostgreSQL schema for skills table
- `lib/supabase-skills.ts` - Supabase skills functions (unused, switched to RDS)

#### Database Changes
Run this SQL on AWS RDS PostgreSQL (already done on production):
```sql
CREATE TABLE IF NOT EXISTS board_skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_email TEXT NOT NULL,
  user_name TEXT NOT NULL,
  user_avatar TEXT,
  skill_category TEXT NOT NULL,
  skill_name TEXT NOT NULL,
  proficiency_level INTEGER NOT NULL CHECK (proficiency_level >= 1 AND proficiency_level <= 5),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_email, skill_category, skill_name)
);

CREATE INDEX IF NOT EXISTS idx_board_skills_user_email ON board_skills(user_email);
CREATE INDEX IF NOT EXISTS idx_board_skills_category ON board_skills(skill_category);
```

#### Architecture Notes
- **Route Groups:** `(boardroom)` route group uses parentheses so the folder name doesn't appear in the URL
- **Auth Flow:** `/boardroom` layout checks session; redirects to `/signin?callbackUrl=/boardroom` if unauthenticated
- **Skills Data:** Stored by `user_email` (not user_id) for simplicity; includes name and avatar for display

#### Pending
- None - all features deployed and working

---

### Previous Session: April 20, 2026

#### Work Completed

1. **Domain Transfer** - Migrated from www.histronics.com to www.xogosgaming.com
2. **Code Updates** - Updated all hardcoded domain references in codebase
3. **AWS Amplify** - Custom domain configured, NEXTAUTH_URL updated
4. **Google OAuth** - Added new redirect URI for xogosgaming.com
5. **Route 53 DNS** - MX records configured for Google Workspace email
6. **Email Preservation** - Set up MX records to keep zack@xogosgaming.com working via Google

---

### Previous Sessions Summary

| Date | Major Work |
|------|------------|
| Apr 20, 2026 | Domain transfer to xogosgaming.com, DNS/OAuth config |
| Mar 2, 2026 | Financial Dashboard, Blog Image Upload, Image Library, Quick Links |
| Jan 29, 2026 | Games page Play Now → myXogos.com |
| Jan 28, 2026 | Statistics growth chart, Supabase migration |
| Jan 24, 2026 | Game selection rotation, game modals |
| Jan 23, 2026 | Homepage v4 arcade theme, Easter egg |
| Jan 17, 2026 | Board initiatives system |
| Jan 14, 2026 | Newsletter system, error logging |
| Jan 6, 2026 | Liveblocks fix, multi-select delete |
| Dec 30, 2025 | Document viewing fix |
| Dec 27, 2025 | Dashboard personalization, RSS feeds |
| Dec 19, 2025 | Authentication flow fix |

---

## Contact & Resources

- **Primary Contact:** zack@xogosgaming.com
- **GitHub:** XogosGamingAdmin/XogosWebsite
- **Production:** https://www.xogosgaming.com
- **Supabase:** https://supabase.com/dashboard/project/bqeurqjjrcrbrtsgmnlp
- **AWS Amplify:** https://console.aws.amazon.com/amplify
- **Stripe:** https://dashboard.stripe.com
- **Liveblocks:** https://liveblocks.io/dashboard

### Documentation Links
- [Next.js 14 Docs](https://nextjs.org/docs)
- [NextAuth.js Docs](https://next-auth.js.org/)
- [Supabase Docs](https://supabase.com/docs)
- [Stripe Docs](https://stripe.com/docs)
- [Liveblocks Docs](https://liveblocks.io/docs)

---

*Last updated: August 7, 2026 — new homepage ("Arcade 2.0 Supercharged") shipped to production*
*Maintained by: Development Team*
