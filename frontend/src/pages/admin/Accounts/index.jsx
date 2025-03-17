import AccountsView from "../../../components/AccountsView";

function Accounts(){
    const role = "Học sinh";
    const accounts = [
        {
            email: "nhattienlam@gmail.com",
            name: "Admin",
            status: "active",
            gender: "Male",
            phone: "01234"
        },
        {
            email: "aoxanh@gmail.com",
            name: "ao xanh",
            status: "active",
            gender: "Male",
            phone: "01234"
        },
        {
            email: "aodo@gmail.com",
            name: "ao do",
            status: "active",
            gender: "Male",
            phone: "01234"
        }
    ]
    return (
        <>
            <div className="accounts">
                <h1 className="accounts__title">Trang danh sách tài khoản</h1>
                <AccountsView role={role} accounts={accounts}/>
            </div>
        </>
    )
}
export default Accounts;