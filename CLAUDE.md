# CLAUDE.md

> **The canonical project guide lives in [`agents.md`](./agents.md).** Read it before answering questions or making changes. Treat it as the single source of truth for project conventions, patterns, tech stack, commands, and contribution rules — do not duplicate that content here.

This file exists solely so the harness loads automatically; it is a thin pointer, not a parallel handbook. When you find yourself wanting to add a convention or recipe here, put it in `agents.md` instead and link back if needed.

## What to read in `agents.md` first

- **Project Overview, Tech Stack, Commands** — for orientation.
- **Key Patterns** — SSR compatibility (incl. the `globalThis.window` rule), state management, API layer, data fetching, env vars, lint/format, styling, component variant rule, mutation error handling, animations.
- **Conventions** — file naming, imports, exports, tests, Readonly props, Zod schema location, etc.
- **Forms** — RHF + Zod + reusable field components; single-step and multi-step patterns.
- **File Uploads** — `useFileUpload` + `DropZone`.
- **useEffectEvent** — when an effect needs the latest values.
- **Styling — `cn()`** — required helper for conditional/merged class names.
- **Browser Automation with Playwright MCP** — for visual QA.
- **Contribution Guide** — Conventional Commits, branch naming, pre-commit hooks, release flow.

If anything in `agents.md` looks stale, fix it there — not here.

## Other top-level docs

- [`README.md`](./README.md) — short product + quick-start summary.
- [`RELEASE.md`](./RELEASE.md) — Changesets-based release flow.
- [`CONTRIBUTING.md`](./CONTRIBUTING.md) — extended contributor guide.
