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
| `/` | Homepage with arcade theme | Public |
| `/games` | Games showcase (10 games) | Public |
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
│   ├── finance/                  # Financial dashboard
│   ├── games/                    # Games showcase
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

---

## Development Workflow

### Local Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Open browser
# http://localhost:3000
```

### Making Changes

1. Create feature branch (optional)
2. Make code changes
3. Run `npm run lint -- --fix` to fix formatting
4. Test locally
5. Commit with descriptive message
6. Push to `main` branch
7. Amplify auto-deploys
8. Verify on production

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

### Latest Session: July 21, 2026

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

#### Files Modified
- `app/api/blog/route.ts` - Added date sorting for combined posts
- `app/blog/[slug]/page.tsx` - Converted to server component with `generateMetadata`
- `app/blog/[slug]/BlogPostClient.tsx` - New client component extracted from page
- `app/api/blog/create/route.ts` - Added plain text to HTML conversion
- `app/api/blog/[slug]/route.ts` - Added plain text to HTML conversion for updates

#### Architecture Notes
- **OG Metadata**: The `generateMetadata` function fetches the post server-side and returns proper Open Graph tags including the image URL (converted to absolute URL for external use)
- **Plain Text Detection**: The converter checks for HTML block-level tags (`<p>`, `<div>`, `<h1-h6>`, `<ul>`, `<ol>`, etc.) to determine if content is already HTML
- **Paragraph Splitting**: Uses regex `/\n\s*\n/` to split on double newlines (paragraph breaks)

4. **Added Rich Text Editor Toolbar**
   - Added formatting buttons: Bold, Italic, Underline, Heading
   - Added Color dropdown: Red, Purple, Gold, Green, Blue, White
   - Added Size dropdown: Small, Normal, Large, X-Large, Huge
   - Select text and click a button to wrap it in HTML tags

5. **Added Post Scheduling**
   - New "Schedule Post" date/time picker in the create form
   - Posts scheduled for the future won't appear on the blog until that date
   - Immediate publish if no date selected

#### Database Changes Required

Run this SQL in Supabase SQL Editor to add the scheduling column:

```sql
-- Add scheduled_at column to blog_posts table
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS scheduled_at TIMESTAMP WITH TIME ZONE;

-- Create index for efficient filtering
CREATE INDEX IF NOT EXISTS idx_blog_posts_scheduled_at ON blog_posts(scheduled_at);
```

#### Pending
- Test creating a new blog post with the rich text editor
- Test scheduling a post for a future date
- Verify OG images appear in link previews

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

*Last updated: July 21, 2026*
*Maintained by: Development Team*
