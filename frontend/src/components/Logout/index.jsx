import axios from "axios";

function Logout() {
  const handleClick = async () => {
    const res = await axios.post(
      "http://localhost:3000/api/auth/logout",
      {},
      {
        withCredentials: true,
      }
    );
    if (res.status == 200) {
      console.log("Đăng xuất thành công!");
      window.location.href = "/login";
    }
  };
  return (
    <>
      <button
        className="my-account__logout"
        onClick={handleClick}
        style={{
          cursor: "pointer",
          backgroundColor: "#f95757",
          padding: "5px 10px",
          borderRadius: "5px",
          border: "none",
          color: "#fff",
          fontSize: "16px",
          fontWeight: "bold",
        }}
      >
        Logout
      </button>
    </>
  );
}
export default Logout;
