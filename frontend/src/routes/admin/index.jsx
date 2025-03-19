import DefaultAdmin from "../../layouts/admin/DefaultAdmin";
import Accounts from "../../pages/admin/Accounts";
import Courses from "../../pages/admin/Courses";
import CreateCourse from "../../pages/admin/Courses/CreateCourse";
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
            },
            {
                path: "courses",
                element: <Courses/>
            },
            {
                path: "courses/create",
                element: <CreateCourse/>
            }
        ]
    }
]