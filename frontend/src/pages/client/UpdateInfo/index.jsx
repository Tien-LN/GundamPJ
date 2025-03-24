import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const UpdateInfo = () => {

    const user = useSelector(state => state.user);
    const [password, setPassword] = useState({
        oldPassword: "",
        newPassword: ""
    })
    const [info, setInfo] = useState({
        name: "",
        phone: "",
        gender: "",
        address: "",
        dateOfBirth: null
    })
    const handleChange = (e) => {
        setPassword({
            ...password,
            [e.target.name]: e.target.value
        })
    }
    console.log(user.id);
    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = {
            ...password,
            id: user.id
        }
        try {
            const response = await axios.post('http://localhost:3000/api/auth/change-password', data, {
                withCredentials: true
            })
            console.log("cap nhat thong tin thanh cong");
        } catch (error) {
            console.log("doi mat khau khong duoc", error);
        }
    }
    console.log(password);

    return (
        <>
            <div>Bạn nên đổi mật khẩu hiện tại</div>
            <div>
                <form onSubmit={handleSubmit} method="POST">
                    <label htmlFor="old_password">Password cũ</label>
                    <input type="password" id="old_password" name="oldPassword" value={password.oldPassword} onChange={handleChange}></input>
                    <label htmlFor="new_password">Password mới</label>
                    <input type="password" id="new_password" name="newPassword" value={password.newPassword} onChange={handleChange}></input>
                    <lable htmlFor="name">Tên</lable>
                    <input type="text" id="name" value={info.name}></input>
                    <label htmlFor="phone">Số điện thoại</label>
                    <input type="text" id="phone" value={info.phone}></input>
                    <label htmlFor="address">Giới tính</label>
                    <select value={info.gender}>
                        <option value="">Chọn giới tính</option>
                        <option value="Nam">Nam</option>
                        <option value="Nữ">Nữ</option>
                    </select>
                    <label htmlFor="address">Địa chỉ</label>
                    <input type="text" id="address" value={info.address}></input>
                    <button type="submit">Submit</button>
                </form>
            </div>
        </>
    )
}

export default UpdateInfo;