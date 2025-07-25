import Protect from '@/components/Protect';
import ProtectedLayout from '@/layout/ProtectedLayout';
import { lazy } from 'react';
import type { RouteObject } from 'react-router-dom';

const ApprovedApplicantsTable = lazy(
  () => import('@/components/creatorapplications/ApprovedApplicants'),
);

const BecomeDatasetCreatorPage = lazy(
  () => import('@/pages/BecomeDatasetCreatorPage'),
);
const DatasetCreatorsDashboard = lazy(
  () => import('@/pages/DatasetCreatorsDashboard'),
);
const SavedDatasetsPage = lazy(() => import('@/pages/SavedPages'));

const ApplicationsPage = lazy(
  () => import('@/components/creatorapplications/ApplicationsPage'),
);

const AcccountSettings = lazy(() => import('@/pages/account-settings'));
const DatasetCreatorReportsPage = lazy(
  () => import('@/pages/DatasetCreatorReportsPage'),
);
const DatasetCreatorAnalyticsPage = lazy(
  () => import('@/pages/DatasetCreatorAnalyticsPage'),
);

const MyDownloadsPage = lazy(() => import('@/pages/downloaded-datasets-page'));
export const appProtectedRoutes: RouteObject = {
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
    {
      path: '/app/saved-datasets',
      element: <Protect role="user" Component={SavedDatasetsPage} />,
    },
    {
      path: '/app/my-downloads',
      element: <Protect role="user" Component={MyDownloadsPage} />,
    },
    {
      path: '/app/approved-creators',
      element: <Protect role="admin" Component={ApprovedApplicantsTable} />,
    },
    {
      path: '/app/account-settings',
      element: <Protect role="user" Component={AcccountSettings} />,
    },
    {
      path: '/app/dataset-creator-reports',
      element: (
        <Protect role="dataset_creator" Component={DatasetCreatorReportsPage} />
      ),
    },
    {
      path: '/app/dataset-creator-analytics',
      element: (
        <Protect
          role="dataset_creator"
          Component={DatasetCreatorAnalyticsPage}
        />
      ),
    },
  ],
};
