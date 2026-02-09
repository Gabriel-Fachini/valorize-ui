# Valorize UI - Monorepo

> Complete platform for corporate culture and engagement with recognition, gamification, and rewards management.

## 📹 Project Demonstration

See how the project works in practice and understand its features:

<div align="center">
  <a href="https://youtu.be/9MHFR3UuPvY" target="_blank">
    <img src="https://img.youtube.com/vi/9MHFR3UuPvY/maxresdefault.jpg" alt="Valorize - Demonstração em Vídeo" style="width:100%;max-width:720px;border-radius:8px;">
  </a>
  <p>
    <a href="https://youtu.be/9MHFR3UuPvY" target="_blank">
      <strong>▶️ Watch full video on YouTube</strong>
    </a>
  </p>
</div>

## 🏗️ Monorepo Architecture

This is a monorepo managed by **Turborepo** and **PNPM**, containing 4 independent applications:

```
valorize-ui/
├── apps/
│   ├── dashboard/      # Main employee application
│   ├── admin/          # Company administrative panel
│   ├── backoffice/     # Internal management (support/operations)
│   └── landing/        # Institutional landing page
├── packages/
│   └── shared/         # Shared utilities (future)
├── docs/               # Technical documentation
├── memory-bank/        # Project context and decisions
└── scripts/            # Deploy and CI/CD scripts
```

## 📱 Applications

### 1. **Dashboard** (Employees)
> **Main product** - Application where employees interact daily

**Stack:**
- React 19 + TypeScript 5.8 + Vite 7 (SWC)
- TailwindCSS v4
- TanStack Router + TanStack Query
- React Spring (animations)

**Features:**
- Send and receive praises/recognition
- Gamification with coins and levels
- Prize redemption
- Activity feed
- Profile and settings
- Dashboard with personal metrics

**Port:** `3000` | **Build:** `pnpm build:dashboard`

---

### 2. **Admin** (Managers/HR)
> Administrative panel for company platform management

**Stack:**
- React 19 + TypeScript 5.8 + Vite 7
- TailwindCSS v4
- TanStack Router + TanStack Query
- Shadcn/ui components

**Features:**
- User and department management
- Company values configuration
- Reports and analytics
- Prize and inventory management
- Transaction auditing
- Company settings

**Port:** `3001` | **Build:** `pnpm build:admin`

---

### 3. **Backoffice** (Internal Support)
> Internal system for operations and support team

**Stack:**
- React 19 + TypeScript + Vite
- TailwindCSS v4
- TanStack Router + TanStack Query
- Shadcn/ui components

**Features:**
- Multi-tenant management (multiple companies)
- Technical support and tickets
- Plan/subscription management
- Usage monitoring
- Logs and general auditing

**Port:** `3003` | **Build:** `pnpm build:backoffice`

---

### 4. **Landing** (Marketing)
> Institutional landing page for lead generation

**Stack:**
- Astro 5 (SSG)
- React (interactive islands)
- TailwindCSS v4
- Framer Motion + Three.js

**Features:**
- Institutional page with optimized SEO
- Contact and demo forms
- Public documentation
- Blog (future)

**Port:** `3001` (dev) | **Build:** `pnpm build:landing`

---

## 🚀 Quick Start

### Prerequisites

- Node.js 20+ (recommended: 22+)
- PNPM 10+ (`npm install -g pnpm`)
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/Gabriel-Fachini/valorize-ui.git
cd valorize-ui

# Install dependencies
pnpm install
```

### Development

```bash
# Run all applications simultaneously
pnpm dev

# Run individual applications
pnpm dev:dashboard      # Dashboard (port 3000)
pnpm dev:admin          # Admin (port 3001)
pnpm dev:backoffice     # Backoffice (port 3003)
pnpm dev:landing        # Landing (port 3001)
```

### Production Build

```bash
# Build all applications
pnpm build

# Individual build
pnpm build:dashboard
pnpm build:admin
pnpm build:backoffice
pnpm build:landing
```

### Preview

```bash
# Preview production build
pnpm preview:dashboard    # Port 3000
pnpm preview:admin        # Port 3001
pnpm preview:backoffice   # Port 3000
```

## 🛠️ Main Technologies

| Technology | Version | Usage |
|------------|--------|-----|
| **React** | 19 | UI framework (Dashboard, Admin, Backoffice) |
| **TypeScript** | 5.8 | Type safety |
| **Vite** | 7 | Build tool (with SWC) |
| **Astro** | 5 | SSG (Landing) |
| **TailwindCSS** | 4 | Styling |
| **TanStack Router** | 1.x | Type-safe routing |
| **TanStack Query** | 5 | Server state management |
| **React Spring** | 10 | Animations (Dashboard/Admin) |
| **Turborepo** | 2.x | Monorepo orchestration |
| **PNPM** | 10 | Package manager |

## 📜 Available Scripts

### Development
```bash
pnpm dev                  # All apps in parallel
pnpm dev:dashboard        # Dashboard only
pnpm dev:admin            # Admin only
pnpm dev:backoffice       # Backoffice only
pnpm dev:landing          # Landing only
```

### Build
```bash
pnpm build                # Build all apps
pnpm build:dashboard      # Individual build
pnpm build:admin
pnpm build:backoffice
pnpm build:landing
```

### Code Quality
```bash
pnpm lint                 # Lint all apps
pnpm lint:fix             # Auto-fix linting errors
pnpm type-check           # Type checking
```

### Cleanup
```bash
pnpm clean                # Remove dist/ and node_modules/
```

## 🎨 Code Patterns

### Style
- ✅ **No semicolons** (enforced by ESLint)
- ✅ **Single quotes** for strings
- ✅ **Code and comments in English**
- ✅ **UI in Portuguese (Brazil)**

### Animations (Dashboard/Admin)
- ⚠️ **ONLY react-spring** - Never use CSS transitions
- Available hooks: `usePageEntrance`, `useCardTrail`, `useModalTransition`

### Imports (Aliases)
```typescript
import { Button } from '@components/Button'    // ✅
import { useAuth } from '@hooks/useAuth'      // ✅
import api from '@services/api'               // ✅
```

## 🚀 Deploy

All projects are configured for deployment on **Google Cloud Run** with automatic CI/CD.

### Manual Deploy

```bash
# Configure GCP
gcloud config set project YOUR-PROJECT-ID

# Individual deploy
./scripts/deploy-dashboard.sh
./scripts/deploy-landing.sh
```

### Automatic CI/CD

```bash
# Setup automatic deploy (GitHub + Cloud Build)
./scripts/setup-cicd.sh
```

### Deploy Documentation
- 📖 [Complete Guide](docs/deployment/README.md)
- ⚡ [Quick Start](docs/deployment/quick-start.md)
- 🔧 [Troubleshooting](docs/deployment/troubleshooting.md)

## 📚 Documentation

- **[Memory Bank](memory-bank/)** - Project context, architectural decisions
  - [Product Context](memory-bank/productContext.md) - Product vision
  - [Tech Context](memory-bank/techContext.md) - Technical stack
  - [System Patterns](memory-bank/systemPatterns.md) - Code patterns
- **[Docs](docs/)** - Technical documentation
  - [API Routes](docs/API_ROUTES_DOCUMENTATION.md)
  - [MVP Roadmap](docs/mvp_roadmap.md)
  - [Onboarding Guide](docs/onboarding-guide.md)

## 📊 Project Status

- ✅ **Dashboard**: Complete MVP, in production
- ✅ **Landing**: Complete MVP, in production
- 🚧 **Admin**: Active development
- 🚧 **Backoffice**: Initial planning

## 📄 License

This project is proprietary and confidential. All rights reserved.

## 🔗 Useful Links

- **Technical Documentation**: [docs/](docs/)
- **Memory Bank**: [memory-bank/](memory-bank/)
- **Issues**: [GitHub Issues](https://github.com/Gabriel-Fachini/valorize-ui/issues)

---

**Made with ❤️ by the Valorize team**
