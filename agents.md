# Agents

This document describes the automated agents, workflows, and project conventions for the Datawise Datalab Frontend v2.

## Project Overview

Datawise Africa data lab platform — a React-based web application for dataset discovery, creation, dashboards, research reports, and creator workspaces.

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
pnpm format       # Prettier --write .
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
    datasets.tsx       # Dataset catalog
    dataset-detail.tsx # Single dataset view
    dashboards/        # Embedded dashboards (AfyaKen, EduKen)
    dashboards.tsx     # Dashboards listing
    categories/        # Categories CRUD
    products/          # Products CRUD
    research.tsx       # Research hub
    research-reports.tsx
    research-report-detail.tsx
    success-stories.tsx
    success-story-detail.tsx
    creators.tsx       # Creator profiles
    workspace.tsx      # Creator workspace
    about.tsx, contact.tsx, team.tsx, docs.tsx
    privacy-policy.tsx, terms-of-service.tsx
    sitemap.xml.ts     # Dynamic sitemap
    app/               # Dashboard layout routes
  components/
    ui/                # shadcn/ui components (button, card, input, etc.)
    form-fields/       # Reusable form field wrappers
      form-text-field.tsx
      form-password-field.tsx
      form-textarea-field.tsx
      form-select-field.tsx
      form-number-field.tsx
      form-otp-field.tsx
    admin/             # Admin components (applications table, modals)
    analytics/         # Analytics charts and geo map
    command-palette.tsx # Global Ctrl+K command palette
    creator-dashboard/ # Creator dashboard (dataset list, preview, status)
    dashboard/         # Dashboard layout (sidebar, mobile nav, notification bell)
    dataset-card/      # Dataset card components
    landing/           # Landing page sections (hero, FAQ, etc.)
    reviews/           # Review list component
    workspaces/        # Workspace card, member list, invite dialog, settings
    dataset-catalog/   # Dataset catalog/search
    dataset-preview/   # Dataset preview components
    download-flow/     # Download flow components
    forms/             # Complex form components
    layout/            # Layout components
    user-profile/      # User profile components
    root-layout.tsx    # App shell: nav, footer, theme editor, toaster
    theme-editor.tsx   # Floating gear button for live theme editing
    error-boundary.tsx
    loading-indicator.tsx
    data-table.tsx
  features/
    auth/              # Auth queries, mutations, query-keys
    bookmarks/         # Bookmark queries, mutations, query-keys
    categories/        # Category queries, mutations, query-keys
    dashboards/        # Dashboard queries, mutations, query-keys
    dataset-creator/   # Dataset creation queries, mutations, query-keys
    datasets/          # Dataset queries, mutations, query-keys
    downloads/         # Download queries, mutations, query-keys
    metadata/          # Metadata queries, mutations, query-keys
    products/          # Product queries, mutations, query-keys
    reviews/           # Review queries, mutations, query-keys
    workspaces/        # Workspace queries, mutations, query-keys
  store/
    index.ts           # Redux store config with persist
    storage.ts         # SSR-safe storage adapter (noop on server)
    theme-sync.tsx     # Syncs Redux theme state to CSS custom properties
    slices/
      theme-slice.ts   # Dark mode, hue values, border radius, fonts
      auth-slice.ts    # Token, user, isAuthenticated
      filter-slice.ts  # Keyed filter state: useAppFilter('datasets')
      modal-slice.ts   # Type-safe keyed modals: useAppModal<T>('key')
      dataset-controls-slice.ts # Dataset-specific UI controls
  lib/
    api/client.ts      # Axios instance with auth interceptor
    env.ts             # Zod-validated environment variables
    providers/
      store-provider.tsx  # Redux + PersistGate (SSR-safe)
      query-provider.tsx  # TanStack Query + DevTools (lazy, dev-only)
    utils/seo.ts       # SEO meta tag generation
    table-cols.ts      # TanStack Table column definitions
  root.tsx             # App entry: StoreProvider > QueryProvider > Outlet + Toaster + CommandPalette
  app.css              # Tailwind + shadcn CSS variables + M3 design tokens
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
- **Keyed filters**: `useAppFilter('datasets')` returns scoped filter state + dispatchers
- **Keyed modals**: `useAppModal<T>('key')` returns `{ isOpen, data, open, close, toggle }`
  - Type-safe via `ModalRegistry` interface (declaration merging)
- **Typed hooks**: use `useAppDispatch` and `useAppSelector` (not raw `useDispatch`)
- **Dataset controls**: `dataset-controls-slice.ts` for dataset-specific UI state

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
- **M3 design tokens** in `app.css`: elevation shadows (`shadow-elevation-0` to `5`), motion easing (`ease-standard`, `ease-deceleration`, `ease-acceleration`, `ease-sharp`), and functional colors (`success`, `warning` with foreground variants)

### Component Variant Rule

When installing or creating a shadcn/ui component that uses `class-variance-authority` (cva) with color variants, you **must** extend its variants to include all design token colors:

- `default` — `bg-primary text-primary-foreground`
- `secondary` — `bg-secondary text-secondary-foreground`
- `accent` — `bg-accent text-accent-foreground`
- `destructive` — `bg-destructive text-white`
- `success` — `bg-success text-success-foreground`
- `warning` — `bg-warning text-warning-foreground`
- `outline` — `border bg-background` (hover: accent)
- `ghost` — transparent (hover: accent)
- `link` — `text-primary` with underline on hover

Components that currently follow this: `Button`, `Badge`, `Alert`. Apply the same pattern to any new component with variant support (e.g., `Toggle`, `ToggleGroup`).

### Mutation Error Handling

All mutations must include an `onError` handler that toasts the error using `extractError` + `toastUtils`:

```ts
import { extractError } from '~/lib/utils/extract-error';
import { toastUtils } from '~/lib/utils/toast';

return useMutation({
  mutationFn: async (input) => {
    /* ... */
  },
  onError: (error) => {
    toastUtils.error('Action failed', extractError(error));
  },
});
```

This eliminates the need for try/catch or onError at call sites.

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
- **Readonly props**: all component props must be wrapped with `Readonly<>` (e.g., `({ title, count }: Readonly<MyProps>)`)

## Forms — React Hook Form + Zod + Reusable Field Components

All forms must use **React Hook Form** with **Zod** validation via `zodResolver`. Use the reusable field components from `app/components/form-fields/` instead of inline `FormField` renders.

### Available field components

| Component           | Use for                               |
| ------------------- | ------------------------------------- |
| `FormTextField`     | Text, email, url, date inputs         |
| `FormTextareaField` | Multi-line text inputs                |
| `FormSelectField`   | Single-select dropdowns (AsyncSelect) |
| `FormNumberField`   | Numeric inputs                        |
| `FormPasswordField` | Password inputs                       |
| `FormOtpField`      | OTP code inputs                       |

### Single-step form pattern

```tsx
const form = useForm<MyInput>({
  resolver: zodResolver(mySchema),
  defaultValues: { name: '', description: '' },
});

return (
  <Form {...form}>
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <FormTextField control={form.control} name="name" label="Name" required />
      <FormTextareaField
        control={form.control}
        name="description"
        label="Description"
      />
    </form>
  </Form>
);
```

### Multi-step form pattern

Use `MultiStepForm` from `~/components/ui/multi-step-form` inside a `<Form>` provider. Each step component uses `useFormContext` and `useStepValidator`.

```tsx
<Form {...form}>
  <MultiStepForm steps={steps} onSubmit={() => form.handleSubmit(handler)()}>
    {(step) => {
      /* render step components */
    }}
  </MultiStepForm>
</Form>
```

Step components register validators via `useStepValidator`:

```tsx
function StepBasicInfo() {
  const { control, trigger, formState } = useFormContext<MyFormValues>();
  useStepValidator(async () => {
    const valid = await trigger(['name', 'category']);
    if (valid) return { valid: true };
    // collect field errors for the summary panel
    const errors: Record<string, string> = {};
    for (const key of ['name', 'category']) {
      const err = formState.errors[key as keyof typeof formState.errors];
      if (err?.message) errors[key] = String(err.message);
    }
    return { valid: false, errors };
  });
  return <FormTextField control={control} name="name" label="Name" required />;
}
```

### Key rules

- All Zod schemas live in `app/lib/schema/` — never define schemas inside components
- Never use raw `useState` for form data — always use `useForm`
- Never write inline `FormField` + `FormItem` + `FormControl` + `FormMessage` — use the field components
- For selects with numeric IDs, keep them as strings in the form schema and coerce to numbers on submit
- `MultiStepForm` supports `renderHeader` / `renderFooter` props with a `StepNavigation` context for custom UI

### References

- Upload dataset form: `app/routes/app/upload-dataset.tsx` + `app/components/upload-dataset-steps/`
- Creator application form: `app/routes/app/become-dataset-creator.tsx`
- Form schema: `app/lib/schema/upload-dataset-schema.ts` (includes `uploadFormSchema` for form + `createDatasetSchema` for API)

---

## File Uploads — `useFileUpload` hook + `DropZone`

Use the `useFileUpload` hook (`app/hooks/use-file-upload.ts`) for all file upload state management. It pairs directly with the `DropZone` component (`app/components/ui/drop-zone.tsx`).

### Hook options

| Option         | Type                             | Default             | Description                                           |
| -------------- | -------------------------------- | ------------------- | ----------------------------------------------------- |
| `multiple`     | `boolean`                        | `false`             | Single file or multiple files mode                    |
| `output`       | `'file' \| 'base64' \| 'blob'`   | `'file'`            | Data format stored in `ManagedFile.data`              |
| `preview`      | `boolean`                        | `false`             | Generate object URL previews for images               |
| `maxFiles`     | `number`                         | `1` / `10`          | Max files (defaults depend on `multiple`)             |
| `maxSizeBytes` | `number`                         | `100 * 1024 * 1024` | Max file size in bytes                                |
| `accept`       | `string[]`                       | —                   | MIME types or extensions (e.g. `[".pdf", "image/*"]`) |
| `onFileChange` | `(files: ManagedFile[]) => void` | —                   | Fires on every add/remove/clear                       |

### Single-file mode

```tsx
const { file, addFiles, remove, error } = useFileUpload({
  output: 'base64',
  preview: true,
  accept: ['image/*'],
});

<DropZone onFiles={addFiles} accept="image/*" multiple={false} />;
{
  file?.preview && <img src={file.preview} alt={file.name} />;
}
```

### Multiple-file mode

```tsx
const { files, addFiles, remove, clear, getData, error } = useFileUpload({
  multiple: true,
  output: 'base64',
  preview: true,
  maxFiles: 5,
  maxSizeBytes: 20 * 1024 * 1024,
  accept: ['.pdf', '.csv', 'image/*'],
  onFileChange: (newFiles) => {
    form.setValue(
      'attachments',
      newFiles.map((f) => f.data as string)
    );
  },
});

<DropZone
  onFiles={addFiles}
  accept=".pdf,.csv,image/*"
  hint="Max 20 MB per file"
/>;

{
  files.map((f) => (
    <div key={f.key}>
      {f.preview && <img src={f.preview} alt={f.name} />}
      <span>
        {f.name} ({f.size} bytes)
      </span>
      <button onClick={() => remove(f.key)}>Remove</button>
    </div>
  ));
}
```

### Return shape

**Single mode** (`multiple: false`): `file`, `files`, `addFiles`, `remove`, `clear`, `getData`, `error`, `isProcessing`, `clearError`

**Multiple mode** (`multiple: true`): `files`, `addFiles`, `remove(key)`, `removeAt(index)`, `clear`, `getData`, `error`, `isProcessing`, `clearError`

### Key rules

- `DropZone.onFiles` accepts `FileList | File[] | File` — pass `addFiles` directly, no wrapper needed
- Previews are auto-revoked on remove/clear/unmount — no manual cleanup
- Use `onFileChange` to sync files into React Hook Form via `form.setValue`
- `getData()` returns typed data matching the `output` format (`File`, `string`, or `Blob`)

---

## CI/CD Agents

### PR Validation Workflow

**File:** `.github/workflows/main.yml`
**Trigger:** Pull requests targeting `main`

---

## useEffectEvent for Effects with Latest Values

Use `useEffectEvent` (React 19) when an effect needs to read the latest state/props without re-triggering. This replaces ref-based workarounds and avoids stale closures.

**Why:** Prevents unnecessary effect re-runs while still reading fresh values. The callback always sees the latest render values, and the effect only re-synchronizes on its actual dependencies.

**Pattern:**

```ts
const onDialogOpened = useEffectEvent((entity: Entity | null) => {
  if (!entity) return; // early return offloads conditions from useEffect
  form.reset({ name: entity.name });
  setPreview(entity.image_url);
});

useEffect(() => {
  if (isOpen && isEditing) {
    onDialogOpened(entity); // pass data as args
  }
}, [isOpen, isEditing, entity]);
```

**Rules:**

- Only call from inside `useEffect`, never during render
- Do NOT add to dependency arrays
- Use early returns inside the callback

---

## Styling — `cn()` Utility

For conditional or merged class names, always use `cn()` from `~/lib/utils`:

```ts
import { cn } from '~/lib/utils';
// Merge base classes with conditional and override classes
cn('base-class', isActive && 'active-class', className);
```

Never use string concatenation or template literals for conditional Tailwind classes.

---

## Browser Automation with Playwright MCP

The Playwright MCP server is configured in `.mcp.json` at project root:

```json
{
  "mcpServers": {
    "playwright": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "@playwright/mcp@latest"],
      "env": { "BROWSER": "chromium" }
    }
  }
}
```

### Workflow

1. **Navigate** — Use `browser_navigate` to open pages (`http://localhost:5173/...`)
2. **Inspect** — Use `browser_snapshot` to get the page's accessibility tree (element refs, text, structure)
3. **Interact** — Use `browser_click`, `browser_type`, `browser_fill_form` with element `ref` from snapshots
4. **Screenshot** — Use `browser_take_screenshot` to capture visual state
5. **Close** — Use `browser_close` to reset browser state if file chooser modals or other state gets stuck

### Screenshot Convention

Store screenshots in `.playwright-mcp/screenshots/` grouped by page:

```
.playwright-mcp/screenshots/
├── landing/
│   ├── mobile-375.png
│   ├── tablet-768.png
│   └── desktop-1440.png
├── datasets/
│   ├── mobile-375.png
│   ├── tablet-768.png
│   └── desktop-1440.png
├── dashboards/
│   ├── mobile-375.png
│   ├── tablet-768.png
│   └── desktop-1440.png
└── <page-name>/
    └── ...
```

### Responsive Testing Viewports

| Device  | Width | Height |
| ------- | ----- | ------ |
| Mobile  | 375   | 812    |
| Tablet  | 768   | 1024   |
| Desktop | 1440  | 900    |

Use `browser_resize` before taking screenshots at each viewport.

### Known Limitations

- **File chooser dialogs:** Clicking file upload buttons triggers native OS file pickers that queue up in Playwright. If stuck, use `browser_close` to reset and `browser_navigate` to re-open the page. The file upload works fine in real browsers.
- **Snapshot vs Screenshot:** `browser_snapshot` returns the accessibility tree (needed to get element refs for interaction). `browser_take_screenshot` returns a visual image (for review only, can't interact based on it).

---

## Contribution Guide

See `CONTRIBUTING.md` for the full guide. Key points below.

### Commit Message Format

Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>(<scope>): <subject>

<body> (optional)

<footer> (optional)
```

**Types:**

| Type       | Description                                     | Example                                         |
| ---------- | ----------------------------------------------- | ----------------------------------------------- |
| `feat`     | New feature                                     | `feat(datasets): add dataset preview modal`     |
| `fix`      | Bug fix                                         | `fix(auth): resolve token refresh loop`         |
| `docs`     | Documentation only                              | `docs: update API client usage in README`       |
| `style`    | Formatting, missing semicolons (no code change) | `style: fix indentation in layout`              |
| `refactor` | Code change that neither fixes nor adds         | `refactor(store): simplify auth slice logic`    |
| `test`     | Adding or updating tests                        | `test(categories): add mutation hook tests`     |
| `chore`    | Build, tooling, CI, dependencies                | `chore: update eslint config`                   |
| `perf`     | Performance improvement                         | `perf(queries): reduce dataset list re-renders` |
| `ci`       | CI/CD configuration                             | `ci: add preview deploy workflow`               |
| `revert`   | Revert a previous commit                        | `revert: revert feat(datasets) commit abc1234`  |

**Scopes:** `datasets`, `dataset-creator`, `dashboards`, `categories`, `products`, `auth`, `bookmarks`, `downloads`, `reviews`, `metadata`, `ui`, `forms`, `store`, `api`, `routes`, `config`, `theme`. Scope is optional but encouraged.

**Subject rules:**

- Lowercase, imperative mood, no period, max 72 characters
- Good: `feat(datasets): add multi-step creation form`
- Bad: `feat(datasets): Added multi-step creation form.`

**Breaking changes:** Add `!` after type or `BREAKING CHANGE:` in footer:

```
feat(api)!: change pagination response format

BREAKING CHANGE: PaginatedResponse now uses `items` instead of `data`
```

### Branch Naming

Use the format: `<type>/<short-description>`

```
feat/dataset-preview-modal
fix/auth-redirect-loop
chore/update-dependencies
refactor/simplify-filter-slice
```

### PR Title

Follow the same commit message format:

```
feat(datasets): add dataset preview modal
fix(auth): resolve token refresh loop
```

### Pre-commit Hooks

Husky + lint-staged runs automatically on staged files:

- `*.{ts,tsx}`: ESLint with `--fix` + Prettier
- `*.{json,md,css}`: Prettier

If the hook fails, fix the issues. Do not bypass with `--no-verify`.

### After Every Code Change

```bash
pnpm lint:fix && pnpm format
```

### Local Release Script

**File:** `scripts/release.sh`

Bumps the version in `package.json`, generates categorized release notes in `CHANGELOG.md`, commits, and tags — all locally.

```bash
pnpm release patch                        # Bump patch (e.g., 0.1.0 → 0.1.1)
pnpm release minor                        # Bump minor (e.g., 0.1.1 → 0.2.0)
pnpm release major                        # Bump major (e.g., 0.2.0 → 1.0.0)
pnpm release patch -- --prerelease beta   # Pre-release (e.g., 0.1.1-beta)
pnpm release:dry patch                    # Dry run — preview without changes
```

Release notes are auto-generated from conventional commits and grouped by type (Features, Bug Fixes, Documentation, Performance, Refactoring, Tests, Build & CI, Chores).

After running, push the commit and tag manually:

```bash
git push origin main
git push origin v<version>
```

### Before Pushing

```bash
pnpm lint:fix && pnpm format && pnpm typecheck
```
