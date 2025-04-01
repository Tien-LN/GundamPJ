import { Link, NavLink } from 'react-router-dom';
import './header.css'
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';

function Header() {

    const dispatch = useDispatch();
    const user = useSelector((state) => state.user);
    console.log(user);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const data = await axios.get('http://localhost:3000/api/users/me', {
                    withCredentials: true
                })
                console.log(data);
                dispatch({ type: "SET_USER", payload: data.data });
            } catch (error) {
                console.log("ko lay đc user");
            }
        }
        if (!user) fetchUser();
    }, [dispatch, user]);


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
        try {
            await axios.post("http://localhost:3000/api/auth/logout", {}, { withCredentials: true });
            dispatch({ type: "LOGOUT" });
        } catch (error) {
            console.error("Lỗi đăng xuất", error);
        }
    };
    useEffect(() => {
        document.addEventListener("click", closeDropdown);
        return () => document.removeEventListener("click", closeDropdown);
    }, []);

    return (
        <>
            <div className='om'>
                <div className="header-container">
                    <Link to=""><img className="logo" src="/img/Frame-769.png" /></Link>
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