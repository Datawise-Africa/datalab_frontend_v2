import AfyakenDashboard from '@/components/Dashboards/AfyakenDashboard';
import { appProtectedRoutes } from './protected-routes';
import React from 'react';
import EdukenDashboard from '@/components/Dashboards/EdukenDashboard';
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
  {
    path: '/dashboards/eduken',
    element: <EdukenDashboard/>,
  },
  {
    path: '/dashboards/afyaken',
    element: <AfyakenDashboard />,
  },

  appProtectedRoutes,
];

export default baseRoutes;
