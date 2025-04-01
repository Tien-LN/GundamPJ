import axios from "axios";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import DatePicker from "react-datepicker";
import { format } from "date-fns";
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate } from "react-router";

const UpdateInfo = () => {

    const user = useSelector(state => state.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();
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
    const handleChangeInfo = (e) => {
        setInfo({
            ...info,
            [e.target.name]: e.target.value
        })
    }
    const handleChangeDate = (date) => {
        setInfo({
            ...info,
            dateOfBirth: date
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
            const res = await axios.put('http://localhost:3000/api/users/me/update', info, {
                withCredentials: true
            })
            console.log("cap nhat thong tin thanh cong");
            dispatch({ type: "SET_USER", payload: info });
            navigate("/");
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
                    <label htmlFor="name">Tên</label>
                    <input type="text" name="name" id="name" value={info.name} onChange={handleChangeInfo}></input>
                    <label htmlFor="phone">Số điện thoại</label>
                    <input type="text" id="phone" name="phone" value={info.phone} onChange={handleChangeInfo}></input>
                    <label htmlFor="gender">Giới tính</label>
                    <select name="gender" value={info.gender} onChange={handleChangeInfo}>
                        <option value="">Chọn giới tính</option>
                        <option value="Nam">Nam</option>
                        <option value="Nữ">Nữ</option>
                    </select>
                    <label htmlFor="address">Địa chỉ</label>
                    <input type="text" id="address" name="address" value={info.address} onChange={handleChangeInfo}></input>
                    <label htmlFor="dateOfBirth">Ngày sinh</label>
                    <DatePicker
                        selected={info.dateOfBirth}
                        onChange={date => handleChangeDate(date)}
                        dateFormat="dd/MM/yyyy"
                        placeholderText={info?.dateOfBirth ? format(info.dateOfBirth, "dd/MM/yyyy") : "Nhập ngày"}
                        id="date"
                        name="dateOfBirth"
                        className=""></DatePicker>
                    <button type="submit">Submit</button>
                </form>
            </div>
        </>
    )
}

export default UpdateInfo;