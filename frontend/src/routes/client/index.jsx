import Home from "../../pages/client/Home";
import Auth from "../../pages/Auth";
import AllCourses from "../../pages/client/AllCourses";
import About from "../../pages/client/About/index.jsx";
import Contact from "../../pages/client/Contact/index.jsx";
import Privacy from "../../pages/client/Privacy/index.jsx";
import Terms from "../../pages/client/Terms/index.jsx";
import Courses from "../../pages/client/Courses";
import EnrollmentNew from "../../pages/client/Enrollments/EnrollmentNew";
import MyAccount from "../../pages/client/MyAccount";
import Statistic from "../../pages/client/Statistic";
import Default from "../../layouts/client/Default.jsx";
import UserOnboarding from "../../pages/client/UserOnboarding";
import Dashboard from "../../pages/client/Dashboard";

import Category from "../../pages/client/Category/index.jsx";
import Faq from "../../pages/client/Faq/index.jsx";
import Error404 from "../../pages/client/Error404/index.jsx";
import CoursesDefault from "../../layouts/client/CoursesDefault.jsx";
import CourseDetail from "../../pages/client/Courses/CourseDetail.jsx";
import LessonManagement from "../../pages/client/Courses/LessonManagement";
import AddDocs from "../../pages/client/Courses/addDocs.jsx";
import ShowDocs from "../../pages/client/Courses/ShowDocs.jsx";
import Exam from "../../pages/client/Courses/Exam.jsx";
import ShowExam from "../../pages/client/Courses/ShowExam.jsx";
import EditExam from "../../pages/client/Courses/EditExam.jsx";
import CreateExam from "../../pages/client/Courses/CreateExam.jsx";
import ExamHistory from "../../pages/client/Courses/ExamHistory.jsx";
import ExamAttemptDetail from "../../pages/client/Courses/ExamAttemptDetail.jsx";
import DocumentList from "../../pages/client/Courses/DocumentList.jsx";
import UploadDocument from "../../pages/client/Courses/UploadDocument.jsx";

export const routes = [
  {
    path: "/login",
    element: <Auth />,
  },
  {
    path: "/",
    element: <Default />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "dashboard",
        element: <Dashboard />,
      },
      {
        path: "onboarding",
        element: <UserOnboarding />,
      },
      {
        path: "statistics",
        element: <Statistic />,
      },
      {
        path: "all-courses",
        element: <AllCourses />,
      },
      {
        path: "courses",
        element: <Courses />,
      },
      {
        path: "courses/:courseId",
        element: <CoursesDefault />,
        children: [
          {
            index: true,
            element: <CourseDetail />,
          },
          {
            path: "lessons",
            element: <LessonManagement />,
          },
          {
            path: "AddDocs",
            element: <AddDocs />,
          },
          {
            path: "documents",
            element: <DocumentList />,
          },
          {
            path: "upload-document",
            element: <UploadDocument />,
          },              {
                path: "exams",
                children: [
                  {
                    index: true,
                    element: <Exam />,
                  },
                  {
                    path: "create",
                    element: <CreateExam />,
                  },
                  {
                    path: "edit/:examId",
                    element: <EditExam />,
                  },
                  {
                    path: ":examId",
                    element: <ShowExam />,
                  },
                  {
                    path: ":examId/history",
                    element: <ExamHistory />,
                  },
                  {
                    path: ":examId/attempts/:attemptId",
                    element: <ExamAttemptDetail />,
                  },
                ],
              },
          {
            path: ":docsId",
            element: <ShowDocs />,
          },
        ],
      },
      {
        path: "my-account",
        element: <MyAccount />,
      },
      {
        path: "enrollments",
        element: <EnrollmentNew />,
      },
      {
        path: "about",
        element: <About />,
      },
      {
        path: "category",
        element: <Category />,
      },
      {
        path: "faq",
        element: <Faq />,
      },
      {
        path: "contact",
        element: <Contact />,
      },
      {
        path: "privacy",
        element: <Privacy />,
      },
      {
        path: "terms",
        element: <Terms />,
      },
    ],
  },
  {
    path: "*",
    element: <Error404 />,
  },
];
