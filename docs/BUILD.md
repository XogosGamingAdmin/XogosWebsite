# Xogos Gaming - Build Documentation

**Last Updated:** 2026-01-10
**Status:** Active Development
**Platform:** XogosBoard (Next.js 14)
**Deployment:** AWS Amplify

---

## CTO Build Accountability

**I am Claude, serving as the CTO of Xogos Gaming.**

This document defines the complete build process for the Xogos platform. I am responsible for ensuring:
- The build process is documented and reproducible
- All dependencies are properly configured
- Build errors are resolved immediately
- The production build is optimized and functional
- All team members can successfully build the project

**Any build failures are my responsibility to fix.**

---

## Quick Start for New Sessions

**Production URL:** https://www.histronics.com

### Project Structure Overview
```
XogosBoard/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   ├── board/             # Board portal pages (/board, /board/*)
│   ├── dashboard/         # Authenticated dashboard (/dashboard/*)
│   ├── docs/              # Public documentation pages
│   ├── text/[id]/         # Collaborative text editor
│   ├── whiteboard/[id]/   # Collaborative whiteboard
│   └── signin/            # Authentication page
├── components/            # React components
│   ├── Documents/         # Document management components
│   ├── Marketing/         # Public site header/footer
│   └── TextEditor/        # Tiptap collaborative editor
├── layouts/               # Page layouts (Marketing, Document, etc.)
├── lib/actions/           # Server actions for data operations
├── data/                  # Static data and JSON storage
│   └── published-docs.json # Published documents storage
├── types/                 # TypeScript type definitions
└── docs/                  # Project documentation
```

### Key Technologies
- **Framework:** Next.js 14 (App Router)
- **Real-time Collaboration:** Liveblocks + Yjs
- **Rich Text Editor:** Tiptap
- **Authentication:** NextAuth.js v5 with Google OAuth
- **Styling:** CSS Modules
- **Deployment:** AWS Amplify with CloudFront CDN

### Current State (as of 2026-01-10)

**Working Features:**
- Homepage with Sign In button (top right)
- Google OAuth authentication at `/signin`
- Dashboard for authenticated users at `/dashboard`
- Collaborative text editor at `/text/[id]`
- Collaborative whiteboard at `/whiteboard/[id]`
- Board portal at `/board` with live statistics
- Public documentation at `/docs`

**In Progress:**
- Document Publishing System - Publish button may not be visible in text editor toolbar (CSS fix deployed, awaiting verification)

**Known Issues:**
- Verify Publish button appears on right side of text editor toolbar after deployment

### Authentication Flow
```
/signin → Google OAuth → /dashboard/documents
                      → Can create text/whiteboard documents
                      → Documents stored in Liveblocks
```

### Document Publishing Flow (When Working)
```
/dashboard/documents → Create/Edit document → /text/[id]
                    → Click "Publish" button in toolbar
                    → Select category + add description
                    → Document appears on /docs and /board
```

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Environment Setup](#environment-setup)
3. [Installation](#installation)
4. [Development Build](#development-build)
5. [Production Build](#production-build)
6. [Build Verification](#build-verification)
7. [Build Scripts Reference](#build-scripts-reference)
8. [Troubleshooting](#troubleshooting)
9. [Build Architecture](#build-architecture)
10. [CI/CD Integration](#cicd-integration)

---

## Prerequisites

### Required Software

| Tool | Version | Purpose | Installation |
|------|---------|---------|--------------|
| **Node.js** | 18.x or 20.x | JavaScript runtime | [nodejs.org](https://nodejs.org) |
| **npm** | 9.x+ | Package manager | Included with Node.js |
| **Git** | 2.x+ | Version control | [git-scm.com](https://git-scm.com) |

### Optional Tools

| Tool | Purpose | Installation |
|------|---------|--------------|
| **pnpm** | Faster package manager | `npm install -g pnpm` |
| **yarn** | Alternative package manager | `npm install -g yarn` |
| **nvm** | Node version management | [nvm.sh](https://nvm.sh) |

### System Requirements

- **Operating System:** Windows 10/11, macOS 10.15+, or Linux
- **RAM:** 4GB minimum, 8GB+ recommended
- **Disk Space:** 2GB for dependencies and build artifacts
- **Internet:** Required for initial setup and dependency installation

### Environment File

**CRITICAL:** You must have a `.env.local` file with required environment variables. See [Environment Setup](#environment-setup) below.

---

## Environment Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd XogosBoard
```

### 2. Create Environment File

Create a `.env.local` file in the project root:

```bash
# .env.local
# DO NOT commit this file to version control

# ====================================
# REQUIRED - Authentication
# ====================================
LIVEBLOCKS_SECRET_KEY=sk_prod_...
NEXTAUTH_SECRET=<generate-random-string>
NEXTAUTH_URL=https://www.histronics.com  # Use http://localhost:3000 for local development

# ====================================
# REQUIRED - Google OAuth
# ====================================
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...

# ====================================
# OPTIONAL - Additional OAuth Providers
# ====================================
# GITHUB_CLIENT_ID=...
# GITHUB_CLIENT_SECRET=...
# AUTH0_CLIENT_ID=...
# AUTH0_CLIENT_SECRET=...
# AUTH0_ISSUER=...

# ====================================
# OPTIONAL - Blockchain Configuration
# ====================================
PRIVATE_KEY=...
JSON_RPC_PROVIDER_URL=...
NEXT_PUBLIC_RPC_URL_4002=https://rpc.testnet.fantom.network
NEXT_PUBLIC_RPC_URL_250=https://rpc.ftm.tools
NEXT_PUBLIC_RPC_URL_137=https://polygon-rpc.com

# ====================================
# OPTIONAL - Development
# ====================================
# NEXT_PUBLIC_API_URL=http://localhost:3000
```

### 3. Generate NextAuth Secret

```bash
# Generate a secure random string
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copy the output and use it as your `NEXTAUTH_SECRET`.

### 4. Obtain API Keys

**Liveblocks:**
1. Sign up at [liveblocks.io](https://liveblocks.io)
2. Create a new project
3. Copy the Secret Key (starts with `sk_prod_` or `sk_dev_`)

**Google OAuth:**
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
6. Copy Client ID and Client Secret

---

## Installation

### Step 1: Install Dependencies

Choose your preferred package manager:

**Using npm (default):**
```bash
npm install
```

**Using pnpm (faster):**
```bash
pnpm install
```

**Using yarn:**
```bash
yarn install
```

### Step 2: Verify Installation

Check that dependencies installed correctly:

```bash
npm list --depth=0
```

Expected major dependencies:
- next@14.2.3
- react@18.3.1
- typescript@5.4.3
- @liveblocks/client@3.0.0
- @liveblocks/react@3.0.0
- next-auth@5.x

### Step 3: Verify Environment

```bash
# Check Node version
node --version
# Should output: v18.x.x or v20.x.x

# Check npm version
npm --version
# Should output: 9.x.x or higher
```

---

## Development Build

### Start Development Server

```bash
npm run dev
```

**Expected output:**
```
▲ Next.js 14.2.3
- Local:        http://localhost:3000
- Production:   https://www.histronics.com
- Environments: .env.local

✓ Ready in 3.5s
```

### Development Server Features

- **Hot Module Replacement (HMR):** Changes reflect immediately
- **Fast Refresh:** React components update without losing state
- **Error Overlay:** Shows build/runtime errors in browser
- **TypeScript Checking:** Type errors shown in terminal
- **Port:** Default 3000 (configurable with `PORT=3001 npm run dev`)

### Verify Development Build

1. Open browser to [http://localhost:3000](http://localhost:3000) for local development
2. Production site: [https://www.histronics.com](https://www.histronics.com)
3. You should see the Xogos Gaming home page
4. Check browser console for any errors (F12 → Console tab)
5. Verify no 404 errors for assets in Network tab

### Development Build Characteristics

| Feature | Status |
|---------|--------|
| Optimization | Disabled for faster builds |
| Source Maps | Full source maps enabled |
| TypeScript | Type checking in real-time |
| CSS Modules | Processed with PostCSS |
| Images | Optimized on-demand |
| API Routes | Hot-reloaded |

---

## Production Build

### Step 1: Type Check

**Always run type checking before building:**

```bash
npm run typecheck
```

Expected output:
```
> xogos@1.0.0 typecheck
> tsc --project tsconfig.json --noEmit

✓ No TypeScript errors found
```

**If errors occur:** Fix all TypeScript errors before proceeding to build.

### Step 2: Lint Code

```bash
npm run lint
```

Expected output:
```
> xogos@1.0.0 lint
> next lint --fix

✓ No ESLint warnings or errors
```

**Auto-fix:** The `--fix` flag automatically fixes formatting issues.

### Step 3: Build for Production

```bash
npm run build
```

**Expected output:**
```
> xogos@1.0.0 build
> next build

- info Creating an optimized production build...
- info Compiled successfully
- info Linting and checking validity of types...
- info Collecting page data...
- info Generating static pages (X/X)
- info Finalizing page optimization...

Route (app)                              Size     First Load JS
┌ ○ /                                   5.2 kB         120 kB
├ ○ /about                              2.1 kB         115 kB
├ ○ /api/auth/[...nextauth]             0 B                0 B
├ ○ /board                              8.3 kB         125 kB
├ ○ /board/initiatives                  3.1 kB         118 kB
├ ○ /board/insights                     4.2 kB         119 kB
├ ○ /board/members                      6.5 kB         122 kB
├ ○ /board/risk                         2.9 kB         117 kB
├ ○ /board/tokenomics                   3.8 kB         118 kB
├ ƒ /dashboard                          12.4 kB        135 kB
├ ƒ /dashboard/drafts                   11.2 kB        133 kB
├ ƒ /dashboard/group/[groupId]          11.8 kB        134 kB
├ ○ /games                              15.3 kB        138 kB
├ ○ /games/panic-attack                 7.2 kB         123 kB
├ ○ /signin                             3.4 kB         116 kB
├ ƒ /text/[id]                          45.2 kB        185 kB
├ ƒ /whiteboard/[id]                    32.1 kB        172 kB
└ ƒ /spreadsheet/[id]                   28.4 kB        168 kB

○  (Static)  automatically rendered as static HTML
ƒ  (Dynamic)  server-rendered on demand

✓ Build completed successfully
```

### Build Output Explanation

**Route Indicators:**
- **○ (Static):** Pre-rendered at build time (fastest)
- **ƒ (Dynamic):** Server-rendered on demand (requires server)
- **◐ (ISR):** Incremental Static Regeneration (periodic rebuild)

**Size Metrics:**
- **Size:** Route-specific JavaScript
- **First Load JS:** Total JS for initial page load (includes shared chunks)

### Step 4: Test Production Build Locally

```bash
npm run start
```

Visit [http://localhost:3000](http://localhost:3000) to test the production build.

### Production Build Characteristics

| Feature | Status |
|---------|--------|
| Minification | Enabled (Terser) |
| Tree Shaking | Dead code removed |
| Code Splitting | Automatic route-based splits |
| Image Optimization | Automatic with next/image |
| Font Optimization | Next.js Font optimization |
| Source Maps | Minimal (for debugging) |
| CSS Optimization | Minified and bundled |
| Bundle Analysis | Available via `npm run analyze` |

---

## Build Verification

### Automated Verification Checklist

Run these commands after a successful build:

```bash
# 1. Type checking
npm run typecheck

# 2. Linting
npm run lint

# 3. Build
npm run build

# 4. Start production server
npm run start
```

### Manual Verification Checklist

After starting the production server, verify:

- [ ] **Home Page** - Loads without errors
- [ ] **Authentication** - Google OAuth sign-in works
- [ ] **Dashboard** - Authenticated users can access dashboard
- [ ] **Text Editor** - Real-time collaboration works (`/text/[id]`)
- [ ] **Whiteboard** - Canvas and notes work (`/whiteboard/[id]`)
- [ ] **Board Portal** - Board pages load (`/board`)
- [ ] **Games** - Game catalog displays (`/games`)
- [ ] **Navigation** - All links work, no 404s
- [ ] **Images** - All images load properly
- [ ] **Console** - No JavaScript errors in browser console
- [ ] **Network** - No failed API requests (check Network tab)

### Performance Verification

**Lighthouse Audit (Chrome DevTools):**
1. Open Chrome DevTools (F12)
2. Go to Lighthouse tab
3. Run audit for Production build
4. Target scores:
   - Performance: 80+
   - Accessibility: 90+
   - Best Practices: 90+
   - SEO: 90+

**Build Size Verification:**
```bash
# Check build output size
du -sh .next

# Expected: 150-250 MB for full build (includes node_modules chunks)
```

---

## Build Scripts Reference

### Core Scripts

| Script | Command | Purpose | When to Use |
|--------|---------|---------|-------------|
| **dev** | `npm run dev` | Start development server | Active development |
| **build** | `npm run build` | Production build | Before deployment |
| **start** | `npm run start` | Start production server | Test production locally |
| **lint** | `npm run lint` | Lint and auto-fix code | Before commits |
| **typecheck** | `npm run typecheck` | TypeScript validation | Before builds |

### Additional Scripts

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint --fix",
    "typecheck": "tsc --project tsconfig.json --noEmit",
    "clean": "rm -rf .next node_modules",
    "reinstall": "npm run clean && npm install",
    "analyze": "ANALYZE=true npm run build"
  }
}
```

### Custom Build Commands

**Clean build (if encountering cache issues):**
```bash
rm -rf .next
npm run build
```

**Full reinstall (if dependency issues):**
```bash
npm run reinstall
```

**Bundle analysis (requires @next/bundle-analyzer):**
```bash
npm run analyze
```

---

## Troubleshooting

### Common Build Errors

#### 1. Module Not Found

**Error:**
```
Module not found: Can't resolve 'some-package'
```

**Solution:**
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### 2. TypeScript Errors

**Error:**
```
Type 'X' is not assignable to type 'Y'
```

**Solution:**
```bash
# Run type checking to see all errors
npm run typecheck

# Fix errors in the source code
# Then rebuild
npm run build
```

#### 3. Environment Variables Missing

**Error:**
```
Error: Missing required environment variable: LIVEBLOCKS_SECRET_KEY
```

**Solution:**
1. Verify `.env.local` exists in project root
2. Check all required variables are present
3. Restart dev server: `npm run dev`

#### 4. Port Already in Use

**Error:**
```
Error: Port 3000 is already in use
```

**Solution:**
```bash
# Option 1: Kill the process using port 3000
# Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# macOS/Linux:
lsof -ti:3000 | xargs kill

# Option 2: Use different port
PORT=3001 npm run dev
```

#### 5. Out of Memory

**Error:**
```
FATAL ERROR: Reached heap limit Allocation failed - JavaScript heap out of memory
```

**Solution:**
```bash
# Increase Node.js memory limit
NODE_OPTIONS=--max_old_space_size=4096 npm run build
```

#### 6. Image Optimization Errors

**Error:**
```
Error: Invalid src prop on next/image
```

**Solution:**
1. Check `next.config.js` has correct image domains configured
2. Verify image paths are correct
3. Ensure images exist in `/public` folder

#### 7. Liveblocks Authentication Failed

**Error:**
```
Liveblocks authentication failed
```

**Solution:**
1. Verify `LIVEBLOCKS_SECRET_KEY` in `.env.local`
2. Check key starts with `sk_prod_` or `sk_dev_`
3. Verify key is valid in Liveblocks dashboard

#### 8. Build Succeeds but Pages Don't Load

**Issue:** Build completes, but routes return 404 or errors

**Solution:**
```bash
# 1. Check .next folder exists
ls -la .next

# 2. Clear build cache and rebuild
rm -rf .next
npm run build

# 3. Verify all required dependencies installed
npm install

# 4. Check for dynamic imports or missing files
npm run typecheck
```

#### 9. AWS Amplify Network Timeout (ECONNRESET)

**Error:**
```
npm error code ECONNRESET
npm error network aborted
```

**Solution (Implemented December 2025):**

This has been fixed with the following configuration files:

**`.npmrc` (created):**
```ini
fetch-retries=5
fetch-retry-mintimeout=20000
fetch-retry-maxtimeout=120000
prefer-offline=true
audit=false
legacy-peer-deps=true
```

**`amplify.yml` (updated):**
- Added npm configuration commands before install
- Implemented fallback from `npm ci` to `npm install`
- Added logging for better debugging

**If issue persists:**
1. Check Amplify Console build logs for specific package causing timeout
2. Verify environment variables are set correctly
3. Try manual redeploy (network issues are often transient)
4. Contact AWS Support if issue continues

### Build Performance Issues

#### Slow Development Server

**Symptoms:** HMR takes >10 seconds, pages load slowly

**Solutions:**
1. **Reduce file watching scope:**
   ```javascript
   // next.config.js
   module.exports = {
     webpack: (config) => {
       config.watchOptions = {
         ignored: ['**/node_modules', '**/.git']
       }
       return config
     }
   }
   ```

2. **Use faster package manager:**
   ```bash
   npm install -g pnpm
   pnpm install
   pnpm dev
   ```

3. **Close other applications** to free up system resources

#### Slow Production Build

**Symptoms:** Build takes >10 minutes

**Solutions:**
1. **Upgrade Node.js** to latest LTS (v20.x)
2. **Increase memory:** `NODE_OPTIONS=--max_old_space_size=4096 npm run build`
3. **Use build cache:** `.next/cache` should exist (don't delete between builds)
4. **Disable source maps temporarily:**
   ```javascript
   // next.config.js
   module.exports = {
     productionBrowserSourceMaps: false
   }
   ```

### Getting Help

**If build issues persist:**

1. **Check Section 13:** [Troubleshooting Documentation](./13-troubleshooting/README.md)
2. **Review Recent Changes:** `git log --oneline -10`
3. **Check Dependencies:** `npm outdated`
4. **Verify Node Version:** `node --version` (must be 18.x or 20.x)
5. **Clean Install:**
   ```bash
   rm -rf node_modules package-lock.json .next
   npm install
   npm run build
   ```

---

## Build Architecture

### Next.js Build Process

```
┌─────────────────┐
│  Source Code    │
│  (/app, /components, /lib) │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  TypeScript     │ ──► Type Checking (tsc)
│  Compilation    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Webpack        │ ──► Bundling, Tree Shaking
│  Processing     │ ──► Code Splitting
└────────┬────────┘ ──► Minification (Terser)
         │
         ▼
┌─────────────────┐
│  PostCSS        │ ──► CSS Processing
│  Processing     │ ──► CSS Modules
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Static         │ ──► Pre-rendering
│  Generation     │ ──► ISR Setup
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Build Output   │
│  (/.next)       │
└─────────────────┘
```

### Build Output Structure

```
.next/
├── cache/                  # Build cache for faster rebuilds
├── server/                 # Server-side code
│   ├── app/               # App Router pages
│   ├── pages/             # API routes
│   └── chunks/            # Shared server chunks
├── static/                 # Static assets
│   ├── chunks/            # JavaScript chunks
│   ├── css/               # Compiled CSS
│   ├── media/             # Optimized images/fonts
│   └── [buildId]/         # Build-specific assets
├── build-manifest.json     # Client build manifest
├── package.json           # Next.js metadata
└── react-loadable-manifest.json  # Code splitting manifest
```

### Key Build Files

| File | Purpose |
|------|---------|
| `next.config.js` | Next.js configuration |
| `tsconfig.json` | TypeScript configuration |
| `.eslintrc.json` | ESLint rules |
| `postcss.config.js` | CSS processing |
| `package.json` | Dependencies and scripts |

### Dependencies by Category

**Framework:**
- next@14.2.3
- react@18.3.1
- react-dom@18.3.1

**TypeScript:**
- typescript@5.4.3
- @types/node
- @types/react
- @types/react-dom

**Real-time Collaboration:**
- @liveblocks/client@3.0.0
- @liveblocks/react@3.0.0
- @liveblocks/react-ui@3.0.0
- @liveblocks/yjs@3.0.0

**Rich Text Editor:**
- @tiptap/react@2.2.4
- @tiptap/starter-kit@2.2.4
- @tiptap/extension-*

**Authentication:**
- next-auth@5.x (beta)

**Blockchain:**
- ethers@5.5.3
- viem@1.19.11
- wagmi@1.4.7

**UI Components:**
- @radix-ui/react-*
- framer-motion@12.0.6

**Utilities:**
- date-fns@3.3.1
- gray-matter@4.0.3
- rss-parser@3.13.0

### Build Optimization Features

**Automatic Optimizations:**
- Tree shaking (unused code removal)
- Code splitting (route-based)
- Image optimization (next/image)
- Font optimization (@next/font)
- Minification (JavaScript, CSS)
- Compression (gzip/brotli ready)

**Manual Optimizations Available:**
- Dynamic imports: `const Component = dynamic(() => import('./Component'))`
- Lazy loading: Components load on demand
- Bundle analysis: `npm run analyze`
- Custom webpack config: Modify `next.config.js`

---

## CI/CD Integration

### GitHub Actions (Recommended)

**Basic workflow for build verification:**

```yaml
# .github/workflows/build.yml
name: Build and Test

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  build:
    runs-on: ubuntu-latest

    strategy:
      matrix:
        node-version: [18.x, 20.x]

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v3
        with:
          node-version: ${{ matrix.node-version }}
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Type check
        run: npm run typecheck

      - name: Lint
        run: npm run lint

      - name: Build
        run: npm run build
        env:
          LIVEBLOCKS_SECRET_KEY: ${{ secrets.LIVEBLOCKS_SECRET_KEY }}
          NEXTAUTH_SECRET: ${{ secrets.NEXTAUTH_SECRET }}
          NEXTAUTH_URL: http://localhost:3000
          GOOGLE_CLIENT_ID: ${{ secrets.GOOGLE_CLIENT_ID }}
          GOOGLE_CLIENT_SECRET: ${{ secrets.GOOGLE_CLIENT_SECRET }}
```

### AWS Amplify Deployment (Current Platform)

**Status:** Active deployment platform

**Build Configuration:**
- Configured via `amplify.yml` in project root
- Uses `.npmrc` for npm retry and timeout settings
- Automatic deployment on push to main branch

**Key Amplify Features:**
- **Framework:** Auto-detected Next.js SSR
- **Build Command:** `npm run build`
- **Output Directory:** `.next`
- **Install Command:** `npm ci` with fallback to `npm install`

**Network Reliability Fixes (December 2025):**
- Extended npm timeout: 300 seconds
- Retry attempts: 5 (up from 2)
- Fallback mechanism if npm ci fails
- Persistent settings via `.npmrc` file

**Common Amplify Build Issues:**

1. **Network timeout during npm install**
   - **Fixed by:** `.npmrc` configuration with extended timeouts
   - **Retry logic:** Automatic fallback from `npm ci` to `npm install`

2. **Environment variables**
   - Configure in Amplify Console → App Settings → Environment Variables
   - Required: `LIVEBLOCKS_SECRET_KEY`, `NEXTAUTH_SECRET`, etc.

3. **Build image**
   - Default: Amazon Linux 2 with Node.js
   - Can specify custom image in amplify.yml if needed

### Vercel Deployment (Alternative Platform)

**Automatic build configuration:**

1. **Connect GitHub repository** to Vercel
2. **Environment variables** configured in Vercel dashboard
3. **Auto-deploy** on push to main branch
4. **Preview deployments** for pull requests

**Build settings in Vercel:**
- **Framework Preset:** Next.js
- **Build Command:** `npm run build` (automatic)
- **Output Directory:** `.next` (automatic)
- **Install Command:** `npm install` (automatic)

### Pre-Deployment Checklist

Before deploying to production:

- [ ] All tests passing (when implemented)
- [ ] `npm run typecheck` passes with no errors
- [ ] `npm run lint` passes with no warnings
- [ ] `npm run build` completes successfully
- [ ] Manual verification checklist completed
- [ ] Environment variables configured in deployment platform
- [ ] Performance benchmarks meet targets (Lighthouse 80+)
- [ ] Security audit completed (no critical vulnerabilities)
- [ ] Documentation updated (Section 00, BUILD.md)

---

## Build Best Practices

### 1. Always Run Type Check Before Building

```bash
npm run typecheck && npm run build
```

### 2. Use Package Lock Files

**Commit package-lock.json** to ensure consistent dependency versions across environments.

### 3. Clean Build for Production

```bash
rm -rf .next
npm run build
```

### 4. Monitor Build Size

Keep first load JS under 200 KB per route for optimal performance.

### 5. Use Environment Variables Properly

- **Never commit** `.env.local` to version control
- **Use** `.env.example` to document required variables
- **Prefix** client-side variables with `NEXT_PUBLIC_`

### 6. Test Production Build Locally

Always test the production build before deploying:

```bash
npm run build && npm run start
```

### 7. Keep Dependencies Updated

```bash
# Check for outdated packages
npm outdated

# Update dependencies (carefully)
npm update

# Rebuild after updates
npm run build
```

### 8. Document Build Changes

When modifying build configuration:
1. Update this BUILD.md document
2. Update [Section 00: Current State](./00-current-state/README.md)
3. Test the build process end-to-end
4. Document any new environment variables

---

## Related Documentation

- **[Section 00: Current State](./00-current-state/README.md)** - Current platform status
- **[Section 01: Project Checklist](./01-project-checklist/README.md)** - Development roadmap
- **[Section 03: Architecture](./03-architecture/README.md)** - System architecture
- **[Section 12: Deployment](./12-deployment/README.md)** - Deployment procedures
- **[Section 13: Troubleshooting](./13-troubleshooting/README.md)** - Issue resolution

---

## Changelog

### 2026-01-10 - Sign-In Button & Documentation Update
**Status:** Complete

#### Sign-In Button Added to Homepage Header
- Added "Sign In" button to top right corner of homepage header
- Desktop: Red gradient button with hover effects
- Mobile: Full-width button in hamburger menu
- Links to `/signin` for Google OAuth authentication

**Files Modified:**
- `components/Marketing/MarketingHeader.tsx` - Added Sign In links
- `components/Marketing/MarketingHeader.module.css` - Added button styles

**Commits:**
- `da7348f` - Add Board Sign In button to homepage header
- `9be4b71` - Simplify Sign In button text

---

### 2026-01-08 - Document Publishing System Implementation
**Status:** In Progress - Awaiting Publish button visibility testing

#### Document Publishing Feature (⏳ IN PROGRESS)
**Goal:** Allow users to create documents in `/dashboard/documents` and publish them to the public website on `/docs` and `/board` pages.

**Features Implemented:**

1. ✅ **Board Documents Reordering**
   - Reorganized Board Documents card on `/board` page
   - Now sorted by date with most recent first (January 2025 → December 2024)

2. ✅ **Published Documents Type System**
   - Created `types/published-document.ts` with full type definitions
   - Categories: Whitepaper, Education, Blockchain, Legal, Tokenomics, Technical, Governance, Strategic
   - Includes chapter auto-extraction from H1/H2 headings

3. ✅ **JSON Storage for Published Documents**
   - Created `data/published-docs.json` for storing published document data
   - Stores: title, category, description (SEO), HTML content, chapters, author info, timestamps

4. ✅ **Publish Document Modal**
   - Created `components/Documents/DocumentPublishDialog.tsx`
   - Category dropdown selector
   - Description textarea for SEO metadata
   - Publish/Cancel buttons with loading state

5. ✅ **Server Actions for Publishing**
   - Created `lib/actions/publishDocumentToPublic.ts`
   - `publishDocumentToPublic()` - Extracts HTML, generates chapters, saves to JSON
   - `unpublishDocumentFromPublic()` - Removes document from public pages
   - `getPublicDocuments()` - Retrieves all published documents
   - `getPublicDocumentBySlug()` - Retrieves single document by URL slug

6. ✅ **Publish Button in Text Editor**
   - Created `components/TextEditor/ToolbarPublish.tsx`
   - Added to toolbar in `components/TextEditor/Toolbar.tsx`
   - Uses `flex: 1` spacer to position on right side of toolbar

7. ✅ **Public API Endpoint**
   - Created `app/api/public-documents/route.ts`
   - Returns published documents for client-side fetching
   - 60-second revalidation for caching

8. ✅ **Dynamic Document View Page**
   - Created `app/docs/[slug]/page.tsx`
   - SEO metadata generation from document description
   - Table of contents from chapters
   - Styled article content with proper typography
   - Back navigation to /docs

9. ✅ **Updated /docs Page**
   - Fetches published documents from API
   - Merges with existing static documents
   - Published docs appear first in the list

10. ✅ **Updated /board Page**
    - Fetches published documents marked `showOnBoard: true`
    - Merges with static Board Documents
    - Published docs appear first with category icons

#### Files Created
| File | Purpose |
|------|---------|
| `types/published-document.ts` | Type definitions and category constants |
| `data/published-docs.json` | JSON storage for published documents |
| `components/Documents/DocumentPublishDialog.tsx` | Publish modal component |
| `components/Documents/DocumentPublishDialog.module.css` | Modal styles |
| `components/TextEditor/ToolbarPublish.tsx` | Publish button for editor |
| `lib/actions/publishDocumentToPublic.ts` | Server actions for publishing |
| `app/api/public-documents/route.ts` | API endpoint for fetching docs |
| `app/docs/[slug]/page.tsx` | Dynamic published document page |
| `app/docs/[slug]/document.module.css` | Published document page styles |

#### Files Modified
| File | Changes |
|------|---------|
| `app/board/page.tsx` | Reordered docs, added published docs fetching |
| `app/docs/page.tsx` | Added published docs fetching and merging |
| `components/TextEditor/Toolbar.tsx` | Added ToolbarPublish component |
| `components/TextEditor/Toolbar.module.css` | Added width/flex and publish button styles |
| `components/Documents/index.ts` | Export DocumentPublishDialog |
| `lib/actions/index.ts` | Export publishDocumentToPublic actions |
| `types/index.ts` | Export published-document types |

#### Key Commits
- `ddee9b1` - Add document publishing system for public docs pages
- `068b152` - Fix toolbar width so Publish button displays correctly

#### Known Issue - Awaiting Fix
**Problem:** Publish button not visible in text editor toolbar on live site
**Potential Cause:** Toolbar CSS width not set, causing spacer to not push button into view
**Fix Deployed:** Commit `068b152` adds `width: 100%` and `flex: 1` to toolbar
**Testing Required:** After AWS Amplify deploys, verify Publish button appears on right side of text editor toolbar

#### Publishing Workflow (After Fix)
```
1. User creates/edits document at /dashboard/documents
2. Opens text document in editor
3. Clicks "Publish" button (right side of toolbar)
4. Modal appears with:
   - Category dropdown
   - Description field (for SEO)
5. User clicks "Publish to Public"
6. Document saved to data/published-docs.json
7. Document appears on:
   - /docs page (in documents grid)
   - /board page (in Board Documents card)
   - /docs/[slug] (individual document page)
```

---

### 2026-01-01 - Text Editor Bug Fix & Mobile Menu Implementation
**Status:** In Progress - Final fix deployed, awaiting testing

#### Mobile Menu Implementation (✅ COMPLETE)
**Problem:** Mobile hamburger menu not visible on iPhone
**Root Cause:** Missing viewport meta tag prevented mobile CSS media queries from triggering

**Solutions Implemented:**
1. ✅ Added viewport meta configuration to `app/layout.tsx`
   - `width=device-width, initialScale=1`
2. ✅ Enhanced hamburger button visibility in both headers
   - Increased size to 50x50px with red background for debugging
   - White lines (5px thick) with shadow for contrast
   - Added to both `MarketingHeader` and `BoardroomHeader`
3. ✅ Implemented "nuclear" cache busting in `next.config.js`
   - `generateBuildId` with timestamp
   - Webpack config to inject timestamp into all chunk filenames
   - Every deployment gets unique JavaScript file names
4. ✅ Removed all build caching from `amplify.yml`
   - Deleted `node_modules` cache
   - Added `rm -rf node_modules && rm -rf .next` before builds
   - Clean builds prevent stale artifacts

**Result:** Mobile menu fully functional. Cache busting confirmed working (chunks now have timestamps like `e68702b2-1767323494160-67169b7e2fde7502.js`).

#### Text Editor "Cannot read properties of undefined (reading 'as')" Bug (⏳ IN PROGRESS)
**Problem:** Text editor crashes with "Cannot read properties of undefined (reading 'as')" when creating new drafts

**Attempts That Did NOT Work:**
1. ❌ Added null checks to `useSelf((me) => me?.info)` in TextEditor.tsx
   - Still crashed because destructuring happened after check
2. ❌ Added defensive defaults during destructuring
   - `name = "Anonymous User", color = "#808080"`
   - Still crashed during CollaborationCursor initialization
3. ❌ Added secondary fallbacks in CollaborationCursor.configure
   - `name: name || "Anonymous User"`
   - Still crashed - race condition
4. ❌ Extracted variables before editor initialization
   - `const userName = self?.info?.name ?? "Anonymous User"`
   - Still crashed - useEditor called on every render
5. ❌ Split into two components (TiptapEditor + TiptapEditorWithData)
   - Prevented useEditor from running with undefined data
   - Still crashed - RoomProvider rendered before Liveblocks auth completed

**Root Cause Identified:**
`RoomProvider` was rendering its children (including TextEditor) BEFORE Liveblocks authentication completed. This caused `useSelf()` to return undefined during initial renders, and even though we checked for data, React hooks (including `useEditor`) were being called before we could prevent rendering.

**Final Solution Implemented (Commit 9b79797):**
1. ✅ Added `RoomContent` wrapper component in `app/text/[id]/TextDocumentView.tsx`
2. ✅ Wrapped RoomProvider children in `ClientSideSuspense`
3. ✅ RoomContent calls `useSelf()` and waits for authentication
4. ✅ Only renders TextEditor after confirming `self && self.info` exist

**Flow:**
```
RoomProvider initializes
  → ClientSideSuspense shows loading spinner
    → RoomContent calls useSelf() (triggers auth wait)
      → Liveblocks authentication completes
        → useSelf() returns valid data
          → Check self && self.info exist
            → ONLY THEN render TextEditor
```

This ensures TextEditor component NEVER renders until we have confirmed valid Liveblocks user data.

**Testing Required:** After AWS Amplify deploys commit `9b79797`, test "+New Draft" button to verify text editor loads without errors.

#### AWS Amplify Cache Invalidation Issues
**Problem:** CloudFront served stale JavaScript chunks even after successful deployments
**Root Cause:** `customHttp.yml` headers not respected by Amplify managed hosting

**Research Findings:**
- AWS Amplify uses shared CloudFront distribution without direct access
- `customHttp.yml` Cache-Control headers have known issues (GitHub #2556, #1170)
- Automatic cache invalidation often fails despite AWS documentation

**Solutions Attempted:**
1. ❌ Created `customHttp.yml` with aggressive no-cache headers
   - Not applied by Amplify managed hosting
2. ❌ Added cache prevention meta tags to HTML `<head>`
   - CloudFront still served old chunks
3. ✅ Implemented "nuclear" cache busting (works permanently)
   - Timestamp in chunk filenames forces CloudFront to treat as new files
   - Eliminated dependency on CloudFront cache invalidation

**Build Time Impact:** Clean builds now take 5-7 minutes (vs 2-3 minutes with cache), but guarantees fresh code every deployment.

#### Key Commits
- `88a08a7` - Fix hamburger lines visibility and menu dropdown
- `ff0538d` - CRITICAL: Add viewport meta configuration
- `b16cc7c` - NUCLEAR OPTION: Force new chunk names every build
- `d118ccf` - Fix CollaborationCursor undefined error (defensive defaults)
- `7c044b5` - Refactor: Extract user variables before editor init
- `d8be589` - CRITICAL FIX: Split component to prevent useEditor race
- `9b79797` - FINAL FIX: Wait for Liveblocks auth before rendering TextEditor

#### Lessons Learned
1. **Viewport meta tag is CRITICAL** for mobile responsiveness - always verify
2. **AWS Amplify customHttp.yml is unreliable** - use chunk filename cache busting instead
3. **React hooks can't be conditionally called** - must use component composition
4. **RoomProvider doesn't wait for authentication** - must add explicit checks
5. **CloudFront cache invalidation is not automatic** despite AWS documentation

### 2025-12-29
- Fixed AWS Amplify network timeout issues (ECONNRESET)
- Created `.npmrc` with extended retry and timeout settings
- Updated `amplify.yml` with fallback mechanism and logging
- Added AWS Amplify deployment documentation
- Added troubleshooting entry for network timeouts

### 2025-12-16
- Initial BUILD.md documentation created
- Comprehensive build process documented
- Troubleshooting section added
- CI/CD integration guidance added

---

**CTO Commitment:** This build process will be maintained and updated as the platform evolves. Any changes to the build configuration must be documented here immediately.

**Questions or issues with the build process? See Section 13: Troubleshooting or contact the CTO.**
