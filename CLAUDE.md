# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `npm install` - Install all dependencies
- `npm run dev` - Start Vite development server (default port 5173)
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint to check code quality

## Architecture Overview

This is a React + Vite single-page application built with the Base44 SDK framework. The application follows a component-based architecture with clear separation of concerns.

### Technology Stack
- **Build Tool**: Vite with React plugin
- **UI Framework**: React 18 with React Router v7 for routing
- **Component Library**: Radix UI primitives with shadcn/ui components
- **Styling**: Tailwind CSS with CSS variables and custom animations
- **Form Handling**: React Hook Form with Zod validation
- **API Integration**: Base44 SDK for backend communication
- **State Management**: Component-level state with React hooks

### Project Structure

- **src/pages/** - Route components that map to application pages. The routing is handled in `src/pages/index.jsx` which uses React Router with a custom Layout wrapper
- **src/components/** - Reusable React components including:
  - `ui/` - shadcn/ui base components
  - Feature-specific components (agent, marketplace, chat, etc.)
- **src/api/** - API integration layer using Base44 SDK
  - `base44Client.js` - Configured Base44 client instance (appId: 68de5637652a326681f5a5a3)
  - `entities.js` and `integrations.js` - API entity definitions
- **src/lib/** - Utility functions, primarily `cn()` for className merging
- **src/hooks/** - Custom React hooks

### Key Configuration

- **Path Aliases**: `@/` is configured to resolve to `./src/` directory
- **shadcn/ui Configuration**: Defined in `components.json` using New York style with Lucide icons
- **Vite Configuration**:
  - React plugin enabled
  - Path resolution for `@` alias
  - JSX loader configured for .js files
  - Server configured to allow all hosts

### Routing Pattern

The application uses a centralized routing approach where all pages are registered in `src/pages/index.jsx`. Each page component receives the current page name through the Layout component. Routes follow a simple pattern: `/<PageName>` with the home page serving both `/` and `/Home`.

### Base44 Integration

The application is configured to work with Base44's backend services. All API calls require authentication (`requiresAuth: true`). The Base44 client is initialized once in `src/api/base44Client.js` and should be imported from there throughout the application.