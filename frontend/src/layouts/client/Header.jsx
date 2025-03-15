import { NavLink } from 'react-router-dom';
import './header.css'

function Header() {
    return (
        <>
            <div className="header-container">
                <img className="logo" src="../public/img/logo.png" />
                <nav className="nav-bar">
                    <div className='nav-link'>
                        <NavLink to="/" className="nav-link-c">Trang chủ</NavLink>
                        <NavLink to="/courses" className="nav-link-c">Khoá học của tôi</NavLink>
                        <NavLink to="/statistics" className="nav-link-c">Thống kê</NavLink>
                    </div>
                    <NavLink to="/my-account"><img className="avatar-account" src="../public/img/Account.png" /></NavLink>
                </nav>
            </div>
        </>
    )
};
export default Header;