import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function SingleRegister(){
    const navigate = useNavigate();
    const [data, setData] = useState({
        email: "",
        name: "",
        role: ""
    })
    const [roles, setRoles] = useState([]);
    const handleChange = (e) => {
        setData({
            ...data,
            [e.target.name] : e.target.value
        });
    }
    useEffect(()=>{
        const fetchApi = async() => {
            try{
                const res = await axios.get("http://localhost:3000/api/roles", {
                    withCredentials: true
                });

                // console.log(res.data);
                setRoles(res.data);
            } catch(error){
                console.error("Lỗi", error);
            }
            
        }
        fetchApi();
    }, []);
    const handleSubmit = async (e)=>{
        e.preventDefault();
        
        try{
            const res = await axios.post("http://localhost:3000/api/admin/register", data, {
                headers: {
                    "Content-Type" : "application/json"
                },
                withCredentials: true
            });
            // console.log(res);
            
            console.log("Tạo user thành công !!");
            navigate("/admin/registers");
            
        } catch(error){
            console.error("Lỗi", error);
        }
    }
    return (
        <>
            <h1 className="singleRegister__title">Đăng ký tài khoản cá nhân</h1>
            
            <form className="singleRegister" method="POST" onSubmit={handleSubmit}>
                <div className="singleRegister__box">
                    <label htmlFor="email">Email</label>
                    <input className="singleRegister__email" type="email" name="email" id="email" value={data.email} onChange={handleChange} required/>
                </div>
                <div className="singleRegister__box">
                    <label htmlFor="name">Họ tên</label>
                    <input className="singleRegister__name" type="text" name="name" id="name" value={data.name} onChange={handleChange} required/>
                </div>
                <div className="singleRegister__box">
                    <label htmlFor="role">Vai trò</label>
                    <select className="singleRegister__role" name="role" id="role" value={data.role} onChange={handleChange}>
                        <option value="" disabled>Chọn vai trò</option>
                        {roles && 
                            roles.map((item,index) => (
                                <option value={item.roleType} key={index}>{item.title}</option>
                            ))
                        }
                    </select>
                </div>
                <div className="singleRegister__box">
                    <button type="submit" className="singleRegister__submit">Tạo</button>
                </div>
            </form>
        </>
    )
}
export default SingleRegister;