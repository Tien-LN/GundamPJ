import { Outlet, NavLink } from "react-router-dom";

function CoursesDefault(){
    return (
        <>
            <ul className="section__header">
                <li>
                    <NavLink to="/courses">Chi tiết Khóa học</NavLink>
                </li>
                <li>
                    <NavLink to="/courses">Tài liệu</NavLink>
                </li>
                <li>
                    <NavLink>Bài tập về nhà</NavLink>
                </li>
                <li>
                    <NavLink>Ôn luyện đề thi</NavLink>
                </li>
            </ul>
            <Outlet/>
        </>
    )
};
export default CoursesDefault;