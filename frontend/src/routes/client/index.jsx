import Home from "../../pages/client/Home";
import Auth from "../../pages/Auth";
import AllCourses from "../../pages/client/AllCourses";
import About from "../../pages/client/About/index.jsx";
import Courses from "../../pages/client/Courses";
import Enrollments from "../../pages/client/Enrollments";
import MyAccount from "../../pages/client/MyAccount";
import Statistic from "../../pages/client/Statistic";
import Default from "../../layouts/client/Default.jsx";
import Subject from "../../pages/client/Courses/Subject.jsx";
import Category from "../../pages/client/Category/index.jsx";
import Faq from "../../pages/client/Faq/index.jsx";
import Error404 from "../../pages/client/Error404/index.jsx";
export const routes = [
    {
        path: "/auth/login",
        element: <Auth/>
    },
    {
        path: "/",
        element: <Default/>,
        children: [
            {
                path: "/",
                element: <Home/>
            },
            {
                path: "/statistics",
                element: <Statistic/>
            },
            {
                path: "/all-courses",
                element: <AllCourses/>
            },
            {
                path: "/courses",
                element: <Courses/>
            },
            {
                path: "/courses/:subject",
                element: <Subject/>
            },
            {
                path: "/my-account",
                element: <MyAccount/>
            },
            {
                path: "/enrollments",
                element: <Enrollments/>
            },
            {
                path: "/about",
                element: <About/>
            },
            {
                path: "/category",
                element: <Category/>
            },
            {
                path: "/faq",
                element: <Faq/>
            }
        ]
    },
    {
        path: "*",
        element: <Error404/>
    }
]