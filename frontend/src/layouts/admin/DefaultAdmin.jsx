import Header from "./Header";
import Sider from "./Sider";
import "./Default.scss";
import {Outlet} from "react-router-dom";
function DefaultAdmin(){
    return (
        <>
            <header className="admin__header">
                <Header/>
            </header>

            
            <main className="admin__main">
                <Sider/>
                <div className="offset-2" id="offset-2"></div>
                <div className="admin__main-containner">
                    <Outlet/>
                </div>
                
            </main>
        </>
    )
}
export default DefaultAdmin;