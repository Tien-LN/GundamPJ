import { NavLink } from "react-router-dom";

function Sider(){
    const NavLinkActive = (e) => {
        console.log(e);
        return "admin__siders-item";
    }
    return (
        <>
            <ul className="admin__siders" id="siders">
                <li className="admin__siders-item">
                    <NavLink to="/admin">Dashboard</NavLink>
                </li>
                <li className="admin__siders-item">
                    <NavLink to="/admin/accounts">Danh sách tài khoản</NavLink>
                </li>
                <li className="admin__siders-item">
                    <NavLink to="/admin/courses">Danh sách khóa học</NavLink>
                </li>
                <li className="admin__siders-item">
                    <NavLink to="/admin/announcements">Quản lý thông báo</NavLink>
                </li>
                <li className="admin__siders-item">
                    <NavLink to="/admin/statistics">Thống kê</NavLink>
                </li>
                <li className="admin__siders-item">
                    <NavLink to="/admin/registers">Đăng ký tài khoản</NavLink>
                </li>
            </ul>
        </>
    )
};
export default Sider;