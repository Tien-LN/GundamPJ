import {format} from "date-fns"

function AdminCourses(props){
    const {courses} = props;
    return (
        <>
            <div className="adminCourses__lists">
                {courses.map((item, index) => 
                    (
                        <div className="adminCourses__box" key={index}>
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