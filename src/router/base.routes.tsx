import { protecteRoutes } from './protected-routes';
import React from 'react';
const DataCatalog = React.lazy(() => import('@/pages/Homepage'));
const Reports = React.lazy(() => import('@/pages/reports/Reports'));
const DataDashboards = React.lazy(() => import('@/pages/DataDashboards'));

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
];

export default baseRoutes;
