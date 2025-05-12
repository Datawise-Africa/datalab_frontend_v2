import DataCatalog from "../pages/data/DatasetCatalog";
import DataDashboards from "../pages/data_dashboards/DataDashboards";
import Reports from "../pages/reports/Reports";
import BecomeDatasetCreatorPage from "../pages/data/BecomeDatasetCreatorPage";
import DatasetPage from "../pages/data/DatasetPage";
import SSPage from "../pages/data/SSPage";

const baseRoutes = [
    {
        path: "/",
        element: <DatasetPage />,
    },
    {
      path:'/ss',
      element: <SSPage />
    },
    {
        path: "/data-dashboards",
        element: <DataDashboards />
    },
    {
        path: "/reports",
        element: <Reports />
    },
    {
        path: "/become-dataset-creator",
        element: <BecomeDatasetCreatorPage />
    }
]

export default baseRoutes;
