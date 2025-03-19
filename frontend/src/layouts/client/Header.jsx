import { NavLink } from 'react-router-dom';
import './header.css'
import { useEffect, useState } from 'react';
import axios from 'axios';


function Header() {

    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchApi = async () => {
            try {
                const response = await axios.get("http://localhost:3000/api/users/me", {
                    withCredentials: true
                });
                setUser(response.data);
                console.log(response);
            } catch (error) {
                console.error("Lỗi khi lấy user", error);
            }
        }
        fetchApi();
    }, [])

    return (
        <>
            <div className="header-container">
                <img className="logo" src="/img/logo.png" />
                <nav className="nav-bar">
                    <div className='nav-link'>
                        <NavLink to="/" className="nav-link-c">Trang chủ</NavLink>
                        <NavLink to="/courses" className="nav-link-c">Khoá học của tôi</NavLink>
                        <NavLink to="/statistics" className="nav-link-c">Thống kê</NavLink>
                    </div>
                    <NavLink to="/my-account">
                        <img
                            className="avatar-account"
                            src={user?.avatarUrl || "./img/Account.png"}
                            alt="User Avatar"
                        />
                    </NavLink>
                </nav>
            </div>
        </>
    )
};
export default Header;