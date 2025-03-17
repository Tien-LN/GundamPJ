import { Link } from "react-router-dom";
import CloseSider from "../../components/CloseSider";

function Header(){
    return (
        <>
            <div className="admin__header-containner">
                <span className="admin__header-title">Admin</span>
                <CloseSider/>
                
            </div>
            <Link to="/admin/my-account">
                    <i className="fa-solid fa-user"></i>
            </Link>
            
        </>
    )
};
export default Header;