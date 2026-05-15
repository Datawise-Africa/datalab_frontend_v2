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
    route('datasets', 'routes/datasets.tsx'),
    route('datasets/:slug', 'routes/dataset-detail.tsx'),
    route('creators', 'routes/creators.tsx'),
    route('dashboards', 'routes/dashboards.tsx'),
    route('dashboards/:id', 'routes/dashboard-detail.tsx'),
    route('research', 'routes/research.tsx'),
    route('research/reports', 'routes/research-reports.tsx'),
    route('research/reports/:slug', 'routes/research-report-detail.tsx'),
    route('contact', 'routes/contact.tsx'),
    route('privacy-policy', 'routes/privacy-policy.tsx'),
    route('terms-of-service', 'routes/terms-of-service.tsx'),
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
    route('app/view-dataset/:id', 'routes/app/view-dataset.tsx'),
    route('app/analytics', 'routes/app/analytics.tsx'),
    route('app/creator-reports', 'routes/app/creator-reports.tsx'),
    route('app/admin', 'routes/app/admin-overview.tsx'),
    route('app/applications', 'routes/app/applications.tsx'),
    route('app/approved-creators', 'routes/app/approved-creators.tsx'),
    route('app/dashboard-categories', 'routes/app/dashboard-categories.tsx'),
    route('app/invitations', 'routes/app/invitations.tsx'),
    route('app/my-dashboards', 'routes/app/my-dashboards.tsx'),
    route('app/my-dashboards/new', 'routes/app/my-dashboard-create.tsx'),
    route('app/my-dashboards/:id', 'routes/app/my-dashboard-detail.tsx'),
    route('app/my-dashboards/:id/edit', 'routes/app/my-dashboard-edit.tsx'),
    route('app/workspaces', 'routes/app/workspaces.tsx'),
    route('app/workspaces/new', 'routes/app/workspace-create.tsx'),
    route('app/workspaces/:id', 'routes/app/workspace/layout.tsx', [
      index('routes/app/workspace/overview.tsx'),
      route('members', 'routes/app/workspace/members.tsx'),
      route('datasets', 'routes/app/workspace/datasets.tsx'),
      route('datasets/new', 'routes/app/workspace/upload-dataset.tsx'),
      route('datasets/:datasetId', 'routes/app/workspace/view-dataset.tsx'),
      route(
        'datasets/:datasetId/edit',
        'routes/app/workspace/edit-dataset.tsx'
      ),
      route('dashboards', 'routes/app/workspace/dashboards.tsx'),
      route('dashboards/new', 'routes/app/workspace/create-dashboard.tsx'),
      route(
        'dashboards/:dashboardId',
        'routes/app/workspace/dashboard-detail.tsx'
      ),
      route(
        'dashboards/:dashboardId/edit',
        'routes/app/workspace/edit-dashboard.tsx'
      ),
      route('analytics', 'routes/app/workspace/analytics.tsx'),
      route('invitations', 'routes/app/workspace/invitations.tsx'),
      route('settings', 'routes/app/workspace/settings.tsx'),
    ]),
  ]),

  // Utility routes
  route('sitemap.xml', 'routes/sitemap.xml.ts'),
  route('robots.txt', 'routes/robots.txt.ts'),
  route(
    '.well-known/appspecific/com.chrome.devtools.json',
    'routes/[.]well-known.appspecific.[com.chrome.devtools.json].ts'
  ),
] satisfies RouteConfig;
