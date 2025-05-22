// import DataCatalog from '@/pages/data/DatasetCatalog';
// import DataDashboards from '@/pages/data_dashboards/DataDashboards';
// import Reports from '@/pages/reports/Reports';
// import BecomeDatasetCreatorPage from '@/pages/data/BecomeDatasetCreatorPage';
// import DatasetCreatorsDashboard from '@/pages/data/DatasetCreatorsDashboard';
import { protecteRoutes } from './protected-routes';
import React from 'react';
const DataCatalog = React.lazy(() => import('@/pages/data/DatasetCatalog'));
const Reports = React.lazy(() => import('@/pages/reports/Reports'));
const DataDashboards = React.lazy(
  () => import('@/pages/data_dashboards/DataDashboards'),
);
const DatasetCreatorsDashboard = React.lazy(
  () => import('@/pages/data/DatasetCreatorsDashboard'),
);
const baseRoutes = [
  {
    path: '/',
    element: <DataCatalog />,
  },
  {
    path: '/data-dashboards',
    element: <DataDashboards />,
  },
  {
    path: '/reports',
    element: <Reports />,
  },
  protecteRoutes,
  {
    path: '/dataset-creator-dashboard',
    element: <DatasetCreatorsDashboard />,
  },
];

export default baseRoutes;
