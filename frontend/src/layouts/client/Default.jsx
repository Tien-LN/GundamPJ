import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer.jsx";
function Default() {
  return (
    <>
      <header className="header">
        <Header />
      </header>

      <main className="main">
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
export default Default;
