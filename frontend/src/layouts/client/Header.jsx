import { NavLink } from 'react-router-dom';
import './header.css'
function Header() {
    return (
        <>
            <div className="container">
                <img className="logo" src="../public/img/logo.png" />
                <nav className="nav-bar">
                    <div className='nav-link'>
                        <NavLink to="/home" className="nav-link-c">Trang chủ</NavLink>
                        <NavLink to="/courses" className="nav-link-c">Khoá học của tôi</NavLink>
                        <NavLink to="/statistics" className="nav-link-c">Thống kê</NavLink>
                    </div>
                    <img className="logo-account" src="../public/img/Account.png" />
                </nav>
            </div>
        </>
    )
};
export default Header;