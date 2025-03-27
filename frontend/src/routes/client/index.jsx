import Home from "../../pages/client/Home";
import Auth from "../../pages/Auth";
import AllCourses from "../../pages/client/AllCourses";
import About from "../../pages/client/About/index.jsx";
import Courses from "../../pages/client/Courses";
import Enrollments from "../../pages/client/Enrollments";
import MyAccount from "../../pages/client/MyAccount";
import Statistic from "../../pages/client/Statistic";
import Default from "../../layouts/client/Default.jsx";

import Category from "../../pages/client/Category/index.jsx";
import Faq from "../../pages/client/Faq/index.jsx";
import Error404 from "../../pages/client/Error404/index.jsx";
import CoursesDefault from "../../layouts/client/CoursesDefault.jsx";
import Section from "../../pages/client/Courses/Section.jsx";
import AddDocs from "../../pages/client/Courses/addDocs.jsx";
import ShowDocs from "../../pages/client/Courses/ShowDocs.jsx";
import UpdateInfo from "../../pages/client/UpdateInfo/index.jsx";
import Exam from "../../pages/client/Courses/Exam.jsx";
import ShowExam from "../../pages/client/Courses/ShowExam.jsx";
import EditExam from "../../pages/client/Courses/EditExam.jsx";
export const routes = [
    {
        path: "/login",
        element: <Auth />
    },
    {
        path: "/",
        element: <Default />,
        children: [
            {
                index: true,
                element: <Home />
            },
            {
                path: "update-info",
                element: <UpdateInfo />
            },
            {
                path: "statistics",
                element: <Statistic />
            },
            {
                path: "all-courses",
                element: <AllCourses />
            },
            {
                path: "courses",
                element: <Courses />
            },
            {
                path: "courses/:courseId",
                element: <CoursesDefault />,
                children: [
                    {
                        index: true,
                        element: <Section />
                    },
                    {
                        path: "AddDocs",
                        element: <AddDocs/>
                    },
                    {
                        path: "exams",
                        children: [
                            {
                                index: true,
                                element: <Exam/>
                            },
                            {
                                path: "edit/:examId",
                                element: <EditExam/>
                            },
                            {
                                path: ":examId",
                                element: <ShowExam/>
                            }
                        ]
                    },
                    {
                        path: "exams",
                        children: [
                            {
                                index: true,
                                element: <Exam/>
                            },
                            {
                                path: "edit/:examId",
                                element: <EditExam/>
                            },
                            {
                                path: ":examId",
                                element: <ShowExam/>
                            }
                        ]
                    },
                    {
                        path: ":docsId",
                        element: <ShowDocs />
                    }
                ]
            },
            {
                path: "my-account",
                element: <MyAccount />
            },
            {
                path: "enrollments",
                element: <Enrollments />
            },
            {
                path: "about",
                element: <About />
            },
            {
                path: "category",
                element: <Category />
            },
            {
                path: "faq",
                element: <Faq />
            }
        ]
    },
    {
        path: "*",
        element: <Error404 />
    }
]