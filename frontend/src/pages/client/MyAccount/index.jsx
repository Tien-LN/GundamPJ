import { use, useEffect, useRef, useState } from "react";
import "./myaccount.css";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";
import { useDispatch, useSelector } from "react-redux";

function MyAccount() {
    const dispatch = useDispatch();
    const user = useSelector(state => state.user);
    const [name, setName] = useState("");
    const [address, setAddress] = useState("");
    const [phone, setPhone] = useState("");
    const [gender, setGender] = useState("");
    const [date, setDate] = useState(null);

    const [changeName, setChangeName] = useState(false);
    const [changeAddress, setChangeAddress] = useState(false);
    const [changePhone, setChangePhone] = useState(false);
    const [changeGender, setChangeGender] = useState(false);
    const [changeDate, setChangeDate] = useState(false);

    const handleChangeName = (e) => {
        setName(e.target.value);
    }
    const onChangeName = () => {
        setChangeName(!changeName);
    }
    const handleChangePhone = (e) => {
        setPhone(e.target.value);
    }
    const onChangePhone = () => {
        setChangePhone(!changePhone);
    }
    const handleChangeAddress = (e) => {
        setAddress(e.target.value);
    }
    const onChangeAddress = () => {
        setChangeAddress(!changeAddress);
    }
    const handleChangeDate = (date) => {
        setDate(date);
    }
    const onChangeDate = () => {
        setChangeDate(!changeDate);
    }
    const onChangeGender = () => {
        setChangeGender(!changeGender);
    }
    const handleChangeGender = (e) => {
        setGender(e.target.value);
    }
    const handleSave = async () => {
        const updateData = {
            name: name || user.name,
            address: address || user.address,
            gender: gender || user.gender,
            phone: phone || user.phone,
            dateOfBirth: date || user.dateOfBirth
        }
        try {
            const res = await axios.put('http://localhost:3000/api/users/me/update', updateData, {
                headers: {
                    "Content-type": "application/json"
                },
                withCredentials: true
            })
            console.log(res);
            setChangeName(false);
            setChangeAddress(false);
            setChangeDate(false);
            setChangeGender(false);
            setChangePhone(false);
            dispatch({ type: "SET_USER", payload: updateData });
        } catch (error) {
            console.log("cap nhat user chua duoc");
        }
    }
    console.log(user);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const data = await axios.get('http://localhost:3000/api/users/me', {
                    withCredentials: true
                })
                // console.log(data);
                dispatch({ type: "SET_USER", payload: data.data });
            } catch (error) {
                console.log("ko lay đc user");
            }
        }
        if (!user) fetchUser();
    }, [dispatch, user]);


    return (
        <>
            <div className="linear"></div>
            <div className="myaccount__container">
                <div className="myaccount__box">
                    <div className="myaccount__box-heading-container">
                        <div className="myaccount__box-heading">ACCOUNT</div>
                        <img className="myaccount__box-avatar" src={user?.avatarUrl || "./img/Account.png"} />
                    </div>
                    <div className="myaccount__box-info">
                        <div className="myaccount__box-info--name">
                            <div className="myaccount__box-info--name-box">
                                <div>Name</div>
                                {changeName ? (
                                    <div>
                                        <input placeholder={user?.name ? user.name : ""} id="name" type="text" value={name} onChange={handleChangeName}></input>
                                        <button onClick={handleSave}>Save</button>
                                    </div>

                                ) : (<div>{user?.name ? user.name : "Loading"}</div>)}
                            </div>
                            <div className="myaccount__box-info--name-change" onClick={onChangeName}><i class="fa-solid fa-pencil"></i></div>
                        </div>
                        <div className="myaccount__box-info--date">
                            <div className="myaccount__box-info--date-box">
                                <div>Date of birth</div>
                                {changeDate ? (
                                    <div>
                                        <DatePicker
                                            selected={date}
                                            onChange={(date) => handleChangeDate(date)}
                                            dateFormat="dd/MM/yyyy"
                                            placeholderText={user?.dateOfBirth ? format(user.dateOfBirth, "dd/MM/yyyy") : "Nhập ngày"}
                                            id="date"
                                            name="dateOfBirth"
                                            className=""
                                        />
                                        <button onClick={handleSave}>Save</button>
                                    </div>
                                )
                                    : (<div className="myaccount__box-info--descript">{user.dateOfBirth ? format(new Date(user.dateOfBirth), "dd/MM/yyyy") : "Loading..."}</div>)
                                }

                            </div>
                            <div className="myaccount__box-info--name-change" onClick={onChangeDate}><i class="fa-solid fa-pencil"></i></div>
                        </div>
                        <div className="myaccount__box-info--phone">
                            <div className="myaccount__box-info--phone-box">
                                <div>Phone number</div>
                                {changePhone ? (
                                    <div>
                                        <input placeholder={user?.phone ? user.phone : ""} type="text" value={phone} onChange={handleChangePhone}></input>
                                        <button onClick={handleSave}>Save</button>
                                    </div>

                                ) : (<div>{user?.phone ? user.phone : "Loading"}</div>)}
                            </div>
                            <div className="myaccount__box-info--name-change" onClick={onChangePhone}><i class="fa-solid fa-pencil"></i></div>
                        </div>
                        <div className="myaccount__box-info--gender">
                            <div>
                                <div>Gender</div>
                                {changeGender ? (
                                    <div>
                                        <select name="gender" value={gender} onChange={handleChangeGender}>
                                            <option value="" disabled>Chọn giới tính</option>
                                            <option value="Nam">Nam</option>
                                            <option value="Nữ">Nữ</option>
                                        </select>
                                        <button onClick={handleSave}>Save</button>
                                    </div>
                                ) : (<div className="myaccount__box-info--descript">{user?.gender || "Loading..."}</div>)}
                            </div>
                            <div className="myaccount__box-info--name-change" onClick={onChangeGender}><i class="fa-solid fa-pencil"></i></div>
                        </div>
                        <div className="myaccount__box-info--address">
                            <div className="myaccount__box-info--address-box">
                                <div>Address</div>
                                {changeAddress ? (
                                    <div>
                                        <input placeholder={user?.address ? user.address : ""} type="text" value={address} onChange={handleChangeAddress}></input>
                                        <button onClick={handleSave}>Save</button>
                                    </div>

                                ) : (<div>{user?.address ? user.address : "Loading"}</div>)}
                            </div>
                            <div className="myaccount__box-info--name-change" onClick={onChangeAddress}><i class="fa-solid fa-pencil"></i></div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
export default MyAccount;