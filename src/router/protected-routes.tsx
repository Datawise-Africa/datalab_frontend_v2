import ProtectedLayout from '@/layout/ProtectedLayout';
import BecomeDatasetCreatorPage from '@/pages/data/BecomeDatasetCreatorPage';
import type { RouteObject } from 'react-router-dom';

export const protecteRoutes: RouteObject = {
  path: '/',
  element: <ProtectedLayout />,
  children: [
    {
      path: '/become-dataset-creator',
      element: <BecomeDatasetCreatorPage />,
    },
  ],
};
