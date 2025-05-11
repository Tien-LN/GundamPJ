import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer.jsx";
import "./Default.css"; // Import the CSS file

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
