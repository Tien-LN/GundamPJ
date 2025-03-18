function AccountsView(props){
    const {role, accounts} = props;
    return (
        <>
            <div className="accountsView">
                <h2 className="accountsView__role">{role}</h2>
                <div className="hr"></div>
                <div className="accountsView__options">
                    <select className="accountsView__select" id="choosePagination" defaultValue={10}>
                        <option value="5">5</option>
                        <option value="10">10</option>
                        <option value="15">15</option>
                        <option value="20">20</option>
                        <option value="25">25</option>
                    </select>
                    <label htmlFor="choosePagination">Hiển thị trên page</label>
                </div>
                <table className="accountsView__table">
                    <thead>
                        <tr>
                            <th>Tên</th>
                            <th>Số điện thoại</th>
                            <th>Email</th>
                            <th>Giới tính</th>
                            <th>Trạng thái</th>
                            <th>Hoạt động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {accounts.map((item, index) => 
                            (
                                <tr key={index}>
                                    <td>{item.name}</td>
                                    <td>{item.phone}</td>
                                    <td>{item.email}</td>
                                    <td>{item.gender == "Male" ? "Nam" : "Nữ"}</td>
                                    <td>{item.status == "active" ? 
                                        <button className="accounts__status--active">Hoạt động</button>  :
                                        <button className="accounts__status--inactive">Đã khóa</button>
                                    }</td>
                                    <td>
                                        <button>Xóa</button>
                                    </td>
                                </tr>
                            )
                           
                        )}
                    </tbody>
                </table>
            </div>
        </>
    )
}
export default AccountsView;