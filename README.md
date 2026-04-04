# Datawise Frontend UI Service

Product and category management platform built with React Router 7, TanStack Query, and TypeScript.

## Quick Start

**Prerequisites:** Node.js 20+, pnpm 9+

```bash
pnpm install
cp .env.example .env   # Set VITE_API_BASE_URL
pnpm dev               # http://localhost:3000
```

## Scripts

| Command              | Description            |
| -------------------- | ---------------------- |
| `pnpm dev`           | Start dev server       |
| `pnpm build`         | Production build       |
| `pnpm start`         | Serve production build |
| `pnpm lint`          | Type-check + ESLint    |
| `pnpm test`          | Run tests (watch mode) |
| `pnpm test:run`      | Run tests (single run) |
| `pnpm test:coverage` | Tests with coverage    |

## Tech Stack

- **React 19** + **React Router 7** (SSR enabled)
- **TypeScript 5.9** (strict mode)
- **Tailwind CSS 4** + **shadcn/ui** + **Radix UI**
- **Redux Toolkit** + redux-persist (auth, theme, filters, modals)
- **TanStack Query** for server state
- **React Hook Form** + **Zod** for forms/validation
- **Framer Motion** for animations
- **Axios** for API calls
- **Vitest** + React Testing Library

## Project Structure

```sh
app/
  routes/           # File-based routing
    home/           # Landing page
    products/       # Products CRUD
    categories/     # Categories CRUD
  components/
    ui/             # shadcn/ui components
    root-layout.tsx # Nav, footer, theme editor
    theme-editor.tsx # Floating theme settings
  features/
    products/       # Queries, mutations, query-keys
    categories/     # Queries, mutations, query-keys
  store/
    slices/         # Redux slices (theme, auth, filter, modal)
  lib/
    api/client.ts   # Axios with auth interceptor
    env.ts          # Zod env validation
    providers/      # Redux + Query providers
```

## Environment Variables

```env
VITE_API_BASE_URL=http://localhost:3000/api  # Required
VITE_APP_NAME=Datawise Frontend              # Optional
VITE_GTAG_ID=G-XXXXXXXXXX                   # Optional
```

## Adding shadcn Components

```bash
pnpm dlx shadcn@latest add [component-name]
```

## Contributing

1. Follow existing folder structure and patterns
2. Run `pnpm lint` before committing (enforced via Husky)
3. Use `~/` import alias for app-relative paths
4. Add SEO meta tags for new pages via `generateSEOTags()`
