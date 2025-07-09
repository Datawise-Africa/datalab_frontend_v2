import { appProtectedRoutes } from './protected-routes';
import React from 'react';
const DataCatalog = React.lazy(() => import('@/pages/Homepage'));
const Reports = React.lazy(() => import('@/pages/reports/Reports'));
const DataDashboards = React.lazy(() => import('@/pages/DataDashboards'));
const SingleDatasetPage = React.lazy(
  () => import('@/pages/single-dataset-page'),
);

const baseRoutes = [
  {
    path: '/',
    element: <DataCatalog />,
  },
  {
    path: '/datasets/:id',
    element: <SingleDatasetPage />,
  },
  {
    path: '/data-dashboards',
    element: <DataDashboards />,
  },
  {
    path: '/reports',
    element: <Reports />,
  },

  appProtectedRoutes,
];

export default baseRoutes;
