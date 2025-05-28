import Protect from '@/components/Protect';
import ProtectedLayout from '@/layout/ProtectedLayout';
import { lazy } from 'react';
import type { RouteObject } from 'react-router-dom';

const BecomeDatasetCreatorPage = lazy(
  () => import('@/pages/BecomeDatasetCreatorPage'),
);
const DatasetCreatorsDashboard = lazy(
  () => import('@/pages/DatasetCreatorsDashboard'),
);

const ApplicationsPage = lazy(
  () => import('@/components/creatorapplications/ApplicationsPage'),
);

export const protecteRoutes: RouteObject = {
  path: '/app',
  element: <ProtectedLayout />,
  children: [
    {
      path: '/app/become-dataset-creator',
      element: <BecomeDatasetCreatorPage />,
    },
    {
      path: '/app/dataset-creator-dashboard',
      element: (
        <Protect role="dataset_creator" Component={DatasetCreatorsDashboard} />
      ),
    },
    {
      path: '/app/applications',
      element: <Protect role="admin" Component={ApplicationsPage} />,
    },
  ],
};
