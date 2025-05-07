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
        console.log("Đang gọi API getPermission...");
        const res = await axios.get(
          "http://localhost:3000/api/users/getPermission",
          {
            withCredentials: true,
          }
        );
        console.log("API Response:", res.data);

        if (
          res.data &&
          typeof res.data.role === "string" &&
          res.data.role === "ADMIN"
        ) {
          console.log(
            "Người dùng có quyền admin, thiết lập hasPermissions = true"
          );
          setHasPermissions(true);
          setUser(res.data);
        } else {
          console.log("Không phải admin, chuyển hướng đến dashboard");
          console.log("Role nhận được:", res.data.role);
          navigate("/dashboard");
        }
      } catch (error) {
        console.error("Lỗi khi lấy quyền:", error);
        console.error(
          "Chi tiết lỗi:",
          error.response ? error.response.data : "Không có response"
        );
        navigate("/login");
      } finally {
        setIsLoading(false);
      }
    };
    fetchAuth();
  }, [navigate]);

  return { user, hasPermissions, isLoading };
};
