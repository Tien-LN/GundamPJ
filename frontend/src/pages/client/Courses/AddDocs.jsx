import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import TinyEditor from "../../../components/TinyEditor";
function AddDocs() {
  const { courseId } = useParams();
  const [data, setData] = useState({
    title: "",
    content: "",
    courseId: courseId,
    files: []
  });
  
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: acceptedFiles => {
      setData(prev => ({
        ...prev,
        files: [...prev.files, ...acceptedFiles]
      }));
    },
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/vnd.ms-powerpoint': ['.ppt'],
      'application/vnd.openxmlformats-officedocument.presentationml.presentation': ['.pptx'],
      'text/plain': ['.txt']
    },
    maxSize: 10 * 1024 * 1024 // 10MB
  });
  const [user, setUser] = useState({});
  const [course, setCourse] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Kiểm tra quyền truy cập
  useEffect(() => {
    const checkPermission = async () => {
      try {
        setLoading(true);
        // Lấy thông tin người dùng
        const userRes = await axios.get(
          `http://localhost:3000/api/users/getPermission`,
          { withCredentials: true }
        );

        // Lấy thông tin khóa học
        const courseRes = await axios.get(
          `http://localhost:3000/api/courses/${courseId}`,
          { withCredentials: true }
        );

        setUser(userRes.data);
        setCourse(courseRes.data);
        setLoading(false);

        // Kiểm tra nếu không phải giáo viên phụ trách khóa học thì chuyển hướng
        if (
          userRes.data.role !== "TEACHER" ||
          userRes.data.id !== courseRes.data.teacher?.id
        ) {
          setError("Bạn không có quyền thêm bài học cho khóa học này");
          setTimeout(() => {
            navigate(`/courses/${courseId}`);
          }, 2000);
        }
      } catch (error) {
        console.error("Lỗi khi kiểm tra quyền truy cập", error);
        setError("Có lỗi xảy ra khi kiểm tra quyền truy cập");
        setLoading(false);
        setTimeout(() => {
          navigate(`/courses/${courseId}`);
        }, 2000);
      }
    };

    checkPermission();
  }, [courseId, navigate]);

  const handleChange = (event) => {
    setData({
      ...data,
      [event.target.name]: event.target.value,
    });
  };

  const handleContentChange = (event) => {
    setData({
      ...data,
      ["content"]: event,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    try {
      const formData = new FormData();
      formData.append('title', data.title);
      formData.append('content', data.content);
      formData.append('courseId', courseId);
      
      // Add files if any
      data.files.forEach(file => {
        formData.append('files', file);
      });
      
      const res = await axios.post(
        `http://localhost:3000/api/docsCourse/${courseId}`,
        formData,
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      navigate(`/courses/${courseId}`);
    } catch (error) {
      console.error("Lỗi khi tạo bài giảng", error);
      setError("Có lỗi xảy ra khi tạo bài giảng");
    }
  };
  
  const removeFile = (index) => {
    setData(prev => ({
      ...prev,
      files: prev.files.filter((_, i) => i !== index)
    }));
  };
  // Hiển thị trạng thái loading
  if (loading) {
    return (
      <div className="courses-loading">
        <div className="spinner">
          <i className="fa-solid fa-spinner fa-spin"></i>
        </div>
        <p>Đang tải thông tin...</p>
      </div>
    );
  }

  // Hiển thị thông báo lỗi nếu không có quyền truy cập
  if (error && !user.id) {
    return (
      <div className="courses-error">
        <i className="fa-solid fa-circle-exclamation"></i>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <>
      <div className="addDocs">
        <h1 className="addDocs__intro">Thêm tài liệu cho bài</h1>
        {error && (
          <div
            className="addDocs__error"
            style={{ color: "red", marginBottom: "15px" }}
          >
            <i className="fa-solid fa-circle-exclamation"></i>
            <span style={{ marginLeft: "8px" }}>{error}</span>
          </div>
        )}
        <form className="addDocs__form" onSubmit={handleSubmit} {...getRootProps()}>
          <div className="addDocs__box">
            <label htmlFor="doc__title">Tiêu đề</label>
            <input
              className="addDocs__title"
              id="doc__title"
              name="title"
              value={data.title}
              onChange={handleChange}
              required
            />
          </div>
          <div className="addDocs__box">
            <label htmlFor="doc__content">Nội dung</label>
            <TinyEditor initialValue="" onChange={handleContentChange} />
            {/* <textarea className="addDocs__content" id="doc__content" name="content" value={data.content} onChange={handleChange}/> */}
          </div>
          <div className="addDocs__box">
            <input {...getInputProps()} />
            {isDragActive ? (
              <div className="addDocs__dropzone">
                <i className="fa-solid fa-file-arrow-up"></i>
                <p>Thả tệp vào đây để tải lên</p>
              </div>
            ) : (
              <p className="addDocs__drop-hint">
                Kéo thả tệp vào đây, hoặc click để chọn tệp
              </p>
            )}
            
            {data.files.length > 0 && (
              <div className="addDocs__file-list">
                <h4>Tệp đã chọn:</h4>
                <ul>
                  {data.files.map((file, index) => (
                    <li key={index}>
                      <span>{file.name}</span>
                      <button 
                        type="button" 
                        onClick={() => removeFile(index)}
                        className="addDocs__remove-file"
                      >
                        <i className="fa-solid fa-xmark"></i>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            <button type="submit" className="addDocs__submit">
              Tạo mới
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
export default AddDocs;
