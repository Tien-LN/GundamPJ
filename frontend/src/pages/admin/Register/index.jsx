import { Outlet } from "react-router-dom";
import { AuthLogin } from "../../../helpers/admin/Auth";
import "./Register.scss";
function Register(){
    const checkPermission = AuthLogin();
    return (
        <>
            <div className="register">
                <Outlet/>
            </div>
            
        </>
    )
}
export default Register;