import { use, useEffect, useRef, useState } from "react";
import "./myaccount.css";
import axios from "axios";

function MyAccount() {

    const [user, setUser] = useState();
    const [info, setInfo] = useState({
        name: "",
        dateOfBirth: "",
        address: "",
        phone: "",
        gender: ""
    });
    const [clickName, setClickName] = useState(false);
    const [clickDate, setClickDate] = useState(false);
    const [clickAddress, setClickAddress] = useState(false);
    const [clickPhone, setClickPhone] = useState(false);
    const [clickGender, setClickGender] = useState(false);

    const handleChange = (e) => {
        setInfo({
            ...info,
            [e.target.name]: e.target.value
        })
    }
    const handleChangeName = () => {
        setClickName(!clickName);
    }
    const handleChangeDate = () => {
        setClickDate(!clickDate);
    }
    const handleChangeAddress = () => {
        setClickAddress(!clickAddress);
    }
    const handleChangePhone = () => {
        setClickPhone(!clickPhone);
    }
    const handleChangeGender = () => {
        setClickGender(!clickGender);
    }
    const handleSubmit = async (e) => {
        e.preventDefault();

        const updatedInfo = {
            name: info.name || user.name,
            dateOfBirth: info.dateOfBirth || user.dateOfBirth,
            address: info.address || user.address,
            phone: info.phone || user.phone,
            gender: info.gender || user.gender
        };
        try {
            const response = await axios.put('http://localhost:3000/api/users/me/update',
                updatedInfo,
                {
                    headers: {
                        "Content-Type": "application/json"
                    },
                    withCredentials: true
                }
            );
            setUser((prev) => ({
                ...prev,
                name: updatedInfo.name,
                dateOfBirth: updatedInfo.dateOfBirth,
                address: updatedInfo.address,
                phone: updatedInfo.phone,
                gender: updatedInfo.gender
            }))
            setInfo({
                name: "",
                dateOfBirth: "",
                phone: "",
                address: "",
                gender: ""
            })
            setClickAddress(false);
            setClickName(false);
            setClickGender(false);
            setClickPhone(false);
            setClickDate(false);
        } catch (error) {
            console.error("Error updating user:", error);
        }
    }

    useEffect(() => {
        const fetchApi = async () => {
            const response = await axios.get('http://localhost:3000/api/users/me', {
                withCredentials: true
            });
            setUser(response.data);
        }
        fetchApi();
    }, [])


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
                                <div className="myaccount__box-info--descript">{user?.name || "Loading..."}</div>
                                {clickName &&
                                    (<form className="hide" onSubmit={handleSubmit}>
                                        <input name="name" value={info.name} onChange={handleChange} />
                                        <button type="submit">Save</button>
                                    </form>)
                                }
                            </div>
                            <button onClick={handleChangeName}><i class="fa-solid fa-pencil"></i></button>
                        </div>
                        <div className="myaccount__box-info--date">
                            <div className="myaccount__box-info--date-box">
                                <div>Date of birth</div>
                                <div className="myaccount__box-info--descript">{user?.dateOfBirth || "Loading..."}</div>
                                {clickDate && (
                                    <form className="hide" onSubmit={handleSubmit}>
                                        <input name="dateOfBirth" value={info.date} onChange={handleChange} />
                                        <button>Save</button>
                                    </form>
                                )}
                            </div>
                            <button onClick={handleChangeDate}><i class="fa-solid fa-pencil"></i></button>
                        </div>
                        <div className="myaccount__box-info--phone">
                            <div className="myaccount__box-info--phone-box">
                                <div>Phone number (dad / mom)</div>
                                <div className="myaccount__box-info--descript">{user?.phone || "Loading..."}</div>
                                {
                                    clickPhone && (
                                        <form className="hide" onSubmit={handleSubmit}>
                                            <input name="phone" value={info.phone} onChange={handleChange} />
                                            <button>Save</button>
                                        </form>
                                    )
                                }
                            </div>
                            <button onClick={handleChangePhone}><i class="fa-solid fa-pencil"></i></button>
                        </div>
                        <div className="myaccount__box-info--gender">
                            <div>
                                <div>Gender</div>
                                <div className="myaccount__box-info--descript">{user?.gender || "Loading..."}</div>
                                {clickGender && (
                                    <form className="hide" onSubmit={handleSubmit}>
                                        <select name="gender" value={info.gender} onChange={handleChange}>
                                            <option value="" disabled>Chọn giới tính</option>
                                            <option value="Nam">Nam</option>
                                            <option value="Nữ">Nữ</option>
                                        </select>
                                        <button>Save</button>
                                    </form>
                                )}
                            </div>
                            <button onClick={handleChangeGender}><i class="fa-solid fa-pencil"></i></button>
                        </div>
                        <div className="myaccount__box-info--address">
                            <div className="myaccount__box-info--address-box">
                                <div>Address</div>
                                <div className="myaccount__box-info--descript">{user?.address || "Loading..."}</div>
                                {clickAddress && (
                                    <form className="hide" onSubmit={handleSubmit}>
                                        <input name="address" value={info.address} onChange={handleChange} />
                                        <button>Save</button>
                                    </form>
                                )}
                            </div>
                            <button onClick={handleChangeAddress}><i class="fa-solid fa-pencil"></i></button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
export default MyAccount;