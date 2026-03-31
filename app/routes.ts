import {
  type RouteConfig,
  index,
  layout,
  route,
} from '@react-router/dev/routes';

export default [
  // Public routes (with header + footer)
  layout('routes/public-layout.tsx', [
    index('routes/home/index.tsx'),
    route('about', 'routes/about.tsx'),
    route('team', 'routes/team.tsx'),
    route('datasets', 'routes/datasets.tsx'),
    route('datasets/:slug', 'routes/dataset-detail.tsx'),
    route('docs', 'routes/docs.tsx'),
    route('creators', 'routes/creators.tsx'),
    route('dashboards', 'routes/dashboards.tsx'),
    route('dashboards/afyaken', 'routes/dashboards/afyaken.tsx'),
    route('dashboards/eduken', 'routes/dashboards/eduken.tsx'),
    route('success-stories', 'routes/success-stories.tsx'),
    route('success-stories/:slug', 'routes/success-story-detail.tsx'),
    route('research', 'routes/research.tsx'),
    route('research/reports', 'routes/research-reports.tsx'),
    route('research/reports/:slug', 'routes/research-report-detail.tsx'),
    route('contact', 'routes/contact.tsx'),
    route('privacy-policy', 'routes/privacy-policy.tsx'),
    route('terms-of-service', 'routes/terms-of-service.tsx'),
    route('workspace', 'routes/workspace.tsx'),
  ]),

  // Dashboard routes (isolated layout, no header/footer)
  layout('routes/app/dashboard-layout.tsx', [
    route('app', 'routes/app/overview.tsx'),
    route('app/bookmarks', 'routes/app/bookmarks.tsx'),
    route('app/saved-datasets', 'routes/app/saved-datasets.tsx'),
    route('app/my-downloads', 'routes/app/my-downloads.tsx'),
    route('app/account-settings', 'routes/app/account-settings.tsx'),
    route(
      'app/become-dataset-creator',
      'routes/app/become-dataset-creator.tsx'
    ),
    route('app/creator-dashboard', 'routes/app/creator-dashboard.tsx'),
    route('app/upload-dataset', 'routes/app/upload-dataset.tsx'),
    route('app/edit-dataset/:id', 'routes/app/edit-dataset.tsx'),
    route('app/analytics', 'routes/app/analytics.tsx'),
    route('app/creator-reports', 'routes/app/creator-reports.tsx'),
    route('app/admin', 'routes/app/admin-overview.tsx'),
    route('app/applications', 'routes/app/applications.tsx'),
    route('app/approved-creators', 'routes/app/approved-creators.tsx'),
    route('app/workspaces', 'routes/app/workspaces.tsx'),
    route('app/workspaces/new', 'routes/app/workspace-create.tsx'),
    route('app/workspaces/:id', 'routes/app/workspace-detail.tsx'),
  ]),

  // Utility routes
  route('sitemap.xml', 'routes/sitemap.xml.ts'),
  route(
    '.well-known/appspecific/com.chrome.devtools.json',
    'routes/[.]well-known.appspecific.[com.chrome.devtools.json].ts'
  ),
] satisfies RouteConfig;
