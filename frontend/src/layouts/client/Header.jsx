import { Link, NavLink } from 'react-router-dom';
import './header.css'
import { useEffect, useState } from 'react';
import axios from 'axios';
import { getHeader } from '../../helpers/client/getHeader';
import { logout } from '../../helpers/client/logout';

function Header() {

    const user = getHeader();
    const [dropDown, setDropDown] = useState(false);
    const handleDropDown = () => {
        setDropDown(!dropDown);
    }
    const closeDropdown = (e) => {
        if (!e.target.closest(".dropdown-container")) {
            setDropDown(false);
        }
    };
    const handleLogout = async () => {
        logout();
    }
    useState(() => {
        document.addEventListener("click", closeDropdown);
        return () => document.removeEventListener("click", closeDropdown);
    }, []);

    return (
        <>
            <div className='om'>
                <div className="header-container">
                    <img className="logo" src="/img/logo.png" />
                    {user ? (
                        <nav className="nav-bar">
                            <div className='nav-link'>
                                <NavLink to="/" className="nav-link-c">Trang chủ</NavLink>
                                <NavLink to="/courses" className="nav-link-c">Khoá học của tôi</NavLink>
                                <NavLink to="/statistics" className="nav-link-c">Thống kê</NavLink>
                            </div>

                            <div className='dropdown-container'>
                                <img
                                    className="avatar-account"
                                    src={user?.avatarUrl || "/img/Account.png"}
                                    alt="User Avatar"
                                    onClick={handleDropDown}
                                />
                                {dropDown && (
                                    <ul className="dropdown-menu">
                                        <li><NavLink to="/my-account">Tài khoản của tôi</NavLink></li>
                                        <li><NavLink onClick={handleLogout}>Đăng xuất</NavLink></li>
                                    </ul>)}
                            </div>
                        </nav>) :
                        (<Link className="login" to="/login">Đăng nhập ngay</Link>)}
                </div>
            </div>
        </>
    )
};
export default Header;