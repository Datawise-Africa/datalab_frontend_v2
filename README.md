# Datawise Frontend UI Service

Datawise Africa Datalab — a platform for discovering, publishing, purchasing, and collaborating on African datasets. Built with React Router 7, TanStack Query, and TypeScript.

## Quick Start

**Prerequisites:** Node.js 20+, pnpm 9+

```bash
pnpm install
cp .env.example .env   # Set VITE_API_BASE_URL
pnpm dev               # http://localhost:3000
```

## Scripts

| Command                 | Description                                                               |
| ----------------------- | ------------------------------------------------------------------------- |
| `pnpm dev`              | Start dev server                                                          |
| `pnpm build`            | Production build                                                          |
| `pnpm start`            | Serve production build                                                    |
| `pnpm lint`             | Type-check + ESLint                                                       |
| `pnpm lint:fix`         | ESLint with `--fix`                                                       |
| `pnpm format`           | Prettier write                                                            |
| `pnpm typecheck`        | React Router typegen + `tsc`                                              |
| `pnpm test`             | Run tests (watch mode)                                                    |
| `pnpm test:run`         | Run tests (single run)                                                    |
| `pnpm test:coverage`    | Tests with coverage                                                       |
| `pnpm changeset`        | Add a changeset for the current branch (see [`RELEASE.md`](./RELEASE.md)) |
| `pnpm changeset:status` | Show pending changesets and the version they'd produce                    |

## Tech Stack

- **React 19** + **React Router 7** (SSR enabled)
- **TypeScript 5.9** (strict mode)
- **Tailwind CSS 4** + **shadcn/ui** + **Radix UI**
- **Redux Toolkit** + redux-persist (auth, theme, filters, modals)
- **TanStack Query** for server state
- **React Hook Form** + **Zod** for forms/validation
- **Framer Motion** for animations
- **Axios** for API calls
- **Paystack** for premium-dataset payments
- **Vitest** + React Testing Library
- **Changesets** for versioning + release automation

## Project Structure

```sh
app/
  routes/           # File-based routes — *.tsx per page; app/** is the authenticated lab
  components/
    ui/             # shadcn/ui primitives
    <domain>/       # Domain UI groups (dataset-card, upload-dataset-steps, download-flow, …)
    form-fields/    # RHF + Zod field wrappers
    illustrations/  # Decorative SVG components
    layout/         # Shell — navbar, footer, page-header
  features/<domain>/  # Server-state per domain — queries.ts, mutations.ts, query-keys.ts
  hooks/            # Reusable hooks — use-*.ts
  store/
    slices/         # Redux slices — *-slice.ts (auth, theme, filter, modal, dataset-controls)
    index.ts, storage.ts, theme-sync.tsx
  lib/
    api/            # Axios client + interceptors
    providers/      # Redux + Query providers
    schema/         # Zod schemas (auth, dataset, dashboard, …)
    types/          # Shared TS types
    utils/          # Helpers — seo, share, toast, structured-data, format, …
    constants/, table-cols/, env.ts
  root.tsx, routes.ts, app.css

.changeset/         # Changesets config + pending intent files
.github/workflows/  # main.yml (PR checks + Slack), release.yml (Changesets + release Slack)
```

**Conventions:** kebab-case filenames, PascalCase exports. Each feature module owns its `queries.ts` / `mutations.ts` / `query-keys.ts` trio. Slice files end in `-slice.ts`; hook files start with `use-`. Path alias `~/` maps to `./app/`.

## Environment Variables

```env
VITE_API_BASE_URL=http://localhost:3000/api  # Required
VITE_APP_NAME=Datawise Frontend              # Optional
VITE_APP_VERSION=1.0.0                       # Optional — surfaced in footer / SEO
VITE_GTAG_ID=G-XXXXXXXXXX                    # Optional — Google Analytics
VITE_SENTRY_DSN=                             # Optional — error reporting
VITE_NOINDEX=true                            # Optional — block search engines on staging
```

## Adding shadcn Components

```bash
pnpm dlx shadcn@latest add [component-name]
```

If the new component uses `class-variance-authority` with color variants, extend it to all design tokens (`default`, `secondary`, `accent`, `destructive`, `success`, `warning`, `outline`, `ghost`, `link`) — see [`CLAUDE.md`](./CLAUDE.md#component-variant-rule) for the canonical variant table.

## Releases

This project uses **Changesets** to manage versioning, `CHANGELOG.md`, and GitHub Releases. The flow:

1. In your PR run `pnpm changeset`, pick a bump type, and commit the generated `.changeset/<slug>.md` file.
2. On merge to `main`, the release workflow opens (or updates) a "Version Packages" PR.
3. Merging that PR tags `vX.Y.Z`, creates the GitHub Release, and posts to Slack.

See [`RELEASE.md`](./RELEASE.md) for the full contributor guide, edge cases, and CLI cheatsheet.

## Contributing

1. Follow existing folder structure and patterns
2. Run `pnpm lint:fix && pnpm format` before committing (Husky + lint-staged enforce this)
3. Use `~/` import alias for app-relative paths
4. Add SEO meta tags for new pages via `generateSEOTags()`
5. Add a changeset (`pnpm changeset`) for any user-visible change

See [`CONTRIBUTING.md`](./CONTRIBUTING.md) for commit conventions, branch naming, and the local dev checklist.
