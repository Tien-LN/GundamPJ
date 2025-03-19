import React, { useState, useEffect } from "react";

function AccountsView(props) {
    const { role, accounts } = props;

    const [currentPage, setCurrentPage] = useState(1);
    const [itemPage, setItemPage] = useState(5);

    const filteredAccounts = accounts.filter(item => item.role.roleType === role);

    const totalPage = Math.ceil(filteredAccounts.length / itemPage);

    const currentAccounts = filteredAccounts.slice(
        (currentPage - 1) * itemPage,
        currentPage * itemPage
    );

    const handleItemPerPageChange = (event) => {
        setItemPage(Number(event.target.value));
        setCurrentPage(1);
    };

    return (
        <div className="accountsView">
            <h2 className="accountsView__role">
                {role === "STUDENT" ? "Học sinh" : "Giáo viên"}
            </h2>

            {/* Chọn số item hiển thị trên mỗi trang */}
            <div className="accountsView__options">
                <select className="accountsView__select" onChange={handleItemPerPageChange} value={itemPage}>
                    <option value="5">5</option>
                    <option value="10">10</option>
                    <option value="15">15</option>
                    <option value="20">20</option>
                    <option value="25">25</option>
                </select>
                <label htmlFor="choosePagination">Hiển thị trên page</label>
            </div>

            {/* Danh sách tài khoản */}
            <div className="accountsView__lists">
                {currentAccounts.map((item, index) => (
                    <div className="accountsView__box" key={index}>
                        <div className="accountsView__box-head">
                            <div className="accountsView__box-headImage">
                                {item.avatarUrl ? (
                                    <img src={item.avatarUrl} alt={item.name} />
                                ) : (
                                    <img src="/img/defaultAvatar.png" alt={item.name} />
                                )}
                            </div>
                            <div className="accountsView__box-headInfo">
                                <div className="accountsView__box-headInfo--name">
                                    <b>Tên: </b>{item.name}
                                </div>
                                <div className="accountsView__box-headInfo--phone">
                                    <b>Sđt: </b>{item.phone ? item.phone : "Chưa nhập"}
                                </div>
                                <div className="accountsView__box-headInfo--gender">
                                    <b>Giới tính: </b>{item.gender === "Male" ? "Nam" : "Nữ"}
                                </div>
                                <div className="accountsView__box-headInfo--status">
                                    <b>Trạng thái: </b>
                                    {item.status === "active" ? (
                                        <button className="accountsView__box-headInfo--statusActive">Hoạt động</button>
                                    ) : (
                                        <button className="accountsView__box-headInfo--statusInActive">Đã bị khóa</button>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="accountsView__box-tail">
                            <div className="accountsView__box-tailInfo--email">
                                <b>Email: </b>{item.email ? item.email : "Chưa nhập"}
                            </div>
                            <div className="accountsView__box-tailInfo--address">
                                <b>Địa chỉ: </b>{item.address ? item.address : "Chưa nhập"}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="pagination">
                <button onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} disabled={currentPage === 1}>
                    Trang trước
                </button>
                <span> Trang {currentPage} / {totalPage} </span>
                <button onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPage))} disabled={currentPage === totalPage}>
                    Trang tiếp theo
                </button>
            </div>
        </div>
    );
}

export default AccountsView;
