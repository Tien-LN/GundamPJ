// Xử lý gọi API và lấy dữ liệu

/**
 * Lấy thông tin thống kê của người dùng
 * @param {string} userId - ID của người dùng
 * @returns {Promise<Object>} - Thông tin thống kê
 */
async function getUserStatistics(userId) {
  try {
    const response = await fetch(`${API_URL}/statistics/user/${userId}`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(
        error.message || "Không thể lấy thông tin thống kê người dùng"
      );
    }

    return await response.json();
  } catch (error) {
    console.error("Get user statistics error:", error);
    throw error;
  }
}

/**
 * Lấy thông tin thống kê của học viên
 * @param {string} studentId - ID của học viên
 * @returns {Promise<Object>} - Thông tin thống kê
 */
async function getStudentStatistics(studentId) {
  try {
    const response = await fetch(`${API_URL}/statistics/student/${studentId}`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Không thể lấy thông tin thống kê");
    }

    return await response.json();
  } catch (error) {
    console.error("Get student statistics error:", error);
    throw error;
  }
}

/**
 * Lấy danh sách học viên trong khóa học
 * @param {string} courseId - ID của khóa học
 * @returns {Promise<Array>} - Danh sách học viên
 */
async function getCourseStudents(courseId) {
  try {
    const response = await fetch(
      `${API_URL}/statistics/course/${courseId}/students`,
      {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Không thể lấy danh sách học viên");
    }

    return await response.json();
  } catch (error) {
    console.error("Get course students error:", error);
    throw error;
  }
}

/**
 * Lấy danh sách khóa học
 * @returns {Promise<Array>} - Danh sách khóa học
 */
async function getCourses() {
  try {
    const response = await fetch(`${API_URL}/courses`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Không thể lấy danh sách khóa học");
    }

    return await response.json();
  } catch (error) {
    console.error("Get courses error:", error);
    throw error;
  }
}

/**
 * Điểm danh học viên
 * @param {string} studentId - ID của học viên
 * @param {string} courseId - ID của khóa học
 * @param {string} meetingId - ID của buổi học
 * @param {boolean} isPresent - Trạng thái điểm danh
 * @returns {Promise<Object>} - Kết quả điểm danh
 */
async function markAttendance(studentId, courseId, meetingId, isPresent) {
  try {
    const response = await fetch(`${API_URL}/attendance/mark`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        studentId,
        courseId,
        meetingId,
        isPresent,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Không thể điểm danh");
    }

    return await response.json();
  } catch (error) {
    console.error("Mark attendance error:", error);
    throw error;
  }
}

/**
 * Lấy token xác thực từ storage
 * @returns {Promise<string>} - Token xác thực
 */
async function getAuthToken() {
  try {
    const data = await chrome.storage.local.get(["authToken"]);
    if (!data.authToken) {
      throw new Error("Chưa đăng nhập");
    }
    return data.authToken;
  } catch (error) {
    console.error("Get auth token error:", error);
    throw error;
  }
}

window.getUserStatistics = getUserStatistics;
window.getStudentStatistics = getStudentStatistics;
window.getCourseStudents = getCourseStudents;
window.getCourses = getCourses;
window.markAttendance = markAttendance;
window.getAuthToken = getAuthToken;
