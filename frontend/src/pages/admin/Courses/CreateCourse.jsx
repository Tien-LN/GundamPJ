import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { handlePriceFormat } from "../../../helpers/admin/priceFormat";
function CreateCourse() {
    const navigate = useNavigate();
    const [teachers, setTeachers] = useState([]);
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);

    const [data, setData] = useState({
        name: "",
        description: "",
        startDate: null,
        endDate: null,
        teacherId: "",
        price: ""
    });
    
    const handleChange = (e) => {
        // console.log(e);
        setData({
            ...data,
            [e.target.name]: e.target.value
        });
    }
    const handleDateChange = (date, name) => {
        setData((prevData) => ({
            ...prevData,
            [name]: date
        }));
    }
    useEffect(() => {
        const fetchApi = async (req, res) => {
            try {
                const res = await axios("http://localhost:3000/api/users", {
                    withCredentials: true
                });

                // console.log(res);
                const newData = res.data.filter(item => item.role?.roleType === "TEACHER");
                setTeachers(newData);
            } catch (error) {
                console.error("Lỗi", error.request?.statusText || error.message);
            }
        }
        fetchApi();
    }, []);
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!data.startDate || !data.endDate) {
            alert("Vui lòng chọn ngày bắt đầu và ngày kết thúc!");
            return;
        }

        if (data.endDate < data.startDate) {
            alert("Ngày kết thúc không thể sớm hơn ngày bắt đầu!");
            return;
        }

        if(!data.price){
            alert("Vui lòng nhập giá !");
            return;
        }

        const course = {
            name: data.name,
            description: data.description,
            price: data.price,
            startDate: data.startDate,
            endDate: data.endDate,
            teacherId: data.teacherId
        };
    
        try {
            const res = await axios.post("http://localhost:3000/api/courses/create", course, {
                headers: {
                    "Content-Type": "application/json"
                },
                withCredentials: true
            });
            // console.log(res.data);
            if (image) {
                const formData = new FormData();
                formData.append("file", image);
                formData.append("type", "course");
                formData.append("courseId", res.data.id);

                const upload = await axios.post("http://localhost:3000/api/upload", formData, {
                    headers: {
                        "Content-Type": "multipart/form-data"
                    },
                    withCredentials: true

                });
                console.log("Tạo khóa học thành công !!");
                navigate("/admin/courses");
            }
        } catch (error) {
            console.error("Lỗi", error);
        }
    }
    const handleFileChange = (e) => {
        const file = e.target.files[0];

        if (file) {
            setImage(file);

            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result);
            }
            reader.readAsDataURL(file);
        }
    }
    return (
        <>
            <div className="createCourses">
                <h1 className="createCourses__title">Trang tạo khóa học</h1>
                <form className="createCourses__form" onSubmit={handleSubmit} method="POST">
                    <div className="createCourses__box">
                        <label htmlFor="createCourses__name">Tên khóa học</label>
                        <input type="text" className="createCourses__name" name="name" value={data.name} id="createCourses__name" onChange={handleChange} />
                    </div>
                    <div className="createCourses__box">
                        <label htmlFor="createCourses__teacher">Giáo viên</label>
                        <select className="createCourses__teacher" id="createCourses__teacher" name="teacherId" value={data.teacherId} onChange={handleChange}>
                            <option value="" disabled>------Chọn giáo viên------</option>
                            {teachers &&
                                teachers.map((item) => (
                                    <option value={item.id} key={item.id}>{item.name}</option>
                                ))}
                        </select>
                    </div>
                    <div className="createCourses__box">
                        <label htmlFor="createCourses__price">Giá: </label>
                        <div className="createCourses__boxPrice">
                            <input type="number" className="createCourses__price" id="createCourses__price" name="price" min="0" value={data.price} onChange={handleChange}/>
                            <label htmlFor="createCourses__price">{handlePriceFormat(data.price) || "___"}</label>
                        </div>
                    </div>
                        
                    <div className="createCourses__box">
                        <label htmlFor="createCourses__description">Mô tả khóa học</label>
                        <textarea className="createCourses__description" name="description" rows={5} id="createCourses__description" value={data.description} onChange={handleChange} />
                    </div>

                    <div className="createCourses__box">
                        <input type="file" accept="image/*" onChange={handleFileChange} />
                        {preview && <img src={preview} alt="ảnh minh họa" data-preview-img />}
                    </div>

                    <div className="createCourses__box">
                        <label htmlFor="startDate">Ngày bắt đầu</label>

                        <DatePicker
                            selected={data.startDate}
                            onChange={(date) => handleDateChange(date, "startDate")}
                            dateFormat="dd/MM/yyyy"
                            placeholderText="Chọn ngày"
                            id="startDate"
                            name="startDate"
                            className="createCourses__startDate"
                        />
                    </div>

                    <div className="createCourses__box">
                        <label htmlFor="endDate">Ngày kết thúc</label>
                        <DatePicker
                            selected={data.endDate}
                            onChange={(date) => handleDateChange(date, "endDate")}
                            dateFormat="dd/MM/yyyy"
                            placeholderText="Chọn ngày"
                            id="endDate"
                            name="endDate"
                            className="createCourses__endDate"
                        />
                    </div>

                    <div className="createCourses__box">
                        <button type="submit" className="createCourses__submit">Tạo mới</button>
                    </div>

                </form>
            </div>
        </>
    )
}
export default CreateCourse;