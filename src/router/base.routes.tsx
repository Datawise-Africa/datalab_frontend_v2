// import DataCatalog from "../pages/data/DatasetCatalog";
// import DataDashboards from '@/pages/data_dashboards/DataDashboards';
// import Reports from '@/pages/reports/Reports';
// import BecomeDatasetCreatorPage from '@/pages/data/BecomeDatasetCreatorPage';
// import DatasetPage from '@/pages/data/DatasetPage';
import { lazy } from 'react';

const ReportsPage = lazy(() => import('@/pages/reports/Reports'));
const DatasetPage = lazy(() => import('@/pages/data/DatasetPage'));
const BecomeDatasetCreatorPage = lazy(() =>
  import('@/pages/data/BecomeDatasetCreatorPage'),
);
const DataDashboards = lazy(() => import('@/pages/data_dashboards/DataDashboards'));
// const DatasetCatalog = lazy(() => import('@/pages/data/DatasetCatalog'));


const baseRoutes = [
  {
    path: '/',
    element: <DatasetPage />,
  },
  {
    path: '/data-dashboards',
    element: <DataDashboards />,
  },
  {
    path: '/reports',
    element: <ReportsPage />,
  },
  {
    path: '/become-dataset-creator',
    element: <BecomeDatasetCreatorPage />,
  },
];

export default baseRoutes;
