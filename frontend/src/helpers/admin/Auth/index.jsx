import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import axios from "axios";

export const AuthLogin = () => {
    const [hasPermissions, setHasPermissions] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAuth = async () => {
            try {
                const res = await axios.get("http://localhost:3000/api/users/getPermission", {
                    withCredentials: true
                });
                if (res.data.role == "ADMIN") {
                    setHasPermissions(true);
                    setUser(res.data);

                } else if (isLoading == false) {
                    navigate("/login");
                }
            } catch (error) {
                console.error("Lỗi khi lấy quyền ", error);
                navigate("/login");
            } finally {
                setIsLoading(false);
            }

        }
        fetchAuth();

    }, [navigate]);

    return { user, hasPermissions, isLoading };
}

