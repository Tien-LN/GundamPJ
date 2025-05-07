import axios from "axios";
import { useState, useEffect } from "react";
import EnrollmentStatus from "./EnrollmentStatus";
function ModalEnrollment({ fnClose }) {
  const [data, setData] = useState([]);
  useEffect(() => {
    const fetchApi = async () => {
      try {
        const res = await axios.get(
          "http://localhost:3000/api/enrollments/my-account",
          {
            withCredentials: true,
          }
        );
        setData(res.data);
      } catch (error) {
        console.log("Lỗi ", error);
      }
    };
    fetchApi();
  }, []);
  const handleClickOutSide = (event) => {
    const ModalEnroll = document.querySelector("#modalEnrollShow");
    if (event.target == ModalEnroll) {
      fnClose();
    }
  };
  // console.log(data);
  return (
    <>
      <div
        className="enrollments__request"
        id="modalEnrollShow"
        onClick={handleClickOutSide}
      >
        <div className="enrollments__showRequests">
          <h2 className="enrollments__showRequests-title">
            Các yêu cầu đã gửi
          </h2>
          <table className="enrollments__showRequests-table">
            <thead>
              <tr>
                <th>STT</th>
                <th>Tên môn</th>
                <th>Giáo viên</th>
                <th>Tình trạng</th>
              </tr>
            </thead>
            <tbody>
              {data &&
                data.map((item, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{item.courseName}</td>
                    <td>{item.courseTeacher}</td>
                    <td>
                      <EnrollmentStatus status={item.status} />
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
export default ModalEnrollment;
