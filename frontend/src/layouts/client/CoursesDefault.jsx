import { Outlet, NavLink, useParams } from "react-router-dom";
import "./CoursesDefault.scss";
function CoursesDefault(){
    const {courseId} = useParams();
    const handleActiveLink = (e) => {
        return (e.isActive ? "lessons__header-active" : "");
    }
    return (
        <>
            <ul className="lessons__header">
                <li>
                    <NavLink to={`/courses/${courseId}`} className={handleActiveLink} end>Chi tiết Khóa học</NavLink>
                </li>
                <li>
                    <NavLink to={`/courses/${courseId}/excercise`} className={handleActiveLink}>Bài tập về nhà</NavLink>
                </li>
                <li>
                    <NavLink to={`/courses/${courseId}/exams`} className={handleActiveLink}>Ôn luyện đề thi</NavLink>
                </li>
            </ul>
            <Outlet/>
        </>
    )
};
export default CoursesDefault;