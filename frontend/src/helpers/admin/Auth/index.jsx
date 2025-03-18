import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import axios from "axios";

export const AuthLogin = () => {
    const [hasPermissions, setHasPermissions] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAuth = async () => {
            try{
                const res = await axios.get("http://localhost:3000/api/users/getPermission", {
                    withCredentials: true
                });
                if(res.data == "ADMIN"){
                    setHasPermissions(true);
                } else if(isLoading == false){
                    navigate("/auth/login");
                }
            } catch(error){
                console.error("Lỗi khi lấy quyền ", error);
                navigate("/auth/login");
            } finally{
                setIsLoading(false);
            }
            
        }
        fetchAuth();
        
    }, [navigate]);

    return {hasPermissions, isLoading};
}

