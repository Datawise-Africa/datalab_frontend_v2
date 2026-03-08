# CLAUDE.md - Project Guide for AI Assistants

## Project Overview

Datawise Africa frontend UI service — a React-based web application for product and category management with a landing page.

## Tech Stack

- **Framework**: React 19 + React Router 7 (SSR enabled) + Vite 7
- **Language**: TypeScript 5.9 (strict mode)
- **Styling**: Tailwind CSS 4 + shadcn/ui + Radix UI
- **State**: Redux Toolkit + redux-persist (auth, theme, filters, modals)
- **Data Fetching**: TanStack React Query
- **Forms**: React Hook Form + Zod validation
- **Animations**: Framer Motion
- **API Client**: Axios
- **Package Manager**: pnpm 9 (Node >= 20)

## Commands

```bash
pnpm dev          # Start dev server
pnpm build        # Production build (react-router build)
pnpm start        # Serve production build
pnpm lint         # tsc --noEmit && eslint .
pnpm lint:fix     # ESLint with --fix
pnpm test         # Vitest (watch mode)
pnpm test:run     # Vitest single run
pnpm test:coverage # Vitest with coverage
pnpm typecheck    # react-router typegen && tsc
```

## Project Structure

```
app/
  routes/              # File-based routing (React Router 7)
    home/index.tsx     # Landing page
    products/          # Products CRUD (index, $id, $id.edit, new)
    categories/        # Categories CRUD (index, $id, $id.edit, new)
  components/
    ui/                # shadcn/ui components (button, card, input, etc.)
    root-layout.tsx    # App shell: nav, footer, theme editor, toaster
    theme-editor.tsx   # Floating gear button for live theme editing
    error-boundary.tsx
    loading-indicator.tsx
    data-table.tsx
  features/
    products/          # Product queries, mutations, query-keys
    categories/        # Category queries, mutations, query-keys
  store/
    index.ts           # Redux store config with persist
    storage.ts         # SSR-safe storage adapter (noop on server)
    theme-sync.tsx     # Syncs Redux theme state to CSS custom properties
    slices/
      theme-slice.ts   # Dark mode, hue values, border radius, fonts
      auth-slice.ts    # Token, user, isAuthenticated
      filter-slice.ts  # Keyed filter state: useAppFilter('products')
      modal-slice.ts   # Type-safe keyed modals: useAppModal<T>('key')
  lib/
    api/client.ts      # Axios instance with auth interceptor
    env.ts             # Zod-validated environment variables
    providers/
      store-provider.tsx  # Redux + PersistGate (SSR-safe)
      query-provider.tsx  # TanStack Query + DevTools (lazy, dev-only)
    utils/seo.ts       # SEO meta tag generation
    table-cols.ts      # TanStack Table column definitions
  root.tsx             # App entry: StoreProvider > QueryProvider > Outlet
  app.css              # Tailwind + shadcn CSS variables
```

## Key Patterns

### SSR Compatibility

- SSR is **enabled** (`react-router.config.ts: ssr: true`)
- `redux-persist` uses a noop storage adapter on the server (`app/store/storage.ts`)
- `PersistGate` and `ThemeSynchronizer` are skipped during SSR
- Always guard browser APIs with `typeof window !== 'undefined'`

### State Management

- **Redux Toolkit** for global state (theme, auth, filters, modals)
- **Persisted slices**: `theme` and `auth` (via redux-persist whitelist)
- **Keyed filters**: `useAppFilter('products')` returns scoped filter state + dispatchers
- **Keyed modals**: `useAppModal<T>('key')` returns `{ isOpen, data, open, close, toggle }`
  - Type-safe via `ModalRegistry` interface (declaration merging)
- **Typed hooks**: use `useAppDispatch` and `useAppSelector` (not raw `useDispatch`)

### API Layer

- Axios client at `app/lib/api/client.ts` — reads auth token from Redux store
- Auto-clears auth on 401 responses
- No toast coupling in the API client

### Data Fetching

- TanStack Query for all server state
- Feature-based organization: `features/{domain}/queries.ts`, `mutations.ts`, `query-keys.ts`
- DevTools lazy-loaded only in dev mode

### Env Variables

- Validated via Zod schema at `app/lib/env.ts`
- All must be prefixed with `VITE_`
- Required: `VITE_API_BASE_URL`
- Optional: `VITE_GTAG_ID`, `VITE_SENTRY_DSN`, `VITE_APP_NAME`, `VITE_APP_VERSION`

### Linting & Formatting

- ESLint 9 flat config (`eslint.config.js`) — not `.eslintrc`
- Plugins: typescript-eslint, react, react-hooks, jsx-a11y, prettier
- Husky + lint-staged for pre-commit hooks
- Unused vars pattern: prefix with `_` (e.g., `_unused`)

### Styling

- Tailwind CSS 4 with `@theme` and `@theme inline` directives
- shadcn/ui components in `app/components/ui/`
- CSS variables defined in `:root` and `.dark` in `app/app.css`
- Path alias: `~/` maps to `./app/`

### Animations

- Framer Motion for page transitions and scroll-reveal animations
- Common patterns: `fadeUp`, `staggerContainer`, `staggerItem` variants
- Use `whileInView` with `viewport={{ once: true }}` for scroll triggers
- Use `as const` on easing strings (e.g., `ease: 'easeOut' as const`)

## Conventions

- **Imports**: use `~/` alias for app-relative imports
- **Route loaders**: used for SSR meta tags via `generateSEOTags()`
- **Component exports**: default export for route components, named exports for shared components
- **No console.log**: use `console.warn` or `console.error` (eslint rule)
- **File naming**: kebab-case for files, PascalCase for components
- **Tests**: colocated with source (e.g., `query-keys.test.ts`), Vitest globals enabled
