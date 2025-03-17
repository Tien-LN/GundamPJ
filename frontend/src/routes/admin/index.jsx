import Dashboard from "../../pages/admin/Dashboard";
export const routesAdmin = [
    {
        path: "/admin",
        children: [
            {
                index: true,
                element: <Dashboard/>

            }
        ]
    }
]