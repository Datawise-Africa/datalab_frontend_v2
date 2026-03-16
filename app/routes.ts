import {
  type RouteConfig,
  index,
  layout,
  route,
} from '@react-router/dev/routes';

export default [
  // Public routes
  index('routes/home/index.tsx'),
  route('about', 'routes/about.tsx'),
  route('team', 'routes/team.tsx'),
  route('datasets', 'routes/datasets.tsx'),
  route('datasets/:slug', 'routes/dataset-detail.tsx'),
  route('docs', 'routes/docs.tsx'),
  route('creators', 'routes/creators.tsx'),
  route('dashboards', 'routes/dashboards.tsx'),
  route('success-stories', 'routes/success-stories.tsx'),
  route('success-stories/:slug', 'routes/success-story-detail.tsx'),
  route('research', 'routes/research.tsx'),
  route('research/reports', 'routes/research-reports.tsx'),
  route('research/reports/:slug', 'routes/research-report-detail.tsx'),
  route('contact', 'routes/contact.tsx'),
  route('privacy-policy', 'routes/privacy-policy.tsx'),
  route('terms-of-service', 'routes/terms-of-service.tsx'),
  route('workspace', 'routes/workspace.tsx'),

  // Protected routes (require authentication)
  layout('routes/app/layout.tsx', [
    route('app/saved-datasets', 'routes/app/saved-datasets.tsx'),
    route('app/my-downloads', 'routes/app/my-downloads.tsx'),
    route('app/account-settings', 'routes/app/account-settings.tsx'),
    route(
      'app/become-dataset-creator',
      'routes/app/become-dataset-creator.tsx'
    ),
    route('app/creator-dashboard', 'routes/app/creator-dashboard.tsx'),
    route('app/upload-dataset', 'routes/app/upload-dataset.tsx'),
    route('app/creator-analytics', 'routes/app/creator-analytics.tsx'),
    route('app/creator-reports', 'routes/app/creator-reports.tsx'),
    route('app/applications', 'routes/app/applications.tsx'),
    route('app/approved-creators', 'routes/app/approved-creators.tsx'),
  ]),

  // Utility routes
  route('sitemap.xml', 'routes/sitemap.xml.ts'),
  route(
    '.well-known/appspecific/com.chrome.devtools.json',
    'routes/[.]well-known.appspecific.[com.chrome.devtools.json].ts'
  ),
] satisfies RouteConfig;
