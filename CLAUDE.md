# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

SENDO is a Next.js 15 application for blockchain wallet analysis, worker management, and educational content. The application provides:
- Wallet analyzer for blockchain portfolio analysis
- Marketplace for AI plugins and trading tools
- Worker management interface
- Leaderboard system

## Development Commands

```bash
# Development
bun dev              # Start Next.js dev server with Turbopack

# Build
bun build            # Production build with Turbopack

# Production
bun start            # Start production server

# Code Quality
bun lint             # Run Biome linter checks
bun format           # Format code with Biome
```

## Technology Stack

- **Framework**: Next.js 15.5.6 (App Router)
- **React**: 19.1.0
- **TypeScript**: 5.x with strict mode
- **Styling**: Tailwind CSS 4 (no config file needed)
- **Linting/Formatting**: Biome 2.2.0 (replaces ESLint + Prettier)
- **UI Components**: Radix UI primitives + shadcn/ui patterns
- **Animation**: Framer Motion 12.x
- **Forms**: React Hook Form + Zod validation
- **Package Manager**: Bun

## Architecture

### App Structure (Next.js App Router)

The application uses Next.js 15 App Router with the following route structure:

- `/` - Home page with section-based scroll navigation (desktop) and free scroll (mobile)
- `/analyzer` - Wallet analysis tool with blockchain data visualization
- `/marketplace` - Plugin marketplace with modal-based detail/configuration views
- `/worker` - Worker management interface
- `/leaderboard` - User rankings and statistics

### Component Organization

```
src/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx         # Root layout with Navigation and fonts
│   ├── page.tsx           # Home page with snap-scroll sections
│   ├── analyzer/          # Wallet analysis feature
│   ├── marketplace/       # Plugin marketplace
│   ├── worker/            # Worker management
│   └── leaderboard/       # Leaderboard feature
├── components/
│   ├── analyzer/          # Analyzer-specific components
│   ├── home/              # Home page sections (hero, stats, team, contact, etc.)
│   ├── marketplace/       # Marketplace components (cards, modals)
│   ├── ui/                # Reusable shadcn/ui components (Radix-based)
│   └── navigation.tsx     # Global navigation component
├── lib/
│   └── utils.ts           # cn() utility and helpers
└── types/
    └── plugins.ts         # Plugin-related TypeScript interfaces
```

### Key Patterns

**Path Aliasing**: Use `@/*` for imports from `src/` directory
```typescript
import Component from "@/components/ui/button";
import { cn } from "@/lib/utils";
```

**Client Components**: Most interactive pages use `"use client"` directive for state management and animations

**UI Component Pattern**: Components use `cn()` utility (clsx + tailwind-merge) for conditional className composition
```typescript
import { cn } from "@/lib/utils";
className={cn("base-classes", conditional && "conditional-classes")}
```

**Modal Pattern**: Marketplace uses controlled modal states with detail and configuration views

**Animation Pattern**: Home page implements custom snap-scroll with Framer Motion on desktop, free scroll on mobile

## Code Style (Biome Configuration)

The project uses Biome for both linting and formatting with these key settings:

- **Indentation**: Tabs (width: 2)
- **Line width**: 120 characters
- **Quotes**: Single quotes for JS/TS, JSX
- **Semicolons**: Always required
- **Trailing commas**: Always in JS/TS, never in JSON
- **Line endings**: LF
- **Import organization**: Enabled (auto-sorts imports)

Biome ignores: `.next/`, `node_modules/`, `ui/` components, `dist/`, `out/`

Console logs and explicit `any` types are allowed (noConsoleLog: off, noExplicitAny: off)

## TypeScript Configuration

- **Target**: ES2017
- **Module**: esnext with bundler resolution
- **Strict mode**: Enabled
- **Path mapping**: `@/*` maps to `./src/*`
- JSX preserved for Next.js compilation

## Styling

Uses Tailwind CSS 4 with:
- Custom TECHNOS font loaded from external CDN in layout head
- Geist Sans and Geist Mono as primary fonts
- CSS variables for theming (background, foreground)
- shadcn/ui component patterns with Radix UI primitives
- `tw-animate-css` for additional animations

## Important Notes

1. **No Tailwind Config**: Tailwind CSS 4 uses CSS-first configuration
2. **Biome over ESLint/Prettier**: Use `bun lint` and `bun format` instead of ESLint/Prettier commands
3. **Client Components**: Most pages require `"use client"` due to state/hooks usage
4. **TypeScript Strict**: All code must satisfy strict TypeScript checks
5. **Import Organization**: Biome auto-organizes imports on format
6. **UI Components**: Located in `src/components/ui/`, ignore from Biome linting

## Git Workflow

- **Main branch**: `main`
- **Current branch**: `refactor/react-to-next` (migration from React to Next.js)
- Recent migration includes new component structure and Next.js 15 App Router patterns
