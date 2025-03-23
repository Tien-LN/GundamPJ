import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";

import axios from "axios";
import TinyEditor from "../../../components/TinyEditor";
function AddDocs(){
    const {courseId} = useParams();
    const [data, setData] = useState({
        title: "",
        content: "",
        courseId: courseId
    });
    const navigate = useNavigate();
    // console.log(courseId);
    console.log(data);
    const handleChange = (event) => {
        // console.log(event);
        setData({
            ...data,    
            [event.target.name]: event.target.value
        });
    }
    const handleContentChange = (event) => {
        // console.log(event);
        setData({
            ...data,
            ["content"]: event
        });
    }
    const handleSubmit = (event) => {
        event.preventDefault();
        const fetchApi = async() => {
            try{
                 const res = await axios.post(`http://localhost:3000/api/docsCourse/${courseId}`, data, {
                    withCredentials: true
                 });

                 navigate(`/courses/${courseId}`);
            } catch(error) {
                console.error("Lỗi khi tạo bài giảng", error);
            }
        }
        fetchApi();
    }
    return (
        <>
            <div className="addDocs" method="POST" onSubmit={handleSubmit}>
                <h1 className="addDocs__intro">Thêm tài liệu cho bài</h1>
                <form className="addDocs__form"> 
                    <div className="addDocs__box">
                        <label htmlFor="doc__title">Tiêu đề</label>
                        <input className="addDocs__title" id="doc__title" name="title" value={data.title} onChange={handleChange}/>
                    </div>
                    <div className="addDocs__box">
                        <label htmlFor="doc__content">Nội dung</label>
                        <TinyEditor initialValue="" onChange={handleContentChange} />
                        {/* <textarea className="addDocs__content" id="doc__content" name="content" value={data.content} onChange={handleChange}/> */}
                    </div>
                    <div className="addDocs__box">
                        <button type="submit" className="addDocs__submit">Tạo mới</button>
                    </div>
                </form>
            </div>
        </>
    )
}
export default AddDocs;