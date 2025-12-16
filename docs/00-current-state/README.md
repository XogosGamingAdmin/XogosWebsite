# Section 00: Current State of Xogos

**Last Updated:** 2025-01-19

This document represents the complete technical state of Xogos Gaming as it exists today. This is mandatory reading before any development work.

---

## Executive Summary

Xogos Gaming is a Next.js 14 application combining:
- Real-time collaborative document editing (Liveblocks + TipTap)
- Educational gaming platform (9 games across multiple subjects)
- Blockchain integration (smart contracts, wallet connections)
- Board of Directors management tools

**Primary Tech Stack:** Next.js 14.2.3, React 18.3.1, TypeScript, Liveblocks, TipTap, Wagmi

---

## 1. Project Structure

```
xogosboard/
├── app/                      # Next.js 14 App Router
│   ├── api/                  # API routes
│   ├── dashboard/            # Dashboard pages
│   ├── board/                # Board of Directors pages
│   ├── games/                # Game catalog
│   ├── text/[id]/            # Text editor
│   ├── whiteboard/[id]/      # Whiteboard editor
│   └── [other pages]/
├── components/               # React components
├── lib/                      # Utilities, hooks, actions
├── types/                    # TypeScript definitions
├── data/                     # Mock data
├── icons/                    # SVG icon components
├── layouts/                  # Layout wrappers
├── primitives/               # UI primitives
├── config/                   # Configuration
├── styles/                   # Global CSS
├── hardhat/                  # Smart contracts
├── Gaming/                   # Emotion Quest Unity project
├── ABIs/                     # Contract ABIs
├── auth.ts                   # NextAuth setup
├── liveblocks.config.ts      # Liveblocks client
└── liveblocks.server.config.ts # Liveblocks server
```

---

## 2. Frontend State

### Framework & Core Dependencies
| Package | Version | Status |
|---------|---------|--------|
| Next.js | 14.2.3 | Active |
| React | 18.3.1 | Active |
| TypeScript | 5.4.3 | Active |
| Framer Motion | 12.0.6 | Active |

### Pages Implemented

**Public Marketing Pages:**
- `/` - Home/landing page with games showcase
- `/about` - About Xogos
- `/games` - Game catalog with filtering
- `/games/panic-attack` - Individual game page
- `/whitepaper` - Whitepaper documentation
- `/educational-philosophy` - Educational approach
- `/docs` - Public documentation

**Authenticated Dashboard:**
- `/dashboard` - Main dashboard with documents
- `/dashboard/drafts` - Draft documents
- `/dashboard/group/[groupId]` - Group documents

**Collaboration Tools:**
- `/text/[id]` - Real-time text editor
- `/whiteboard/[id]` - Interactive whiteboard

**Board of Directors:**
- `/board` - Main board view
- `/board/members` - Board members
- `/board/initiatives` - Initiatives
- `/board/insights` - Market insights
- `/board/risk` - Risk assessment
- `/board/tokenomics` - Token economics

**Other:**
- `/signin` - Authentication
- `/timeline` - Timeline view
- `/skillsmatrix` - Skills matrix
- `/tokenomicsvisual` - Tokenomics visualization

### Component Library Status

**Implemented Primitives:**
- Avatar, AvatarStack
- Badge, Button, Checkbox
- Container, Dialog, Input
- Link, Popover, Select
- Skeleton, Spinner, Tooltip

**Feature Components:**
- TextEditor (TipTap with toolbar)
- Whiteboard (draggable notes)
- DocumentHeader, DocumentRow
- ShareDialog (permissions UI)
- Inbox (notifications)
- Cursors (real-time tracking)

---

## 3. Backend State

### Current Backend
**There is no dedicated backend server for the main application.** The app uses:
- Next.js API routes for minimal server-side logic
- Liveblocks cloud for real-time data
- Client-side blockchain interactions

### API Routes Implemented
- `/api/auth/[...nextauth]` - NextAuth authentication
- `/api/rss-feeds` - RSS feed aggregation

### Server Actions (lib/actions/)
| Action | Purpose | Status |
|--------|---------|--------|
| authorizeLiveblocks | Auth with Liveblocks | Working |
| createDocument | Create new document | Working |
| deleteDocument | Delete document | Working |
| getDocument | Fetch single document | Working |
| getDocuments | Fetch all documents | Working |
| getNextDocuments | Paginated fetch | Working |
| renameDocument | Update document name | Working |
| updateUserAccess | Modify user permissions | Working |
| updateGroupAccess | Modify group permissions | Working |
| removeUserAccess | Remove user access | Working |
| removeGroupAccess | Remove group access | Working |
| updateDefaultAccess | Change default permissions | Working |
| getDocumentUsers | Get users with access | Working |
| getDocumentGroups | Get groups with access | Working |
| getLiveUsers | Get active users | Working |

### Gaming Backend (Separate)
Located in `/Gaming/` - Node.js/Express server for Emotion Quest:
- Express.js 4.18.2
- Socket.io 4.7.4
- MongoDB with Mongoose
- JWT authentication
- Redis caching

**Status:** Separate project, not integrated with main app

---

## 4. Real-time Collaboration State

### Liveblocks Integration
**Status:** Fully implemented and working

**Packages:**
- @liveblocks/client: 3.0.0
- @liveblocks/react: 3.0.0
- @liveblocks/yjs: 3.0.0

**Features Working:**
- Real-time presence (cursor tracking)
- Live storage with Yjs CRDT
- Comments and threading
- Notifications system
- User mentions
- Undo/Redo history

### TipTap Editor
**Status:** Working with collaborative editing

**Extensions Enabled:**
- Collaboration (multi-user)
- CollaborationCursor
- StarterKit (basic formatting)
- CharacterCount
- Link, Image
- TaskList, TaskItem
- Placeholder

### Whiteboard
**Status:** Working

**Features:**
- Draggable notes
- Liveblocks storage sync
- Undo/Redo
- Real-time cursor tracking

---

## 5. Authentication State

### NextAuth Configuration
**Status:** Partially configured

**Working:**
- Google OAuth provider
- Session management
- Custom sign-in page

**Configured but not active:**
- GitHub OAuth (commented out)
- Auth0 (commented out)

### Wallet Authentication
**Status:** Configured

**Wagmi Setup:**
- MetaMask
- Coinbase Wallet
- WalletConnect
- Injected wallets

**Supported Chains:**
- Fantom (250)
- Fantom Testnet (4002)
- Polygon (137)

---

## 6. Blockchain State

### Smart Contracts (Fantom Testnet 4002)

| Contract | Address | Purpose |
|----------|---------|---------|
| iServ Token | 0x6a62Ba87CCE5a28c08Fb0c63D9F1abBec0a2fcc6 | Main token |
| Tracker | 0x23C066778A92FD5861679C784243d3809C705899 | Metrics |
| Admin | 0xd05A2460Aa54579690c5B4F437C23026a087aC1b | Admin functions |

### Contract ABIs Available
- Admin.tsx
- iServ.tsx
- Tracker.tsx

### Hardhat Setup
**Status:** Configured for development

---

## 7. Database State

### Current Storage Solutions

**Liveblocks Cloud:**
- Document data
- Real-time presence
- Collaborative storage
- Comments/threads

**Mock Data (Development):**
- Users: 8+ board members
- Groups: 15+ groups
- Colors: Styling constants

**No Persistent Database Yet:**
- No PostgreSQL/MySQL
- No Supabase (referenced in scripts but not implemented)
- No user data persistence beyond Liveblocks

---

## 8. Game Systems State

### Games Catalog (9 Games)

| Game | Subject | Status |
|------|---------|--------|
| Historical Conquest Digital | History | Active |
| Debt-Free Millionaire | Personal Finance | Active |
| Time Quest | History | Active |
| Bug and Seek | Science | Active |
| Panic Attack!! | Health | Beta |
| Lightning Round | History | Beta |
| Totally Medieval | Math | Upcoming |
| Battles and Thrones | History | Upcoming |
| Prydes Gym | Physical Education | Upcoming |

### Game Page Features
- Filtering by subject
- Featured games carousel
- Modal details view

### Emotion Quest (Unity Project)
**Status:** Separate project in `/Gaming/`

- Unity 2022.3 LTS
- Emotion-based monsters
- Therapeutic mini-games
- Multiple environments

---

## 9. External Integrations

### Working Integrations
- **Liveblocks** - Real-time collaboration
- **Google OAuth** - Authentication
- **Wagmi/Viem** - Wallet connections

### RSS Feed Aggregation
Sources configured:
- SEC (Press, Litigation, Alerts, Rules)
- Crypto news
- Education sources
- Gaming sources

---

## 10. Environment Configuration

### Required Environment Variables
```env
# Authentication
LIVEBLOCKS_SECRET_KEY=sk_prod_...
NEXTAUTH_SECRET=...
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
NEXTAUTH_URL=https://www.histronics.com  # Use http://localhost:3000 for local dev

# Blockchain
PRIVATE_KEY=...
JSON_RPC_PROVIDER_URL=...
NEXT_PUBLIC_RPC_URL_4002=...
NEXT_PUBLIC_RPC_URL_250=...
NEXT_PUBLIC_RPC_URL_137=...
```

### Build Scripts
```json
{
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "next lint --fix",
  "typecheck": "tsc --project tsconfig.json --noEmit"
}
```

---

## 11. Known Issues & Technical Debt

### Current Issues
1. Mock data layer needs replacement with real database
2. Some OAuth providers commented out
3. Gaming backend not integrated with main app
4. Some TypeScript errors recently fixed (see git history)

### Technical Debt
- No comprehensive test suite
- No CI/CD pipeline documented
- Smart contracts only on testnet
- No production deployment process

---

## 12. What's NOT Built Yet

Based on current state analysis:

1. **Persistent Database** - No user/game data storage
2. **Production Smart Contracts** - Only testnet
3. **Game Unity Integration** - Separate project
4. **Comprehensive Testing** - No test suite
5. **CI/CD Pipeline** - No automation
6. **Production Deployment** - No process
7. **Analytics/Metrics** - No tracking
8. **Email Notifications** - Not implemented
9. **User Profiles** - Mock data only

---

## Next Steps

See [Section 01: Project Checklist](../01-project-checklist/README.md) for what needs to be built.

---

**This document must be updated whenever the current state changes.**
