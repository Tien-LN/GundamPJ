import { AuthLogin } from "../../../helpers/admin/Auth";

function Dashboard(){
    const checkPermission = AuthLogin();
    return (
        <>
            Dash board
        </>
    )
}
export default Dashboard;