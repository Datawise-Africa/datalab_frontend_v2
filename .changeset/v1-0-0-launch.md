---
'datalab-frontend': major
---

**Datalab v1.0.0 — initial public release.**

This is the first stable release of the Datawise Africa Datalab platform. It bundles the full set of features needed to discover, publish, purchase, and collaborate on African datasets.

### Discover & Explore

- **Dataset catalog** at `/datasets` with full-text search, sort, and pagination, plus faceted filters for category, dataset type, pricing (free / premium), and timeframe.
- **Top categories** and **featured datasets** surfaced on the landing page with a unified card layout (cover image, badges, author, tags, meta).
- **Dataset detail page** with hero cover, tabbed sections (Details, Datasheet, Schema, Versions, Reviews), origin regions, usage license, authors, and access instructions.
- **Sticky purchase / save sidebar** on the detail page with download, bookmark, and share actions.
- **Default illustration fallback** — uploaded covers display everywhere a dataset is shown; datasets without a cover fall back to a themable SVG illustration.

### Upload, Version & Publish (Creator workflow)

- **Multi-step dataset upload** (`/app/upload-dataset`) — basic info, authors & access, discovery (tags / regions), and review. Validated end-to-end with Zod and React Hook Form.
- **Cover image upload** with live preview, drag-and-drop, and 2 MB size cap.
- **Dataset versioning** — create new versions of a dataset and upload files for each version via presigned S3 URLs with progress tracking and per-file retry.
- **Schema auto-detection** — files uploaded for a version surface their column schema in the Schema tab, hardened against malformed payloads from older records.
- **Creator dashboard** at `/app/creator-dashboard` with dataset list, preview modal, and per-dataset status tabs (draft / published / archived).
- **Creator onboarding** — apply to become a creator at `/app/become-dataset-creator`, with admin review at `/app/applications` and `/app/approved-creators`.

### Downloads & Payments

- **Authenticated download flow** — request a download with intended-use, receive presigned URLs scoped to the version's files, and download directly from the browser.
- **Paystack payment integration** for premium datasets — checkout opens inline via the Paystack popup, the backend webhook flips the access status, and the download unlocks automatically once payment clears.
- **Resume-after-auth** for downloads — clicking Download while signed out captures the intent, opens the auth modal, and reopens the download modal pre-populated once the user signs in or signs up.
- **My Downloads** page (`/app/my-downloads`) listing past download requests.

### Bookmarks (My Lab)

- **Bookmark any dataset** from a card menu, card icon, or the detail page — the labels and aria attributes use a single "Bookmark" vocabulary across the app.
- **Resume-after-auth** for bookmarks — actions queued while signed out replay automatically post-login, no second click needed.
- **My Lab → Bookmarks** (`/app/bookmarks`) renders saved datasets with the full dataset-card layout (image, badges, author, tags, meta, actions) and a tabbed UI ready for future bookmark types.

### Dashboards

- **Public dashboards index** at `/dashboards` plus dedicated landing pages for **AfyaKen** and **EduKen** Looker-embedded dashboards.
- **My Dashboards** (`/app/my-dashboards`) — creator CRUD for dashboards: create, edit, view, list, and embed via iframe-safe URL.
- **Dashboard categories** managed from `/app/dashboard-categories`.
- **Dashboard cover images** with fallbacks for missing thumbnails.

### Workspaces

- **Collaborative workspaces** at `/app/workspaces` — create a workspace, invite members, and scope datasets and dashboards to that workspace.
- **Workspace sub-routes** — overview, members, datasets, dashboards (with create/edit/detail), analytics, invitations, and settings — all under a dedicated layout.
- **Workspace-scoped dataset upload** via `/app/workspaces/:id/datasets/new`.

### Research

- **Research hub** (`/research`) with a curated landing page, **research reports listing** (`/research/reports`), and **report detail pages** with rich content rendering.

### Auth, Identity & Personalization

- **Email + password auth** with login, signup, forgot-password, and OTP-based reset flows, all surfaced via a single modal.
- **Persisted auth state** (Redux Toolkit + redux-persist) with SSR-safe storage adapter and automatic 401 logout via the Axios interceptor.
- **Account settings** at `/app/account-settings` with profile editing, password change, and bio fields.
- **Live theme editor** — switch dark mode, customize primary/secondary/tertiary hues, fonts, and border radius from a floating gear button; preferences persist across sessions.

### SEO, Sharing & Polish

- **Server-side rendering** (React Router 7) with per-route SEO meta and Open Graph tags, JSON-LD structured data for datasets and breadcrumbs, plus a dynamic `sitemap.xml` and `robots.txt`.
- **Native share** — the share action uses the Web Share API on mobile / Safari and falls back to clipboard copy with toast feedback on desktop.
- **Toast-based feedback** throughout via a unified `toastUtils` API; the API client surfaces validation errors automatically.
- **Cookie-light analytics** — view tracking for datasets and dashboards.
- **Custom `404`/error boundaries** with friendly recovery affordances.

### Quality & DX

- Full TypeScript strict mode, ESLint 9 flat config, Prettier + Tailwind plugin, Husky + lint-staged + commitlint.
- Vitest + React Testing Library wired up; SonarQube + CI lint/build pipelines in GitHub Actions.
- **Changesets** now owns versioning and CHANGELOG generation — see `RELEASE.md` for the contributor flow.
