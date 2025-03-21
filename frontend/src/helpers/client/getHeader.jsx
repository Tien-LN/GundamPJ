import axios from "axios";
import { useEffect, useState } from "react";


export const getHeader = () => {
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
    return user;
}