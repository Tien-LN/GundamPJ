import axios from "axios";
import AccountsView from "../../../components/AccountsView";
import FilterRole from "../../../components/AccountsView/FilterRole";
import { AuthLogin } from "../../../helpers/admin/Auth";
import "./Accounts.scss";
import { useState, useEffect } from "react";
function Accounts() {
    const checkPermission = AuthLogin();
    const [user, setUser] = useState([]);
    const params = new URLSearchParams(window.location.search);
    const filterRole = params.get("filterRole");
    useEffect(() => {
        const fetchApi = async () => {
            try {
                const res = await axios.get("http://localhost:3000/api/users", {
                    withCredentials: true
                });
                // console.log(res);
                setUser(res.data)
            } catch (error) {
                console.log("Lỗi ", JSON.parse(error.request.response));
            }
        }

        fetchApi();
    }, []);
    // console.log(user);
    return (
        <>
            <div className="accounts">
                <h1 className="accounts__title">Trang danh sách tài khoản</h1>
                <FilterRole />
                {!filterRole ? <>
                    <AccountsView role="STUDENT" accounts={user} />
                    <AccountsView role="TEACHER" accounts={user} />
                </> :
                    <AccountsView role={filterRole} accounts={user} />
                }

            </div>
        </>
    )
}
export default Accounts;