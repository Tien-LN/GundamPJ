import DefaultAdmin from "../../layouts/admin/DefaultAdmin";
import Accounts from "../../pages/admin/Accounts";
import Dashboard from "../../pages/admin/Dashboard";
export const routesAdmin = [
    {
        path: "/admin",
        element: <DefaultAdmin/>,
        children: [
            {
                index: true,
                element: <Dashboard/>
            },
            {
                path: "accounts",
                element: <Accounts/>
            }
        ]
    }
]