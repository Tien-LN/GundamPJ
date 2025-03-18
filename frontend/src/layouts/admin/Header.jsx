import { Link } from "react-router-dom";
import CloseSider from "../../components/CloseSider";
import Logout from "../../components/Logout";

function Header(){
    return (
        <>
            <div className="admin__header-containner">
                <span className="admin__header-title">Admin</span>
                <CloseSider/>
                
            </div>
            <div className="my-account__containner">
                <Link to="/admin/my-account">
                        <i className="fa-solid fa-user"></i>
                </Link>
                <Logout/>
            </div>
            
            
        </>
    )
};
export default Header;