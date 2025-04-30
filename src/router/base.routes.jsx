import DataCatalog from "../pages/data/DatasetCatalog";
import DataDashboards from "../pages/data_dashboards/DataDashboards";
import Reports from "../pages/reports/Reports";

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
    }
]

export default baseRoutes;