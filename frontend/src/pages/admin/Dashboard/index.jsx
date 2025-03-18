import { AuthLogin } from "../../../helpers/admin/Auth";
import "./Dashboard.scss";
function Dashboard(){
    const checkPermission = AuthLogin();
    const {user, hasPermissions, isLoading} = checkPermission;
    // console.log(user);
    return (
        <>
            <div className="dashboard">
                <h1 className="dashboard__title">Trang tổng quan</h1>
                {!isLoading && 
                    <>
                        <div className="dashboard__user-name">{user.name}</div>
                        <div className="dashboard__user-description">{user.description}</div>
                        <div className="dashboard__user-role">{user.role}</div>
                        {user.avatar ? 
                        (
                            <>
                                <div className="dashboard__user-avatarContain">
                                    <img src={user.avatar} alt={user.name}/>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="dashboard__user-avatarContain">
                                    <img src="/img/defaultAvatar.png" alt={user.name}/>
                                </div>
                            </>
                        )}
                    </>
                    
                }
            </div>
            
        </>
    )
}
export default Dashboard;