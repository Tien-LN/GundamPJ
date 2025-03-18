import axios from "axios";

function Logout(){
    const handleClick = async () => {
        const res = await axios.post(
            "http://localhost:3000/api/auth/logout", 
            {},
            {
                withCredentials: true
            }
        );
        if(res.status == 200){
            console.log("Đăng xuất thành công!");
            window.location.reload();
        }
    }
    return (
        <>
            <button className="my-account__logout" onClick={handleClick}>
                Logout
            </button>
        </>
    )
}
export default Logout;