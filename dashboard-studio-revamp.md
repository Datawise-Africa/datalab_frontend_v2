# Dashboard Studio Revamp

Working doc for reorganising the native Dashboard Studio (our in-house alternative to Power BI embeds) into a full-screen, chromeless editor — closer to Rows / Eraser / Figma than to a page inside the app shell.

Status: **Phases 1–2 done** (layout + composition) (all changes staged, not committed). Sections 2–3 describe the pre-revamp state; see 7.1–7.2 for progress.

---

## 1. Goal

- Opening the studio shows **only studio UI**: no app sidebar, no app header, no workspace header block.
- Studio lives **outside** the app shell (`dashboard-layout.tsx`) and the workspace layout, so it stops fighting their padding, width caps and scroll container.
- Controls grouped so features are easy to trace:
  - **Top bar**: document-level actions (title, save state, undo/redo, preview, share, save).
  - **Left rail**: tool sets (insert visuals, model, settings incl. integrations/data sources).
  - **Bottom bar**: page tabs.
  - **Right aside**: properties of the current selection (and secondary panels like history/comments).
  - **Canvas**: the dashboard itself.

---

## 2. Current state — UI walk-through

URL audited: `/app/workspaces/:id/dashboards/:dashboardId/studio` (empty dashboard, admin user).

What renders on screen, top to bottom:

1. App shell sidebar (w-64) — workspace nav (Overview, Members, Datasets, Dashboards, …) + Dark mode / Sign out.
2. App shell header (h-14) — search, notifications, profile.
3. Workspace header — "All workspaces", workspace name, description, members/datasets/dashboards pills, role badge.
4. Studio top bar — back, title, "Studio" badge, save status, Undo, Redo, Preview, History, Model, Refresh, Alerts, Review, Share, Save.
5. Page bar — page tabs, "+ Page", theme select, left/right panel toggles.
6. Three columns — Data sources | Canvas (page title, Delete page, Add visual) | Properties.

Toolbar actions today (all open **centered modals**):

| Button               | Opens                     | Notes                                               |
| -------------------- | ------------------------- | --------------------------------------------------- |
| History              | Version history dialog    | "History will appear after the first save."         |
| Model                | Data model dialog         | Relationship builder form only                      |
| Refresh              | Refresh dialog            | Refresh now, schedule, run history                  |
| Alerts               | Data alerts dialog        | Create form + list                                  |
| Review               | Review comments dialog    | Flat comment list                                   |
| Share                | Share dashboard dialog    | Link permission / password / expiry, active links   |
| Connect (data panel) | Connect data dialog       | File / Datalab / API tabs                           |
| Add visual (canvas)  | Visual type picker dialog | 25 types                                            |
| Preview              | Toggles in place          | Hides page bar + panels; shell chrome still visible |

### Problems observed

- **Three layers of chrome above the studio** (shell sidebar, shell header, workspace header). The editor starts ~250px down the page; on a 952px-tall viewport over a quarter of the screen is non-studio UI.
- **Width capped at 1280px** by the shell's `max-w-7xl` wrapper while the studio wants `max-w-[1800px]` and a 3-column grid.
- **Flat toolbar of 11 buttons** with equal weight — document actions (Share/Save), data actions (Model/Refresh), and collaboration (Review/History) all mixed. Labels collapse to icons below `2xl`.
- **Everything is a modal.** History, comments, model, alerts are all things you'd want _next to_ the canvas, not blocking it.
- **Preview isn't really preview** — shell sidebar/header and workspace header remain.
- **Data sources panel and properties panel both compete** for space; below `xl` everything stacks into one column.
- **Theme select sits in the page bar**, unrelated to pages.

---

## 3. Current state — code audit

### 3.1 Routing & shell nesting

`app/routes.ts`:

- Workspace studio: `app/workspaces/:id/dashboards/:dashboardId/studio` → `routes/app/workspace/dashboard-studio.tsx` (L81-84). Param is `:id`.
- Personal studio: `app/my-dashboards/:id/studio` → `routes/app/dashboard-studio.tsx` (L58), wrapped in `<Protect roles={['creator','admin']}>`.

Nesting chain (workspace studio):

```
root.tsx                     StoreProvider, QueryProvider, CommandPalette, AuthModal, DownloadModal, Toaster(top-right)
└─ routes/app/dashboard-layout.tsx   (app shell, 583 lines)
   Protect · sidebar w-64/w-16 · header h-14 · main.overflow-y-auto > div.max-w-7xl.px-4..lg:px-8.py-6
   └─ routes/app/workspace/layout.tsx  (137 lines)
      Protect · workspace header (name, description, stat pills) · <Outlet/>
      └─ routes/app/workspace/dashboard-studio.tsx (6 lines) → <DashboardStudio dashboardId workspaceId/>
```

- No dashboard-level layout; detail, `/edit`, `/studio` are sibling leaves.
- No loaders / outlet context anywhere under `routes/app` — all data via React Query. **Moving the route requires no data plumbing changes.**
- Precedent for escaping the shell: `shared-dashboards/:token` is a top-level route (`routes/shared-dashboard.tsx`) rendering its own `main.min-h-screen`.
- Entry points: "Open Studio" in `components/dashboards/dashboard-detail.tsx` (L95-97, L156-162), redirect after create in `dashboard-editor.tsx` (L85-91), "Create & open Studio" in `forms/dashboard-form.tsx` (L216). URLs stay the same if we only change the layout wrapping.

### 3.2 Component map

All in `app/components/dashboard-studio/` unless noted.

| File / component                                              | Lines               | Role                                                                                                     |
| ------------------------------------------------------------- | ------------------- | -------------------------------------------------------------------------------------------------------- |
| `dashboard-studio.tsx` → `DashboardStudio`                    | 226-929 (file 2857) | Orchestrator: definition state, undo/redo, autosave, top bar, page bar, 3-col grid, all dialogs mounted  |
| ↳ `DataPanel`                                                 | 931-1042            | Data sources aside + Connect                                                                             |
| ↳ `VisualPanel`                                               | 1044-2013           | Properties inspector (~970 lines), resizable 320-640px                                                   |
| ↳ `CalculatedFields`                                          | 2015-2215           | Per-visual calculated fields                                                                             |
| ↳ `Filters`                                                   | 2217-2344           | Per-visual filters                                                                                       |
| ↳ `SourceDialog`                                              | 2374-2589           | Connect data (File / Datalab / API)                                                                      |
| ↳ `SourceProfileDialog`                                       | 2591-2665           | Column profile stats                                                                                     |
| ↳ `ShareDialog`                                               | 2675-2796           | Share links                                                                                              |
| ↳ `HistoryDialog`                                             | 2798-2857           | Revisions + restore                                                                                      |
| `dashboard-renderer.tsx`                                      | 718                 | `Chart` (all visual types, recharts) + `DashboardRenderer` (12-col grid, selection, client cross-filter) |
| `studio-management-dialogs.tsx`                               | 540                 | `DataModelDialog`, `RefreshDialog`, `AlertsDialog`, `CommentsDialog`                                     |
| `source-preparation-dialog.tsx`                               | 228                 | Prepare recipe (rename, cast, replace, fill, drop)                                                       |
| `infographic-builder.tsx`                                     | 361                 | Infographic from a widget, SVG/PNG export                                                                |
| `studio-geo-map.tsx`                                          | 88                  | Leaflet map, client-only                                                                                 |
| `live-dashboard.tsx`                                          | 183                 | Viewer runtime (shared/detail pages), not used in studio                                                 |
| `features/dashboard-studio/{queries,mutations,query-keys}.ts` | 169 / 342 / 13      | React Query hooks                                                                                        |
| `lib/schema/dashboard-studio-schema.ts`                       | 69                  | Zod schemas                                                                                              |
| `lib/types/dashboard.ts`                                      | 379                 | Types                                                                                                    |

Total studio component + feature code: ~5,500 lines, over half in one file.

### 3.3 Feature inventory (and proposed home)

| Area                    | What exists                                                                                                                                                                                                                                                                        | Where today                   | Proposed home                                                                                                |
| ----------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------- | ------------------------------------------------------------------------------------------------------------ |
| **Data sources**        | Connect file (CSV/TSV/XLSX/JSON/Parquet), Datalab dataset, public API; delete; profile; prepare recipe                                                                                                                                                                             | Left panel + 3 modals         | **Settings → Integrations** tab; connect = modal (source grid); profile/prepare = right aside or large sheet |
| **Data model**          | Relationships (sources, keys, join, cardinality)                                                                                                                                                                                                                                   | Modal                         | Left rail → **Model** tab, or full-canvas "Model view" mode (nodes + lines)                                  |
| **Refresh**             | Refresh now, schedule, run history                                                                                                                                                                                                                                                 | Modal                         | **Top bar** (Refresh button → popover with refresh now / schedule / runs)                                    |
| **Visuals**             | 25 types (KPI, charts, table, narrative, map, heatmap, waterfall, treemap, funnel, gauge, filter, image, shape…)                                                                                                                                                                   | "Add visual" modal            | Left rail → **Insert** tab (grouped palette), plus canvas "+"                                                |
| **Visual config**       | General, data & analysis (source, related sources, group by, date grain, calc fields, measures, table calcs, filters, sort, map/gauge fields, run, export), layout & format (width, height, legend, grid, number format, decimals), actions (move, duplicate, infographic, delete) | One long stacked panel        | Right aside with **tabs: Data · Analysis · Format**; actions in a floating widget toolbar on canvas          |
| **Pages**               | Add, delete, rename, switch                                                                                                                                                                                                                                                        | Page bar tabs + canvas header | **Bottom page tab bar** (Rows / Clay style)                                                                  |
| **Theme**               | 4 presets (only `background`/`radius` actually applied by renderer)                                                                                                                                                                                                                | Page bar select               | **Settings → General** tab                                                                                   |
| **Preview**             | Hides panels, single column                                                                                                                                                                                                                                                        | Top bar toggle                | Top bar; true full-screen once shell is gone                                                                 |
| **History**             | Revision list + restore; every save incl. autosave creates one                                                                                                                                                                                                                     | Modal                         | Right aside panel (Notion / Fibery style)                                                                    |
| **Review**              | Flat comments tied to page/widget                                                                                                                                                                                                                                                  | Modal                         | Right aside panel; later: pins on widgets                                                                    |
| **Alerts**              | Threshold alerts, create + list                                                                                                                                                                                                                                                    | Modal                         | Right aside panel or per-widget action                                                                       |
| **Share**               | Link permission, password, expiry, copy, revoke                                                                                                                                                                                                                                    | Modal                         | Top-right Share popover (Gamma / Craft style)                                                                |
| **Infographic**         | Build from widget, save, SVG/PNG                                                                                                                                                                                                                                                   | Modal                         | Widget toolbar action (keep modal)                                                                           |
| **Undo/redo, autosave** | 50-step stack, 12s debounced autosave                                                                                                                                                                                                                                              | Top bar                       | Top bar (unchanged)                                                                                          |

### 3.4 Layout-coupled code to remove when moving out of the shell

- Studio root uses `-m-4 lg:-m-6` to claw back shell padding (L535) — mismatched against shell's `px-4 sm:px-6 lg:px-8 py-6`.
- `header.sticky.top-0` (L536) sticks inside the shell's `main.overflow-y-auto`, only after the workspace header scrolls away.
- Hard-coded heights ignore shell chrome: grid `min-h-[calc(100vh-108px)]` (L719), properties `max-h-[calc(100vh-175px)]` (L1209), data panel `max-h-[42vh]` (L951).
- Shell `max-w-7xl` caps studio width.
- Global `Toaster` at top-right overlaps Save area; autosave fires a "Dashboard saved" toast every 12s of edits (mutations.ts L138).
- Auth: workspace studio relies on the shell/workspace layout `Protect`; the leaf has no role check. A new studio layout must keep `Protect`.

### 3.5 Other findings worth tracking (not layout, but surfaced by the audit)

- All dialogs are always mounted and their queries (revisions, share links, refresh runs, alerts, comments, dataset options) fire on studio load.
- Theme `preset` is written but never read by the renderer; `settings` (showTitles, compact…) never editable.
- `histogram` falls through to bar chart; `filter` visual is a placeholder in studio (works only in `LiveDashboard`).
- Cross-filter clear chip lives in the page-tab bar that the studio hides.
- No keyboard shortcuts (beyond resize handle), no `beforeunload` guard, no drag-and-drop reordering, no global dashboard filters UI (`DashboardGlobalFilter` type exists), no studio tests.
- Save/restore don't invalidate `useMyDashboard` / `useWorkspaceDashboard` (detail page can show stale data for up to 5 min).

---

## 4. References (Mobbin)

### 4.1 Full-screen editor shells (the overall frame)

| App         | Link                                                                                            | Take-away                                                                                                                                                                                                                  |
| ----------- | ----------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Rows        | [Chart editor](https://mobbin.com/screens/3f966921-6346-4cee-aeda-0530886ddbea)                 | Slim top bar: doc title left, Insert / Data / Edit chart / AI centred, history/comments/share right. Right aside swaps content (Chart editor, Functions, Conditional formatting, AI analyst). Page tabs under the top bar. |
| Rows        | [Empty chart state](https://mobbin.com/screens/675f1d8b-ba08-4194-b89c-ca44a67ae13a)            | Inline empty state on the element itself ("Add data to chart")                                                                                                                                                             |
| Rows        | [AI Analyst aside](https://mobbin.com/screens/0743ae2d-ac2a-4625-955a-a8e3585f3661)             | Same aside slot reused for an assistant                                                                                                                                                                                    |
| Rows        | [Conditional formatting aside](https://mobbin.com/screens/b3838b54-1900-4128-9b7a-3e638594bc53) | Aside as contextual tool panel                                                                                                                                                                                             |
| Figma Sites | [Editor](https://mobbin.com/screens/b62f7a88-50de-4ef0-bd2f-a238d83dd36a)                       | Left: pages + layers tree. Right: Design / Interaction tabs. Floating bottom tool bar.                                                                                                                                     |
| Retool      | [Module editor](https://mobbin.com/screens/47ab2ae2-be24-43d0-9181-c12f0f0b85a7)                | Thin icon rail far-left → components palette panel; canvas; right settings; zoom bottom-left                                                                                                                               |
| Zoho CRM    | [Canvas builder](https://mobbin.com/screens/8a140e48-2c78-4aaf-b445-676372778c9c)               | Icon rail (Data, Elements, Style, Queries) driving the left panel; right Properties                                                                                                                                        |
| Arcade      | [Editor](https://mobbin.com/screens/cf33ce51-56da-4b52-b137-43e92f3d26ac)                       | Edit / Preview / Insights mode switch centred in top bar; right icon rail picks aside section                                                                                                                              |
| Gamma       | [Page setup aside](https://mobbin.com/screens/ad2f9c1b-eb7a-4974-bb87-5d76573d8591)             | Floating page-thumbnail panel on the left; right aside for settings; Theme / Share / Present in top bar                                                                                                                    |
| beehiiv     | [Page builder](https://mobbin.com/screens/cd896359-6a02-4447-baf4-5aeb1ac21792)                 | Styles / Layout / Settings segmented control top-left; page select centred; device + Publish right                                                                                                                         |
| Jitter      | [Editor](https://mobbin.com/screens/1b82de67-4ac2-49d8-bf2b-50cd6c074cb4)                       | Insert tools in top bar, Design / Animate tabs on right                                                                                                                                                                    |

### 4.2 Whiteboard-style (Eraser-like) chrome

| App             | Link                                                                               | Take-away                                                                                                           |
| --------------- | ---------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| Frame           | [Whiteboard](https://mobbin.com/screens/1d7ec436-5fcb-4926-bc9a-8a34463c9974)      | Breadcrumb top-left, close top-right, floating contextual panel left, bottom tool bar + undo/redo, zoom bottom-left |
| Craft           | [Whiteboard](https://mobbin.com/screens/98740964-6d4e-49cf-a2be-ddaeb0c20599)      | "Close" button top-left, floating top toolbar, floating style panel                                                 |
| Miro            | [Board](https://mobbin.com/screens/f2571c5f-54f7-4ccd-8526-e37f76f79a16)           | Vertical floating tool rail left; tool library flyout; Present/Share top-right                                      |
| Mural           | [Board](https://mobbin.com/screens/fdd5b15e-0dac-4c95-bf90-6924b6896318)           | Floating clusters in every corner, nothing docked                                                                   |
| Zoom Whiteboard | [Board + history](https://mobbin.com/screens/3172bc5f-0aa6-4405-ac12-a24d50af99a0) | Floating left tool rail, version history as floating right card                                                     |
| Tana            | [Canvas](https://mobbin.com/screens/c7c9ca53-53f0-414b-ae58-80818ea27f38)          | Bottom tool bar, floating style popover top-right                                                                   |
| Fibery          | [Whiteboard](https://mobbin.com/screens/fd082957-c4ff-4fab-ba56-22fbd584c4da)      | Present / Fullscreen / Fit to screen in header                                                                      |

### 4.3 BI / dashboard edit mode (closest domain)

| App                | Link                                                                                        | Take-away                                                                                                                                                                                   |
| ------------------ | ------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Twenty             | [Dashboard chart settings](https://mobbin.com/screens/2f8f1806-a1c9-4667-b7f7-22aa76b18b27) | Grid canvas with tabs ("Tab 1 / + New Tab"); right panel has chart-type icon row then Data (source, filter, group, sort) and Style (colors, labels, legend) rows — compact, row-per-setting |
| Basedash           | [Chart editing](https://mobbin.com/screens/40737ddc-a0bb-4cdb-9f46-444d60b575fe)            | "Editing" badge + "Done editing" in top bar; right panel: query, chart type, axes, metrics, format; inline "describe any changes" AI box                                                    |
| Sigma (via Deputy) | [Workbook](https://mobbin.com/screens/f43538f8-976a-4c3f-9859-50a757484931)                 | Bottom insert dock (Data, Charts, Controls, UI, Layout) opening a chart-type grid; right Settings / Format / Actions tabs; Editing ↔ Publish                                                |
| Zoho Analytics     | [Dashboard builder](https://mobbin.com/screens/c73a9a18-2e9c-49d9-8402-f4d8a68bb6e4)        | Left component palette (Chart, KPI, Funnel, …), dashed grid slots on canvas, "Add Dashboard Filters" bar                                                                                    |
| Mixpanel           | [Report editor](https://mobbin.com/screens/b93a261a-cabd-4c60-9e57-bae79aea6bb8)            | Right Query / Chart / Annotations tabs; segmented controls per setting                                                                                                                      |
| Xero               | [Widget toolbar](https://mobbin.com/screens/218e0343-c602-4889-9920-bf69688ee238)           | Floating per-widget toolbar (size, compare, chart type, delete) — model for our move/duplicate/delete actions                                                                               |
| Shopify            | [Analytics edit](https://mobbin.com/screens/de0a12fd-aa59-4b79-b43c-44028ef535e6)           | Contextual Cancel / Save bar replacing the top bar while editing                                                                                                                            |
| Steep              | [Edit widget](https://mobbin.com/screens/6d05ce9e-664f-4d17-9e02-a3bad0c09d01)              | Visual-type carousel + minimal form in a modal                                                                                                                                              |

### 4.4 Data model view

| App           | Link                                                                                 | Take-away                                                                           |
| ------------- | ------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------- |
| Supabase      | [Schema visualizer](https://mobbin.com/screens/7cba75b0-973e-469d-a078-3d2794491701) | Tables as cards with fields, relationship lines, "Auto layout", minimap             |
| Twenty        | [Data model](https://mobbin.com/screens/5cef3d3f-8af5-4353-9da9-e2d955a6ebb1)        | Lighter object cards + relation lines, zoom controls                                |
| Vercel / Neon | [Schema](https://mobbin.com/screens/817a3207-0185-423e-9313-37472ef382f9)            | Dense ERD on dotted canvas                                                          |
| Clay          | [Workbook flow](https://mobbin.com/screens/a6ac0216-33ab-4e7e-9e1f-3d83938c22f3)     | Sources → tables as a flow, "Create" palette (sources, tables) on left, bottom tabs |

### 4.5 Connect data

| App        | Link                                                                                   | Take-away                                                    |
| ---------- | -------------------------------------------------------------------------------------- | ------------------------------------------------------------ |
| Dovetail   | [Connect data source](https://mobbin.com/screens/b18123ca-b64e-4162-a0d9-01f32872dca2) | Simple tile grid: CSV, API, integrations                     |
| Causal     | [Data sources](https://mobbin.com/screens/377f1bda-20a3-4697-b69f-c6f039d7c555)        | Category tabs + search + tiles with Connect buttons          |
| Felt       | [Connect a source](https://mobbin.com/screens/9cadb1f7-d17d-4df7-967d-b9d9b90fa87e)    | Full-screen library: left nav (Layers / Sources), right grid |
| Zapier     | [Add data source](https://mobbin.com/screens/6ca30cdc-8b99-4055-9a50-98e37bc424d0)     | Upload File as first tile                                    |
| Databricks | [Add data](https://mobbin.com/screens/dfc0c55e-babe-4658-af8c-53fda211bfe0)            | Grouped connectors + side sheet for the connect step         |

### 4.6 History / versions

| App              | Link                                                                               | Take-away                                                                          |
| ---------------- | ---------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| Notion           | [Version history](https://mobbin.com/screens/780626a3-20f5-4795-ac3b-bdbaef325210) | Preview left, version list right, Restore bottom-right                             |
| Fibery           | [Version history](https://mobbin.com/screens/eb05e8be-4a16-47f0-94fe-08ad3da74171) | "Show changes" toggle, restore confirm                                             |
| Sana AI          | [Version history](https://mobbin.com/screens/0d1c373e-876d-48f2-b460-54aa375f8b35) | Full-screen: doc preview + right list + "Restore this version" top                 |
| Google AI Studio | [Versions tab](https://mobbin.com/screens/26c8f8ba-2aaa-4028-8983-d41f4b71b784)    | Versions as one tab of a multi-tab right aside (Chat / Share / Publish / Versions) |
| WRITER           | [Version history](https://mobbin.com/screens/d6e6654e-119a-456a-acef-fcb72d9ec330) | Timeline list left, "Viewing … Restore" bar                                        |

### 4.7 Review / comments

| App    | Link                                                                                | Take-away                                                            |
| ------ | ----------------------------------------------------------------------------------- | -------------------------------------------------------------------- |
| Framer | [Comments](https://mobbin.com/screens/c2cbaabb-c99b-4e13-a56a-f7ac59e6ba5e)         | Pins on canvas + comments list in right aside                        |
| Gamma  | [Comments](https://mobbin.com/screens/ef8f45be-8fce-44f3-ab98-b9af88a735a4)         | Comment count button in top bar opens right aside, threads + resolve |
| Ditto  | [Element comments](https://mobbin.com/screens/180fce64-bdfd-4d0c-a5fc-e07a709fa88e) | Comments as a tab on the selected element's inspector                |
| Air    | [Info / Comments](https://mobbin.com/screens/2edb1d3b-2514-4ed3-9fa2-0b0d8e03117f)  | Info ↔ Comments tabs in aside; pin popover on canvas                 |

### 4.8 Share / publish

| App          | Link                                                                               | Take-away                                                         |
| ------------ | ---------------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| Gamma        | [Share dialog](https://mobbin.com/screens/8d47d238-471b-488d-b11c-259a0bdfe7a9)    | Collaborate / Share / Export / Embed tabs in one dialog           |
| Craft        | [Publish popover](https://mobbin.com/screens/a7aa7f58-06ea-4565-833f-a5df0d1287ad) | Share / Published / Export tabs; password, expiration, view count |
| Fibery       | [Share form](https://mobbin.com/screens/087083fc-9a2b-463d-8df3-b69ee56995e1)      | Public link toggle + embed iframe code with width/height          |
| Lovable      | [Share project](https://mobbin.com/screens/f7c1b011-327d-4821-ae11-2eb0fc74318e)   | Popover from Share button: people + invite link + publish         |
| Relevance AI | [Share agent](https://mobbin.com/screens/7c9dcc4d-a4f2-412a-a303-37b9f69bc2a2)     | Left tabs for share modes, embed snippet + link + preview         |

---

## 5. Draft layout direction (for iteration)

```
┌──────────────────────────────────────────────────────────────────────────────┐
│ ← Workspace / Dashboard title ▾  Saved ✓  ↶ ↷ │ Edit·Preview │ ⟳ Refresh 💬 🕘 Share  Save │  top bar (h-12)
├────┬──────────────┬───────────────────────────────────────────┬──────────────┤
│ ＋ │ INSERT       │                                           │ PROPERTIES   │
│ 🔗 │ visual       │                 CANVAS                    │ Data│Analysis│Format
│ ⚙ │ palette      │         (12-col grid, full width)         │ …            │
│    │              │                                           │ (or History, │
│    │              │     [floating widget toolbar on select]   │  Comments,   │
│    │              │                                           │  Alerts when │
│    │              │                                           │  opened)     │
├────┴──────────────┴─────────── Overview │ Sales │ + ──────────┴──────────────┤  page tabs — bottom bar
└──────────────────────────────────────────────────────────────────────────────┘
 rail:  ＋ Insert (visual palette)   🔗 Model   ⚙ Settings (tabs: General/theme · Integrations = data sources)
```

Principles:

- **One left rail → one left panel** (Retool / Zoho pattern). Rail items: Insert, Model, Settings. Panel collapsible; rail always visible.
- **Settings → Integrations tab** holds data sources (connect, profile, prepare, delete). Settings → General holds theme etc.
- **Pages** in a bottom tab bar.
- **Right aside = context.** Selection → Properties (tabbed Data / Analysis / Format). No selection → Dashboard settings. Top-bar toggles (Comments, History, Alerts) swap the aside content (Rows / Google AI Studio pattern) instead of opening modals.
- **Top bar only holds document-level actions.** Title + breadcrumb back to workspace, save status, undo/redo, Edit ↔ Preview switch, comments/history toggles, Share popover, Save.
- **Modals only for focused tasks**: Connect data, Prepare data, Infographic, restore confirmations.
- **Model** as a canvas mode (ERD view like Supabase) rather than a form — later phase; phase 1 can keep the form in the left panel.
- **Preview** = canvas only, full-screen, with an "Exit preview" pill.

Alternative to evaluate: **floating chrome** (Eraser / Frame / Miro) — panels float over a full-bleed canvas. More "whiteboard", less suited to dense BI settings; likely better as a later polish for Preview mode only.

---

## 6. Routing plan (no code yet)

1. Add a dedicated studio layout (e.g. `routes/app/studio-layout.tsx`): `<Protect>` + `h-dvh overflow-hidden` shell, no sidebar/header.
2. In `app/routes.ts`, move both studio routes out of `dashboard-layout` and the workspace layout into this new layout. **Keep the same URLs** so all entry points keep working.
3. Carry over from the old wrappers what the studio actually needs: `Protect` (plus roles for the personal variant), `robots noindex` meta, workspace existence/permission check (currently implicit via workspace layout).
4. Delete studio's shell workarounds: negative margins, `calc(100vh-…)` heights, `max-w-[1800px]`; panels become `h-full` flex children with their own scroll.
5. Toaster: move away from top-right or silence autosave toasts inside the studio.

---

## 7. Proposed phases

| Phase | Scope                                                                                                                                        |
| ----- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| 0     | This audit + reference review; agree on layout direction                                                                                     |
| 1 ✅  | Studio layout outside shell; route move; remove layout hacks. Same components, just full-screen. _(staged — see 7.2)_                        |
| 2     | Compose the builder (see 7.1): studio context, region components, registries for visuals / integrations / rail panels                        |
| 3     | Convert History / Review / Alerts modals to right-aside panels; Share → popover; Add visual → Insert panel                                   |
| 4     | Floating widget toolbar (move, duplicate, infographic, delete); page tabs relocation; dashboard settings panel (theme that actually applies) |
| 5     | Nice-to-haves: keyboard shortcuts, drag-and-drop reorder, model ERD view, comment pins, lazy-mount dialog queries                            |

### 7.1 Phase 2 — composition plan

Goal: adding a new integration (data connector), visual type or panel is **one registry entry + one component**, never an edit to the 2,857-line orchestrator.

Today the extension points are hard-coded:

- Connectors: `SourceDialog` branches on `kind === 'file_upload' | 'datalab_dataset' | 'public_api'` in its state, `submit()`, `ready` check and JSX (dashboard-studio.tsx ~L2394-2589).
- Visuals: `visualTypes` array (L97-151) + a big `switch`-ish `Chart` in `dashboard-renderer.tsx` + defaults hard-coded in `addWidget` (L376-416) + type-specific inspector branches in `VisualPanel`.
- Panels/dialogs: 9 `useState` open-flags and 9 always-mounted dialogs in `DashboardStudio`.

Target structure:

```
app/components/dashboard-studio/
  studio-context.tsx        StudioProvider + useStudio(): ids, dashboard, definition, change/undo/redo/save,
                            activePage, selection, sources, active rail panel / aside panel
  studio-shell.tsx          Region slots only: TopBar · LeftRail+LeftPanel · Canvas · Inspector · BottomBar
  top-bar.tsx               Title, save state, undo/redo, preview, refresh, comments/history toggles, share, save
  left-rail.tsx             Renders rail items from the panel registry
  bottom-page-bar.tsx       Page tabs (+ add / rename / delete)
  canvas.tsx                DashboardRenderer + empty state
  inspector/                Data · Analysis · Format tabs (split out of VisualPanel)
  panels/                   insert-panel, model-panel, settings-panel (General · Integrations), history, comments, alerts
  registry/
    integrations.tsx        Connector registry
    visuals.tsx             Visual registry
    panels.tsx              Rail / aside panel registry
```

Registry shapes (draft):

```ts
// registry/integrations.tsx — one entry per data connector
type Integration<TValues> = {
  kind: DashboardDataSourceKind; // 'file_upload' | 'datalab_dataset' | 'public_api' | …
  label: string;
  icon: LucideIcon;
  description?: string;
  Form: ComponentType<{
    workspaceId?: string;
    value: TValues;
    onChange: (v: TValues) => void;
  }>;
  isReady: (values: TValues) => boolean;
  toPayload: (
    name: string,
    values: TValues
  ) => FormData | Record<string, unknown>;
};

// registry/visuals.tsx — one entry per visual type
type VisualDefinition = {
  type: DashboardWidgetType;
  label: string;
  description: string;
  icon: LucideIcon;
  group: 'metrics' | 'charts' | 'tables' | 'maps' | 'content' | 'controls';
  create: (ctx: { sourceId?: string }) => Omit<DashboardWidget, 'id'>; // replaces addWidget defaults
  Render?: ComponentType<ChartProps>; // optional; falls back to existing Chart switch during migration
  InspectorExtra?: ComponentType; // type-specific fields (narrative text, image URL, gauge target…)
};

// registry/panels.tsx — left rail + right aside panels
type StudioPanel = {
  id: string;
  label: string;
  icon: LucideIcon;
  slot: 'left' | 'aside';
  Panel: ComponentType; // reads useStudio(); mounted only when open (fixes eager queries)
};
```

Rules:

- Static data (option lists, presets, palettes) lives in `app/lib/constants/dashboard-studio.ts` — already moved there (visual types, operators, date grains, widths/heights, number formats, theme presets, chart palette, infographic sizes). Registries hold behaviour (components, `create()`, `toPayload()`) and import their labels/options from there.
- Components read shared state via `useStudio()`; no prop-drilling of 15 props into panels.
- Panels mount only when open, so their React Query hooks stop firing on studio load.
- Keep existing API hooks (`features/dashboard-studio/*`) unchanged; this phase is UI composition only.
- Migrate incrementally: extract context first (no visual change), then regions, then registries. Studio must work after every step.

Migration order:

1. ✅ `studio-context.tsx` — `StudioProvider` owns dashboard/sources queries, definition, undo/redo, autosave, pages, selection, widget actions, run/hydrate, restore, and the loading / not-found states. `DashboardStudio` = `<StudioProvider><StudioEditor/></StudioProvider>`; `StudioEditor` keeps only UI state (dialogs, panels, preview, inspector width). _(staged)_
2. ✅ Regions extracted, behavior unchanged _(staged)_:
   - `dashboard-studio.tsx` (69 lines) = `StudioProvider` → `StudioUiProvider` → `StudioEditor` grid.
   - `studio-ui-context.tsx`: UI state — one `dialog` id instead of 9 booleans (`openDialog`, `dialogProps(id)`), preview, panel toggles, inspector width, profile/prepare source ids.
   - Regions: `studio-top-bar.tsx`, `studio-page-bar.tsx`, `studio-canvas.tsx`, `studio-data-panel.tsx` (+ Connect dialog), `studio-inspector.tsx` (VisualPanel + calculated fields + filters), `studio-dialogs.tsx` (mounts all dialogs).
   - Dialogs split out: `studio-share-dialog.tsx` (now RHF + zod + `FormPickerField`/`FormPasswordField`/`FormTextField`), `studio-history-dialog.tsx`, `source-profile-dialog.tsx`. `studio-fields.tsx` = `Field`/`Toggle` label wrappers for live (non-form) inspector controls.
3. ✅ Integrations _(staged)_:
   - `registry/integrations.tsx`: one entry per connector — `kind`, `icon`, `defaults(name)`, `Fields` (reads `useFormContext`), `toPayload(values)`. Labels from `dataSourceKindOptions` (constants); schemas `connectSourceSchema` (zod discriminated union on `kind`) in `lib/schema/dashboard-studio-schema.ts`. New connector = schema member + constants label + registry entry.
   - `connect-source-form.tsx`: RHF + zod; connector tiles switch `kind` (name kept); File uses new reusable `FormFileField` (`DropZone` + `useFileUpload`); Datalab uses grouped `FormPickerField` + paste-ID fallback; API enforces HTTPS.
   - `studio-settings-sheet.tsx`: **Settings** right-side sheet (gear in top bar; full-width on mobile, `sm:max-w-2xl`) with **General** (theme, moved out of the page bar) and **Integrations** (`studio-integrations.tsx`: source list with Profile / Prepare / Remove + inline connect form). Profile/Prepare stack over Settings.
   - Left data panel removed (left column freed for the step-4 Insert panel). Canvas shows a "No data connected yet → Connect data" banner that opens Settings → Integrations.
   - Verified in Chrome: validation messages, grouped datasets, HTTPS rule, real Datalab connect (48 rows / 8 fields) → profile → remove. File upload validated but not uploaded end-to-end.
   - Found: base `DialogContent` sets `sm:max-w-lg lg:max-w-xl xl:max-w-2xl`, so existing `max-w-4xl` etc. on studio dialogs never apply (Model/Alerts/Share dialogs render narrower than intended)..
4. ✅ Visuals + Insert _(staged)_:
   - `visualTypes` constants gain `group` (`visualGroups`: Metrics, Comparison, Trend, Composition, Distribution, Tables & maps, Content, Controls). The inspector's Visual type picker is grouped automatically (Picker `group`).
   - `registry/visuals.tsx`: icon per type + `create({ sourceId })` (shared defaults + per-type overrides for KPI, narrative, gauge). `studio-context` `addWidget` now calls `getVisual(type).create()` — same widgets as before.
   - `studio-insert-panel.tsx`: searchable (label, description, group), grouped palette with icons; click inserts on the active page.
   - Placement: left column at `xl` (collapsible from the page bar; collapsed = 48px `+` button). Below `xl` the column is hidden and **Add visual** / **Build this page** open it as a left `Sheet` (full width on mobile). `useStudioUi().openInsert()` picks the right one.
   - Old "Choose a visual" dialog removed.
   - Settings moved to a right `Sheet` (full width on mobile) — see step 3.
5. ✅ Chrome rework _(staged)_:
   - **Top bar** (`studio-top-bar.tsx`, one 48px row at every width): back · title + save state · **Edit | Preview** segmented switch · undo/redo · Refresh, History, Review, Alerts icons (from `md`) · properties toggle (`xl`) · **⋯** menu (everything that doesn't fit: Preview on phones, the four tools below `md`, Data model + Settings below `xl`) · Share · Save (icon-only on phones).
   - **Left rail** (`studio-left-rail.tsx`, `xl`): Insert (toggles the palette), Data model, Settings. Kept as a plain items array rather than a `registry/panels.tsx` — only one left panel exists; promote to a registry when a second one lands.
   - **Bottom bar** (`studio-bottom-bar.tsx`): page tabs (scroll horizontally), active tab `⋯` → Delete page, `+ Page`. Stays visible in Preview (without edit actions) so viewers can switch pages. Old top page bar removed; Delete page moved off the canvas header.
   - **Lazy dialogs**: Share, History, Model, Refresh, Alerts, Comments, Infographic, Profile and Prepare mount only while open — their queries no longer fire on studio load (trade-off: no close animation).
   - **Properties on narrow screens**: below `xl` the inspector column is gone; selecting a visual opens `StudioInspector variant="sheet"` in a bottom sheet (85dvh, no resize handle / width picker). Closing the sheet deselects.
   - Verified in Chrome at 1720px and 390px: single-row top bar, ⋯ menu contents, rail Model/Settings, add + delete page from the bottom bar, Preview hides rail/inspector and page editing.

### 7.3 Selects → `Picker` ✅ _(staged, dl-ui + ui-template)_

`~/components/ui/picker.tsx` + `FormPickerField` are identical to `ui-template` (already ported). Studio still has **24 raw shadcn `Select`s** (22 in the inspector, 1 page-bar theme, 1 Connect-data dataset list) plus 36 sentinel/group usages (`__none`, `__rows`, `__constant`, `SelectGroup`/`SelectLabel`). Picker gaps blocking a straight swap, all additive with defaults = current behavior:

| Enhancement                             | Why (studio use)                                                                                                                                 |
| --------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `clearable?: boolean` (default `true`)  | Required selects (visual type, width, height, number format, decimals, theme, sort direction) must not clear to `null` on re-select or via the ✕ |
| `searchable?: boolean` (default `true`) | Short lists (2–6 options) don't need a search box                                                                                                |
| `size?: 'sm' \| 'default'`              | Dense inspector / toolbar triggers (`h-8`, `text-xs`)                                                                                            |
| `PickerItem.group?: string`             | Grouped lists with headings — Connect data: workspace/personal vs approved public datasets                                                       |
| (later) `PickerItem.icon?: ReactNode`   | Visual-type and connector pickers once registries carry icons                                                                                    |

`FormPickerField` forwards the same props. Sentinel values (`__none`) become `null` via `clearable`.

Done:

- `Picker`: `clearable`, `searchable`, `size`, `PickerItem.group` added; defaults unchanged. Multi-select chips truncate long labels and wrap inside a `max-h-24` scroll box (no horizontal overflow); inline summary clamps to 2 lines.
- `searchable={false}` keeps cmdk's input mounted but `sr-only` — removing it hung the renderer on open.
- All 24 studio `Select`s → `Picker` (inspector 22, theme, Connect-data datasets with grouped headings). `__none` → `null`; `__rows` / `__constant` kept as real options via `ROWS_MEASURE` / `FIXED_NUMBER` in `lib/constants/dashboard-studio.ts`.
- `app/components/ui/picker.test.tsx` (groups, clearable, searchable); `app/test/setup.ts` gains `ResizeObserver` + `scrollIntoView` jsdom shims.
- Same `picker.tsx`, `form-picker-field.tsx`, test and setup shims copied to `ui-template` (its deps aren't installed, so it was verified in dl-ui only).

### 7.2 Phase 1 — what changed (staged)

- `app/routes/app/studio-layout.tsx` (new): `Protect` + `h-dvh` full-screen wrapper, `noindex` meta.
- `app/routes.ts`: both studio routes moved into the studio layout; URLs unchanged.
- `dashboard-studio.tsx`: removed negative margins, sticky header, `calc(100vh-…)` heights; flex column fills viewport; panels scroll independently at `xl`; added "Dashboard not found" state (previously spun forever; workspace layout no longer guards this route).
- `mutations.ts`: `useSaveDashboardDefinition` accepts `silent`; autosave no longer toasts every 12s.
- Known, unrelated: Preview triggers `POST …/render/` which currently returns **404** from the API ("Dashboard query failed" toast).

---

## 8. Decisions (2026-09-11)

| Question                     | Decision                                                                                                                       |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| Page tabs                    | **Bottom bar** (Rows / Clay style)                                                                                             |
| Data sources                 | Live in a dedicated **Settings** surface under an **Integrations** tab (not an always-visible left panel)                      |
| Personal vs workspace studio | **Same layout.** Workspace studios carry the workspace ID forward (stays in the URL, back-navigation returns to the workspace) |
| Grid                         | Keep the **12-column grid** for now; free positioning later if needed                                                          |
| Refresh                      | **Top bar** for a start                                                                                                        |
| Dark mode                    | Use the **app default** theme; no studio-specific toggle for now                                                               |
| Workflow                     | Changes are **staged only, no commits** until agreed otherwise                                                                 |

Revisit as we go.
