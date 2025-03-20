import axios from "axios";
import {format} from "date-fns"
import "./AdminCourses.scss";
import { handlePriceFormat } from "../../helpers/admin/priceFormat";
function AdminCourses(props){
    const {courses} = props;
    const handleDelete = (id) => {
        const fetchApi = async() => {
            try {
                const res = await axios.delete(`http://localhost:3000/api/courses/${id}`, {
                    withCredentials: true
                });

                console.log("Đã xóa thành công");
                window.location.reload();
            } catch(error){
                console.error("Lỗi", error);
            }   
        }
        fetchApi();
    }
    const handleDeletePermanent = async(id) => {
        const fetchApi = async() => {
            try {
                const res = await axios.delete(`http://localhost:3000/api/courses/delete/permanent/${id}`, {
                    withCredentials: true
                });

                console.log("Đã xóa thành công");
                window.location.reload();
            } catch(error){
                console.error("Lỗi", error);
            }   
        }
        fetchApi();
    }
    const handleRestore = async(id) => {
        const fetchApi = async() => {
            try {
                const res = await axios.patch(`http://localhost:3000/api/courses/restore/${id}`, 
                    {},
                    {
                        withCredentials: true
                    }
                );

                console.log("Đã khôi phục thành công thành công");
                window.location.reload();
            } catch(error){
                console.error("Lỗi", error);
            }   
        }
        fetchApi();
    }
    return (
        <>
            <div className="adminCourses__lists">
                {courses.map((item, index) => 
                    (
                        <div className="adminCourses__box" key={index}>
                            {item.deleted==false ? 
                                <button className="adminCourses__delete" onClick={() => {handleDelete(item.id)}}>
                                    <i className="fa-solid fa-minus"></i>
                                </button>
                                :
                                <div className="adminCourses__deleted">
                                    <button className="adminCourses__deleted-restore" onClick={() => {handleRestore(item.id)}}>
                                        <i className="fa-solid fa-rotate-left"></i>
                                    </button>
                                    <button className="adminCourses__deleted-perm" onClick={() => {handleDeletePermanent(item.id)}}>
                                        <i className="fa-solid fa-minus"></i>
                                    </button>
                                </div>
                                
                            }
                            
                            <div className="adminCourses__box-head">
                                <div className="adminCourses__box-headImage">
                                    {item.imageUrl ? 
                                        <img src={item.imageUrl} alt={item.name}/>
                                        :
                                        <img src="/img/default-bg.jpg" alt={item.name}/>
                                    }
                                </div>
                                <div className="adminCourses__box-headInfo">
                                    <div className="adminCourses__box-headInfo--name"><b>Tên: </b>{item.name}</div>
                                    <div className="adminCourses__box-headInfo--startDate"><b>Ngày bắt đầu: </b>{format(new Date(item.startDate), "dd/MM/yyyy")}</div>
                                    <div className="adminCourses__box-headInfo--endDate"><b>Ngày kết thúc: </b>{format(new Date(item.endDate), "dd/MM/yyyy")}</div>
                                    <div className="adminCourses__box-headInfo--teacher"><b>Giáo viên: </b>{item.teacher.name}</div>
                                    <div className="adminCourses__box-headInfo--price"><b>Giá: </b>{handlePriceFormat(item.price)}</div>
                                </div>
                            </div>
                            <div className="adminCourses__box-tail">
                                    <div className="adminCourses__box-tailInfo--description"><b>Mô tả: </b>{item.description ? item.description : "Chưa nhập"}</div>
                            </div>
                        </div>
                    )
                    
                )}
            </div>
        </>
    )
}
export default AdminCourses;