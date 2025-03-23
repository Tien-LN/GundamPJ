import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import "./ShowDocs.scss";
import TinyEditor from "../../../components/TinyEditor";
function ShowDocs(){
    const {courseId, docsId} = useParams();
    const [doc, setDoc] = useState({});
    var docContent = useRef();
    const [user, setUser] = useState({});
    const [isEditing, setIsEditing] = useState(false);
    useEffect(()=> {
        const fetchApi = async()=>{
            try{
                const res_user = await axios.get(`http://localhost:3000/api/users/getPermission`, {
                    withCredentials: true
                });
        
                setUser(res_user.data);
            } catch(error){
                console.error("Lỗi khi lấy user", error);
            }
        }
        fetchApi();
    }, []);
    useEffect(() => {
        const fetchApi = async()=>{
            try{
                const res = await axios.get(`http://localhost:3000/api/docsCourse/${courseId}/${docsId}`, {
                    withCredentials: true
                });
               
                setDoc(res.data);
                docContent.current = res.data.content;
            } catch(error){
                console.error("Lỗi khi lấy docs", error);
            }
        }
        fetchApi();
    }, [isEditing]);
    const onOpenEdit = () => {
        setIsEditing(true);
    }
    const onCloseEdit = () => {
        setIsEditing(false);
    }
    const handleChange = (event) => {
        setDoc({
            ...doc,
            [event.target.name] : event.target.value
        });
    }
    const handleContentChange = (event) => {
        // console.log(event);
        setDoc({
            ...doc,
            ["content"]: event
        });
    }
    const handleSubmit = (event) => {
        event.preventDefault();
        const fetchApi = async() => {
            try{
                const res = await axios.patch(`http://localhost:3000/api/docsCourse/${courseId}/${docsId}`, doc, {
                    withCredentials: true
                });
                console.log(res.data);
                setIsEditing(false);
            } catch(error){
                console.error("Lỗi khi sửa doc", error);
            }
        }
        fetchApi();

    }
    // console.log(doc);
    return (
        <>
            <div className="docs">
                {isEditing ? 
                    <>
                        <form className="docs__form" method="POST" onSubmit={handleSubmit}>
                            <input name="title" className="docs__title-edit" value={doc.title} onChange={handleChange}/>
                            <TinyEditor initialValue={docContent.current} onChange={handleContentChange}></TinyEditor>
                            <div className="docs__actions">
                                <button className="docs__cancelled" onClick={onCloseEdit}>
                                    <i className="fa-solid fa-xmark"></i>
                                </button>
                                <button className="docs__done">
                                    <i className="fa-solid fa-check"></i>
                                </button>
                            </div>
                        </form>
                    </>
                    :
                    <>
                        <h1 className="docs__title">{doc.title}</h1>
                        <div className="docs__content">
                            <div dangerouslySetInnerHTML={{__html: doc.content}} />
                        </div>
                        <div className="docs__actions">
                            <button className="docs__edit" onClick={onOpenEdit}>
                                <i className="fa-solid fa-pen-to-square"></i>
                            </button>
                        </div>
                        
                    </>
                }
                
                
                
            </div>
        </>
    )
}
export default ShowDocs;