// Xử lý gọi API và lấy dữ liệu

/**
 * Lấy thông tin thống kê của người dùng
 * @param {string} userId - ID của người dùng
 * @returns {Promise<Object>} - Thông tin thống kê
 */
async function getUserStatistics(userId) {
  try {
    if (!userId) {
      throw new Error("UserId không được để trống");
    }

    const response = await fetch(`${API_URL}/statistics/user/${userId}`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      let errorMessage = "Không thể lấy thông tin thống kê người dùng";

      try {
        const error = JSON.parse(errorText);
        errorMessage = error.message || errorMessage;
      } catch (e) {
        // Nếu không parse được JSON thì sử dụng text gốc
        errorMessage = errorText || errorMessage;
      }

      throw new Error(errorMessage);
    }

    const data = await response.json();
    return data;
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
    if (!studentId) {
      throw new Error("StudentId không được để trống");
    }

    const response = await fetch(`${API_URL}/statistics/student/${studentId}`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      let errorMessage = "Không thể lấy thông tin thống kê";

      try {
        const error = JSON.parse(errorText);
        errorMessage = error.message || errorMessage;
      } catch (e) {
        errorMessage = errorText || errorMessage;
      }

      throw new Error(errorMessage);
    }

    const data = await response.json();
    return data;
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
    if (!studentId || !courseId || !meetingId) {
      throw new Error("Thiếu thông tin cần thiết để điểm danh");
    }

    console.log("Marking attendance with data:", {
      studentId,
      courseId,
      meetingId,
      isPresent,
    });

    // Lấy thông tin user hiện tại
    const userData = await chrome.storage.local.get(["userData"]);
    if (!userData || !userData.userData) {
      throw new Error("Vui lòng đăng nhập để điểm danh");
    }

    // Chuẩn bị headers
    const headers = {
      "Content-Type": "application/json",
    };

    // Thêm token nếu có
    try {
      const token = await getBestAuthToken();
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
        console.log("Using auth token:", token.substring(0, 10) + "...");
      } else {
        console.warn("Không tìm thấy token, sử dụng cookie để xác thực");
      }
    } catch (error) {
      console.warn("Lỗi khi lấy token:", error);
    }
    // Tạo payload theo cấu trúc schema Attendance
    const response = await fetch(`${API_URL}/attendance`, {
      method: "POST",
      credentials: "include",
      headers,
      body: JSON.stringify({
        userId: studentId, // ID của học viên (theo schema)
        lessonId: meetingId, // ID của buổi học (theo schema)
        attended: isPresent, // Trạng thái điểm danh (theo schema)
        // Các trường bổ sung để tương thích với API
        studentId: studentId, // Để tương thích với controller cũ
        courseId: courseId, // Để hỗ trợ kiểm tra lesson thuộc course
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      let errorMessage = "Không thể điểm danh";

      try {
        const error = JSON.parse(errorText);
        errorMessage = error.message || error.error || errorMessage;
        console.error("Attendance API error details:", error);
      } catch (e) {
        console.error("Attendance API raw error:", errorText);
        errorMessage = errorText || errorMessage;
      }

      throw new Error(errorMessage);
    }

    const result = await response.json();
    console.log("Attendance API success:", result);
    return result;
  } catch (error) {
    console.error("Mark attendance error:", error);
    throw error;
  }
}

/**
 * Kiểm tra trạng thái điểm danh của học viên
 * @param {string} studentId - ID của học viên
 * @param {string} lessonId - ID của buổi học
 * @returns {Promise<Object>} - Thông tin điểm danh
 */
async function checkAttendanceStatus(studentId, lessonId) {
  try {
    if (!studentId || !lessonId) {
      throw new Error("Thiếu thông tin học viên hoặc buổi học");
    }

    const response = await fetch(`${API_URL}/attendance/status`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        studentId,
        lessonId,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      let errorMessage = "Không thể kiểm tra trạng thái điểm danh";

      try {
        const error = JSON.parse(errorText);
        errorMessage = error.message || errorMessage;
      } catch (e) {
        errorMessage = errorText || errorMessage;
      }

      throw new Error(errorMessage);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Check attendance status error:", error);
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

/**
 * Lấy token xác thực từ nhiều nguồn khác nhau
 * @returns {Promise<string|null>} - Token xác thực hoặc null nếu không có
 */
async function getBestAuthToken() {
  try {
    // Thử lấy từ local storage trước
    const data = await chrome.storage.local.get(["authToken"]);
    if (data.authToken) {
      console.log("Using token from storage");
      return data.authToken;
    }

    // Thử lấy từ cookie thông qua background script
    try {
      const response = await new Promise((resolve) => {
        chrome.runtime.sendMessage(
          { type: "GET_AUTH_COOKIES", apiUrl: API_URL },
          (response) => {
            resolve(response);
          }
        );
      });

      if (response && response.token) {
        console.log("Using token from cookies");
        return response.token;
      }
    } catch (e) {
      console.warn("Could not get token from cookies:", e);
    }

    // Thử lấy từ userData
    const userData = await chrome.storage.local.get(["userData"]);
    if (userData.userData && userData.userData.token) {
      console.log("Using token from userData");
      return userData.userData.token;
    }

    // Thử lấy từ fullUserData
    const fullUserData = await chrome.storage.local.get(["fullUserData"]);
    if (fullUserData.fullUserData && fullUserData.fullUserData.token) {
      console.log("Using token from fullUserData");
      return fullUserData.fullUserData.token;
    }

    console.warn("No auth token found in any source");
    return null;
  } catch (error) {
    console.error("Get best auth token error:", error);
    return null;
  }
}

/**
 * Lấy danh sách buổi học của khóa học
 * @param {string} courseId - ID của khóa học
 * @returns {Promise<Array>} - Danh sách buổi học
 */
async function getCourseMeetings(courseId) {
  try {
    if (!courseId) {
      throw new Error("Cần cung cấp ID khóa học");
    }

    console.log("Fetching meetings for course:", courseId);

    const response = await fetch(`${API_URL}/lessons/${courseId}/lessons`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Không thể lấy danh sách buổi học");
    }

    const meetings = await response.json();

    // Sắp xếp buổi học theo thời gian (mới nhất lên đầu)
    if (Array.isArray(meetings)) {
      return meetings
        .sort((a, b) => {
          const dateA = a.date ? new Date(a.date) : new Date(0);
          const dateB = b.date ? new Date(b.date) : new Date(0);
          return dateB - dateA;
        })
        .map((meeting) => ({
          ...meeting,
          name:
            meeting.name ||
            (meeting.date
              ? new Date(meeting.date).toLocaleDateString("vi-VN")
              : `Buổi học ${meeting.id}`),
        }));
    }

    return meetings;
  } catch (error) {
    console.error("Get course meetings error:", error);
    throw error;
  }
}

/**
 * Kiểm tra kết nối tới API server
 * @returns {Promise<boolean>} - true nếu kết nối thành công, false nếu không
 */
async function checkApiConnection() {
  try {
    console.log("Checking API connection to:", API_URL);

    const response = await fetch(`${API_URL}/auth/check`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      // Thêm cache: 'no-store' để tránh cache
      cache: "no-store",
    });

    console.log("API connection check result:", response.status);
    return response.ok;
  } catch (error) {
    console.error("API connection check failed:", error);
    return false;
  }
}

/**
 * Tải lên hình ảnh điểm danh
 * @param {string} imageData - Dữ liệu hình ảnh (base64)
 * @param {string} userId - ID của học viên
 * @param {string} lessonId - ID của buổi học
 * @returns {Promise<Object>} - Kết quả tải lên
 */
async function uploadAttendanceImage(imageData, userId, lessonId) {
  try {
    if (!imageData || !userId || !lessonId) {
      throw new Error("Thiếu thông tin hình ảnh, học viên hoặc buổi học");
    }

    // Lấy token xác thực
    const token = await getBestAuthToken();
    const headers = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_URL}/cloudinary/upload`, {
      method: "POST",
      credentials: "include",
      headers,
      body: JSON.stringify({
        image: imageData,
        userId,
        lessonId,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      let errorMessage = "Không thể tải lên hình ảnh điểm danh";

      try {
        const error = JSON.parse(errorText);
        errorMessage = error.error || errorMessage;
      } catch (e) {
        errorMessage = errorText || errorMessage;
      }

      throw new Error(errorMessage);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Upload attendance image error:", error);
    throw error;
  }
}

/**
 * Xác minh hình ảnh điểm danh
 * @param {string} imageId - ID của hình ảnh
 * @param {boolean} approve - Xác nhận hay từ chối
 * @param {string} userId - ID của học viên
 * @param {string} lessonId - ID của buổi học
 * @returns {Promise<Object>} - Kết quả xác minh
 */
async function verifyAttendanceImage(imageId, approve, userId, lessonId) {
  try {
    // Lấy token xác thực
    const token = await getBestAuthToken();
    const headers = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
    const response = await fetch(`${API_URL}/cloudinary/verify`, {
      method: "POST",
      credentials: "include",
      headers,
      body: JSON.stringify({
        attendanceImageId: imageId,
        verified: approve,
        userId,
        lessonId,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      let errorMessage = "Không thể xác minh hình ảnh điểm danh";

      try {
        const error = JSON.parse(errorText);
        errorMessage = error.error || errorMessage;
      } catch (e) {
        errorMessage = errorText || errorMessage;
      }

      throw new Error(errorMessage);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Verify attendance image error:", error);
    throw error;
  }
}

/**
 * Lấy hình ảnh điểm danh
 * @param {string} userId - ID của học viên
 * @param {string} lessonId - ID của buổi học
 * @returns {Promise<Object>} - Thông tin hình ảnh điểm danh
 */
async function getAttendanceImage(userId, lessonId) {
  try {
    if (!userId || !lessonId) {
      throw new Error("Thiếu thông tin học viên hoặc buổi học");
    }

    // Lấy token xác thực
    const token = await getBestAuthToken();
    const headers = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(
      `${API_URL}/cloudinary/attendance/${userId}/${lessonId}`,
      {
        method: "GET",
        credentials: "include",
        headers,
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      let errorMessage = "Không thể lấy hình ảnh điểm danh";

      try {
        const error = JSON.parse(errorText);
        errorMessage = error.error || errorMessage;
      } catch (e) {
        errorMessage = errorText || errorMessage;
      }

      throw new Error(errorMessage);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Get attendance image error:", error);
    throw error;
  }
}

// Kiểm tra kết nối khi script được load
checkApiConnection().then((isConnected) => {
  console.log(
    "API connection status:",
    isConnected ? "Connected" : "Disconnected"
  );

  // Lưu trạng thái kết nối
  chrome.storage.local.set({ apiConnectionStatus: isConnected });
});

window.getUserStatistics = getUserStatistics;
window.getStudentStatistics = getStudentStatistics;
window.getCourseStudents = getCourseStudents;
window.getCourses = getCourses;
window.markAttendance = markAttendance;
window.checkAttendanceStatus = checkAttendanceStatus;
window.getAuthToken = getAuthToken;
window.getBestAuthToken = getBestAuthToken;
window.getCourseMeetings = getCourseMeetings;
window.checkApiConnection = checkApiConnection;
window.uploadAttendanceImage = uploadAttendanceImage;
window.verifyAttendanceImage = verifyAttendanceImage;
window.getAttendanceImage = getAttendanceImage;
