# Datalab Frontend Sitemap

The sitemap below shows the hierarchy of navigable routes along with notes about authentication requirements.

```
/                        (Dataset catalog, public)
├── /datasets/:id        (Dynamic dataset detail, public, indexed)
├── /data-dashboards     (Interactive dashboards, public)
├── /reports             (Insight reports, public)
└── /404                 (Not found page, public, noindex)

/app                    (Secure workspace shell, requires authentication)
├── /app/become-dataset-creator      (Application form, any signed-in user)
├── /app/saved-datasets              (Saved datasets, requires user role)
├── /app/my-downloads                (Download history, requires user role)
├── /app/account-settings            (Profile and billing, requires user role)
├── /app/dataset-creator-dashboard   (Creator home, requires dataset_creator)
├── /app/dataset-creator-analytics   (Creator analytics, requires dataset_creator)
├── /app/dataset-creator-reports     (Creator reports, requires dataset_creator)
├── /app/applications                (Application review, requires admin)
└── /app/approved-creators           (Approved creators list, requires admin)
```

Data-heavy routes such as `/datasets/:id` are populated through the public API at runtime. To extend the sitemap:

1. Update `src/lib/sitemap.ts` with the new route metadata.
2. Regenerate or edit `public/sitemap.xml` for crawlers.
3. Optionally expose `docs/sitemap.md` in internal documentation portals.
