import { useEffect, useRef, useState } from "react";
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
    const refB = useRef();
    // console.log(refB)
    const handleChange = (e) => {
        setInfo({
            ...info,
            [e.target.name]: e.target.value
        })
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

    console.log(user);

    return (
        <>
            <div className="linear"></div>
            <div className="myaccount__container">
                <div className="myaccount__box">
                    <div className="myaccount__box-heading">ACCOUNT</div>
                    <img className="myaccount__box-avatar" src={user?.avatarUrl || "./img/Account.png"} />
                    <div className="myaccount__box-info">
                        <div className="myaccount__box-info--name">
                            <div>Name</div>
                            <div className="myaccount__box-info--descript">{user?.name || "Loading..."}</div>
                            <form ref={refB} className="hide" onSubmit={handleSubmit}>
                                <input name="name" value={info.name} onChange={handleChange} />
                                <button type="submit">Save</button>
                            </form>
                        </div>
                        <div className="myaccount__box-info--date">
                            <div>Date of birth</div>
                            <div className="myaccount__box-info--descript">{user?.dateOfBirth || "Loading..."}</div>
                            <form className="hide" onSubmit={handleSubmit}>
                                <input name="dateOfBirth" value={info.date} onChange={handleChange} />
                                <button>Save</button>
                            </form>
                        </div>
                        <div className="myaccount__box-info--phone">
                            <div>Phone number (dad / mom)</div>
                            <div className="myaccount__box-info--descript">{user?.phone || "Loading..."}</div>
                            <form className="hide" onSubmit={handleSubmit}>
                                <input name="phone" value={info.phone} onChange={handleChange} />
                                <button>Save</button>
                            </form>
                        </div>
                        <div className="myaccount__box-info--gender">
                            <div>Gender</div>
                            <div className="myaccount__box-info--descript">{user?.gender || "Loading..."}</div>
                            <form className="hide" onSubmit={handleSubmit}>
                                <input name="gender" value={info.gender} onChange={handleChange} />
                                <button>Save</button>
                            </form>
                        </div>
                        <div className="myaccount__box-info--address">
                            <div>Address</div>
                            <div className="myaccount__box-info--descript">{user?.address || "Loading..."}</div>
                            <form className="hide" onSubmit={handleSubmit}>
                                <input name="address" value={info.address} onChange={handleChange} />
                                <button>Save</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
export default MyAccount;