import DataCatalog from "../pages/data/DatasetCatalog";
import DataDashboards from "../pages/data_dashboards/DataDashboards";
import Reports from "../pages/reports/Reports";
import BecomeDatasetCreatorPage from "../pages/data/BecomeDatasetCreatorPage";
import DatasetCreatorsDashboard from "../pages/data/DatasetCreatorsDashboard";

const baseRoutes = [
    {
        path: "/",
        element: <DataCatalog />,
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
    },
    {
        path: "/dataset-creator-dashboard",
        element: <DatasetCreatorsDashboard />
    }
]

export default baseRoutes;