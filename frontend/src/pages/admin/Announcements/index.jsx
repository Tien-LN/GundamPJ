import axios from "axios";
import { useEffect, useState } from "react";
import "./Announcements.scss";
import { AuthLogin } from "../../../helpers/admin/Auth";
import {format}  from "date-fns";
import { useSearchParams } from "react-router-dom";
function Announcements(){
    const checkPermission = AuthLogin();
    // console.log(checkPermission.user.id);
    const [MapCourses, setMapCourses] = useState({});
    const [sortQuery, setSortQuery] = useState("");
    const [roles, setRoles] = useState([]);
    const [courses, setCourses] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [announs, setAnnouns] = useState([]);
    const [searchParams, setSearchParams] = useSearchParams();
    const [data, setData] = useState({
        title: "",
        content: "",
        roleVisibility: "",
        courseIds: []
    })
    const [submit, setSubmit] = useState(false);

    const onClose = () => {
        setIsOpen(false);
    }
    const onOpen = () => {
        setIsOpen(true);
    }
    useEffect(() => {
        const ModalPick = document.querySelector("#modalChooseCourses");
        const handleClickOutSide = (event) => {
            // console.log(event);
            if(event.target === ModalPick){
                onClose();
            }
        }
        if(ModalPick){
            ModalPick.removeEventListener("click", handleClickOutSide);
            ModalPick.addEventListener("click", handleClickOutSide);    
        }
    }, [isOpen]);
    useEffect(()=>{
        const fetchApi = async() => {
            try{
                const res = await axios.get("http://localhost:3000/api/roles", {
                    withCredentials: true
                });
                const res_courses = await axios.get("http://localhost:3000/api/courses", {
                    withCredentials: true
                });
                // console.log(res.data);
                setRoles(res.data);
                setCourses(res_courses.data);
            } catch(error){
                console.error("Lỗi", error);
            }
            
        }
        fetchApi();

        
    }, []);

    // Lấy thông báo 
    useEffect(()=> {
        const fetchApi = async() => {
            try{
                const queryString = searchParams.toString();
                // console.log(queryString);
                const res_announs = await axios.get(`http://localhost:3000/api/announcements?${queryString}`, {
                    withCredentials: true
                });
                // console.log(res_announs.data);
                setAnnouns(res_announs.data);
            } catch(error){
                console.error("Lỗi", error);
            }
            
        }
        fetchApi();
    }, [searchParams]);
    useEffect(()=>{
        if(submit == true){
            const createAnnoun = async() => {
                try{
                    const res = await axios.post("http://localhost:3000/api/announcements/create", data, {
                        headers: {
                            "Content-Type": "application/json"
                        },
                        withCredentials: true
                    });
                    
                    console.log("Đã tạo thành công!");
                    window.location.reload();
                } catch(error) {
                    console.error("Lỗi khi tạo thông báo : ", error);
                }
            }
            createAnnoun();
            setSubmit(false);
        }
    }, [submit]);
    useEffect(()=>{
        if (courses && courses.length > 0) {
            const newMap = {};
            for (const course of courses) {
                newMap[course.id] = course.name;
            }
            setMapCourses(newMap);
        }
    }, [courses]);
    // console.log(courses);
    // console.log(announs);
    // console.log(MapCourses);
    const handleSubmit = () => {
        const ModalPick = document.querySelector("#modalChooseCourses");
        if(ModalPick){
            const courseButtons = ModalPick.querySelectorAll("[data-pick]");
            const courseIds = [];

            for (const button of courseButtons) {
                if(button.checked == true){
                    courseIds.push(button.value);
                }
            }
            
            setData({
                ...data,
                ["courseIds"] : courseIds,
                ["authorId"] : checkPermission.user.id
            });
            
            onClose();
            setSubmit(true);
        }
    }
    const handleChooseCourses = (e) => {
        e.preventDefault();

        onOpen();
    }
    const handleChange = (e) => {
        setData({
            ...data,
            [e.target.name]: e.target.value
        });
    }
    const getCoursesName = (x) => {

        if(!x || x.length == 0) return "";
        let result = x.map(courseId => 
            `${MapCourses[courseId]}`
        ).join(", ");
        if(result.length > 30) result = result.slice(0, 30) + "...";
    
        return result;
    }
    const addSearchParams = (e) => {
        const selectedValue = e.target.value;
        const selectedName = e.target.name;

        if(selectedValue){
            searchParams.set(selectedName, selectedValue);
        } else {
            searchParams.delete(selectedName);
        }

        setSearchParams(searchParams);
    }
    const handleDeleteAnnouncement = (id) => {
        const fetchApi = async() => {
            try {
                const res = await axios.delete(`http://localhost:3000/api/announcements/${id}`, {
                    withCredentials: true
                });
    
                console.log("Đã xóa thành công");
                window.location.reload();
            } catch(error){
                console.error("Lỗi khi xóa thông báo", error);
            }
        };
        fetchApi();
    }
    const handleDeleteData = () => {
        setData({
            title: "",
            content: "",
            roleVisibility: "",
            courseIds: []
        });
    }
    // console.log(data);
    return (
        <>
            {
                isOpen && 
                <div className="announcements__chooseModal" id="modalChooseCourses" >
                    <div className="announcements__Modal">
                        <h1 className="announcements__Modal-title">Chọn môn học</h1>
                        <table className="announcements__Modal-table">
                            <thead>
                                <tr>
                                    <th>Đến</th>
                                    <th>Tên</th>
                                    <th>Giáo viên</th>
                                    <th>Ngày bắt đầu</th>
                                    <th>Ngày kết thúc</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    courses && 
                                    courses.map((item, index) => (
                                        <tr key={index}>
                                            <td>
                                                <input type="checkbox" name="id" value={item.id} data-pick/>
                                            </td>
                                            <td>{item.name}</td>
                                            <td>{item.teacher.name}</td>
                                            <td>{format(new Date(item.startDate), "dd/MM/yyyy")}</td>
                                            <td>{format(new Date(item.endDate), "dd/MM/yyyy")}</td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                        <button className="announcements__Modal-submit" onClick={handleSubmit}>Gửi</button>
                    </div>
                </div>
            }
           
            <div className="announcements">
                <h1 className="announcements__title">Trang quản lý thông báo</h1>
                <div className="announcements__containner">
                    <div className="announcements__views">
                        <span className="announcements__views-title">Tất cả thông báo</span>
                        <div className="announcements__views-options">
                            <select className="announcements__views-sort" name="createdAt" onChange={addSearchParams}>
                                <option value="">Mặc định</option>
                                <option value="asc">Ngày tạo sớm nhất</option>
                                <option value="desc">Ngày tạo trễ</option>
                            </select>
                            <select className="announcements__views-filter" name="roleVisibility" onChange={addSearchParams}>
                                <option value="">Tất cả</option>
                                <option value="ALL">ALL</option>
                                {
                                    roles && 
                                        roles.map((item,index) => 
                                        <option key={index} value={item.roleType}>{item.title}</option>
                                        )
                                }
                            </select>
                        </div>
                        <ul className="announcements__list">
                            {announs && 
                                announs.map((announ,index) => 
                                    <li className="announcements__box" key={index}>
                                    <div className="announcements__box-contain_content">
                                        <div className="announcements__box-title">
                                            <span className="announcements__createdAt"><b>date: </b>{format(new Date(announ.createdAt), "dd/MM/yyyy")}</span>
                                            <span className="announcements__courses"><b>Môn: </b>{getCoursesName(announ.courseIds)}</span>
                                        </div>
                                        <div className="announcements__title">
                                            <b>Tiêu đề: </b>{announ.title}
                                        </div>
                                        <div className="announcements__box-content">
                                            <b>Nội dung: </b>{announ.content}
                                        </div>
                                    </div>
                                    <div className="announcements__box-contain_actions">
                                        {/* <button className="announcements__config">Sửa</button> */}
                                        <button className="announcements__delete" onClick={() => {handleDeleteAnnouncement(announ.id)}}>Xóa</button>
                                    </div>
                                </li>
                                )
                                
                            }
                            
                        </ul>

                    </div>
                    <div className="announcements__create">
                        <h2 className="announcements__create-title">Tạo thông báo mới</h2>
                        <form className="announcements__create-form" method="POST" onSubmit={handleChooseCourses}>
                            <div className="announcements__create-formBox">
                                <label htmlFor="announ__title">Tiêu đề</label>
                                <input className="announcements__create-title" type="text" name="title" id="announ__title" value={data.title} onChange={handleChange}/>
                            </div>
                            <div className="announcements__create-formBox">
                                <label htmlFor="announ__visibly">Tới</label>
                                <div className="announcements__create-visiblyBox" id="announ__visibly">
                                    <input type="radio" name="roleVisibility" className="announcements__create-visibly-chooseOption" id="role_ALL" value={data.roleVisibility} onChange={handleChange}/>
                                    <label htmlFor="role_ALL">ALL</label>
                                    {roles && 
                                        roles.map((item, index) => (
                                            <div className="announcements__create-visibly-choose" key={index}>
                                                <input type="radio" name="roleVisibility" className="announcements__create-visibly-chooseOption" id={`role_${item.roleType}`} value={item.roleType} onChange={handleChange}/>
                                                <label htmlFor={`role_${item.roleType}`}>{item.title}</label>
                                            </div>
                                        ))
                                    }
                                    
                                </div>
                            </div>
                            <div className="announcements__create-formBox">
                                <label htmlFor="announ__content">Nội dung</label>
                                <textarea rows={5} className="announcements__create-content" name="content" id="announ__content" value={data.content} onChange={handleChange}/>
                            </div>
                    
                            <div className="announcements__create-actions">
                                    <button type="button" className="announcements__create-delete" onClick={handleDeleteData}>Xóa</button>
                                    <button type="submit" className="announcements__create-submit">Gửi</button>
                            </div>
                        </form>
                        
                    </div>
                </div>
            </div>
        </>
    )
}
export default Announcements;