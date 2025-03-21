import axios from "axios";


export const logout = async () => {
    const res = await axios.post(
        "http://localhost:3000/api/auth/logout",
        {},
        {
            withCredentials: true
        }
    );
    if (res.status == 200) {
        console.log("Đăng xuất thành công!");
        window.location.reload();
    }
}