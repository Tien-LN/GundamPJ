import Header from "./Header";
import {Outlet} from "react-router-dom";
function Default(){
    return (
        <>
            <header className="header">
                <Header/>
            </header>

            <main className="main">
                <Outlet/>
            </main>
        </>
    )
}
export default Default;