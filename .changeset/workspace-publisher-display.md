---
'datalab-frontend': major
---

**Show workspace as publisher when a dataset is published from a workspace.**

When a dataset's `workspace` field is populated by the backend, the workspace name now replaces the individual author across the catalog and dataset detail page — same styling as the author row, only the icon differs (`Building2` vs `User`).

- **Dataset cards** (`/datasets`, featured datasets on landing, saved datasets) — workspace name shown in place of the author when present.
- **Dataset detail page** — header metadata row swaps the User icon + author for a Building2 icon + workspace name; the Authors section is hidden for workspace-published datasets.
- User-authored datasets (no workspace) are unchanged.
- No additional network calls — workspace data is read from the existing dataset payload (`dataset.workspace = { id, name, slug }`).
