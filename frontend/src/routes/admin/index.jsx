import DefaultAdmin from "../../layouts/admin/DefaultAdmin";
import Accounts from "../../pages/admin/Accounts";
import Courses from "../../pages/admin/Courses";
import CreateCourse from "../../pages/admin/Courses/CreateCourse";
import Restore from "../../pages/admin/Courses/Restore";
import Dashboard from "../../pages/admin/Dashboard";
import Register from "../../pages/admin/Register";
import MultiRegister from "../../pages/admin/Register/MultiRegister";
import SingleRegister from "../../pages/admin/Register/SingleRegister";
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
            },
            {
                path: "courses/restore",
                element: <Restore/>
            },
            {
                path: "registers",
                element: <Register/>,
                children: [
                    {
                        index: true,
                        element: <SingleRegister/>
                    },
                    {
                        path: "multi",
                        element: <MultiRegister/>
                    }
                ]
            }
        ]
    }
]