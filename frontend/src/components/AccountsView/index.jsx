function AccountsView(props){
    const {role, accounts} = props;
    const newAccounts = accounts.filter(item => item.role.roleType == role);
    return (
        <>
            <div className="accountsView">
                <h2 className="accountsView__role">{role == "STUDENT" ? "Học sinh" : "Giáo viên"}</h2>
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
        
                    <div className="accountsView__lists">
                        {newAccounts.map((item, index) => 
                            (
                                <div className="accountsView__box" key={index}>
                                    <div className="accountsView__box-head">
                                        <div className="accountsView__box-headImage">
                                            {item.avatarUrl ? 
                                                <img src={item.avatarUrl} alt={item.name}/>
                                                :
                                                <img src="/img/defaultAvatar.png" alt={item.name}/>
                                            }
                                        </div>
                                        <div className="accountsView__box-headInfo">
                                            <div className="accountsView__box-headInfo--name"><b>Tên: </b>{item.name}</div>
                                            <div className="accountsView__box-headInfo--phone"><b>Sđt: </b>{item.phone ? item.phone : "Chưa nhập"}</div>
                                            <div className="accountsView__box-headInfo--gender"><b>Giới tính: </b>{item.gender == "Male" ? "Nam" : "Nữ"}</div>
                                            <div className="accountsView__box-headInfo--status"><b>Trạng thái: </b>{item.status == "active" ? 
                                                <button className="accountsView__box-headInfo--statusActive">Hoạt động</button>
                                            : 
                                                <button className="accountsView__box-headInfo--statusInActive">Đã bị khóa</button>
                                            }</div>
                                        </div>
                                    </div>
                                    <div className="accountsView__box-tail">
                                            <div className="accountsView__box-tailInfo--email"><b>Email: </b>{item.email ? item.email : "Chưa nhập"}</div>
                                            <div className="accountsView__box-tailInfo--address"><b>Địa chỉ: </b>{item.address ? item.address : "Chưa nhập"}</div>
                                            
                                    </div>
                                </div>
                            )
                           
                        )}
                    </div>
           
            </div>
        </>
    )
}
export default AccountsView;