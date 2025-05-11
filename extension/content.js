// Thêm giao diện thống kê vào Google Meet
function createStatisticsPanel() {
  const panel = document.createElement("div");
  panel.id = "gundam-stats-panel";
  panel.style.cssText = `
    position: fixed;
    right: 20px;
    top: 80px;
    width: 300px;
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    padding: 16px;
    z-index: 9999;
    display: none;
  `;

  panel.innerHTML = `
    <div class="stats-header" style="margin-bottom: 16px;">
      <h3 style="margin: 0; font-size: 16px;">Thống kê học viên</h3>
      <button id="close-stats" style="position: absolute; right: 8px; top: 8px; background: none; border: none; cursor: pointer;">✕</button>
    </div>
    <div id="stats-content"></div>
  `;

  document.body.appendChild(panel);

  // Đóng panel khi click nút close
  document.getElementById("close-stats").addEventListener("click", () => {
    panel.style.display = "none";
  });
}

// Lấy thông tin thống kê từ API
async function fetchUserStatistics(userId) {
  try {
    const response = await fetch(
      `http://localhost:3000/api/statistics/${userId}`
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching statistics:", error);
    return null;
  }
}

// Hiển thị thông tin thống kê
function displayStatistics(stats) {
  const content = document.getElementById("stats-content");
  if (!stats) {
    content.innerHTML = "<p>Không thể tải thông tin thống kê</p>";
    return;
  }

  let html = "";
  stats.courseStats.forEach((course) => {
    html += `
      <div class="course-stats" style="margin-bottom: 16px;">
        <h4 style="margin: 0 0 8px 0;">${course.courseName}</h4>
        <p>Tiến độ: ${course.completedLessons}/${
      course.totalLessons
    } bài học</p>
        <p>Điểm danh: ${
          stats.attendanceStats[course.courseId]?.attended || 0
        }/${stats.attendanceStats[course.courseId]?.total || 0} buổi</p>
        ${course.examStats
          .map(
            (exam) => `
          <div class="exam-stats" style="margin-left: 16px;">
            <p>${exam.examTitle}</p>
            <p>Điểm: ${exam.averageScore.toFixed(1)}</p>
            <p>Thời gian: ${Math.round(exam.totalTime / 60)} phút</p>
          </div>
        `
          )
          .join("")}
      </div>
    `;
  });

  content.innerHTML = html;
}

// Thêm nút thống kê vào menu của người tham gia
function addStatisticsButton(participantItem) {
  const menuButton = participantItem.querySelector('[role="button"]');
  if (!menuButton) return;

  chrome.storage.local.get(["userData"], async (data) => {
    if (!data.userData) return;

    const userRole = data.userData.roleType;
    const currentUserId = data.userData.id;

    // Thêm nút hiển thị thông kê
    const statsButton = document.createElement("button");
    statsButton.textContent = "Xem thống kê";
    statsButton.style.cssText = `
      background: none;
      border: none;
      color: #1a73e8;
      cursor: pointer;
      padding: 8px;
      margin-left: 8px;
    `;

    statsButton.addEventListener("click", async () => {
      const panel = document.getElementById("gundam-stats-panel");

      if (userRole === "STUDENT") {
        const stats = await getUserStatistics(currentUserId);
        panel.style.display = "block";
        displayStatistics(stats);
      } else if (userRole === "ADMIN" || userRole === "TEACHER") {
        showCourseSelection(panel);
      }
    });

    menuButton.parentElement.appendChild(statsButton);

    // Thêm nút điểm danh (chỉ cho Teacher hoặc Admin)
    if (userRole === "ADMIN" || userRole === "TEACHER") {
      const attendButton = document.createElement("button");
      attendButton.textContent = "Điểm danh";
      attendButton.style.cssText = `
        background: none;
        border: none;
        color: #188038;
        cursor: pointer;
        padding: 8px;
        margin-left: 8px;
      `;

      attendButton.addEventListener("click", async () => {
        showAttendanceMarkingPanel(participantItem);
      });

      menuButton.parentElement.appendChild(attendButton);
    }
  });
}

async function showCourseSelection(panel) {
  try {
    const courses = await getCourses();

    let html = `
      <div class="course-selection">
        <h4>Chọn khóa học</h4>
        <div class="course-list">
    `;

    courses.forEach((course) => {
      html += `
        <div class="course-item" data-course-id="${course.id}" style="margin: 8px 0; cursor: pointer; padding: 8px; border: 1px solid #eee; border-radius: 4px;">
          ${course.name}
        </div>
      `;
    });

    html += `</div></div>`;

    const content = document.getElementById("stats-content");
    content.innerHTML = html;
    panel.style.display = "block";

    document.querySelectorAll(".course-item").forEach((item) => {
      item.addEventListener("click", async () => {
        const courseId = item.getAttribute("data-course-id");
        showCourseStudents(courseId);
      });
    });
  } catch (error) {
    console.error("Error fetching courses:", error);
  }
}

async function showCourseStudents(courseId) {
  try {
    const students = await getCourseStudents(courseId);

    let html = `
      <div class="students-list">
        <h4>Danh sách học viên</h4>
        <button id="back-to-courses" style="margin-bottom: 16px; padding: 4px 8px;">← Quay lại</button>
        <div class="students">
    `;

    students.forEach((enrollment) => {
      html += `
        <div class="student-item" data-student-id="${enrollment.user.id}" style="margin: 8px 0; cursor: pointer; padding: 8px; border: 1px solid #eee; border-radius: 4px;">
          ${enrollment.user.name}
        </div>
      `;
    });

    html += `</div></div>`;

    const content = document.getElementById("stats-content");
    content.innerHTML = html;

    document.querySelectorAll(".student-item").forEach((item) => {
      item.addEventListener("click", async () => {
        const studentId = item.getAttribute("data-student-id");
        showStudentStatistics(studentId);
      });
    });

    document.getElementById("back-to-courses").addEventListener("click", () => {
      const panel = document.getElementById("gundam-stats-panel");
      showCourseSelection(panel);
    });
  } catch (error) {
    console.error("Error fetching students:", error);
  }
}

async function showStudentStatistics(studentId) {
  try {
    const stats = await getStudentStatistics(studentId);

    let html = `
      <div class="student-statistics">
        <h4>${stats.name} - Thống kê</h4>
        <button id="back-to-students" style="margin-bottom: 16px; padding: 4px 8px;">← Quay lại</button>
    `;

    if (stats.enrollments && stats.enrollments.length > 0) {
      stats.enrollments.forEach((enrollment) => {
        const course = enrollment.course;

        html += `
          <div class="course-stats" style="margin-bottom: 16px;">
            <h5 style="margin: 0 0 8px 0;">${course.name}</h5>
            <p>Tiến độ: ${
              course.lessons.filter((lesson) => lesson.date <= new Date())
                .length
            }/${course.lessons.length} bài học</p>
        `;

        if (course.exams && course.exams.length > 0) {
          course.exams.forEach((exam) => {
            if (exam.UserExam && exam.UserExam.length > 0) {
              const userExam = exam.UserExam[0];

              html += `
                <div class="exam-stats" style="margin-left: 16px;">
                  <p>${exam.title}</p>
              `;

              if (userExam.userAnswers && userExam.userAnswers.length > 0) {
                const totalScore = userExam.userAnswers.reduce(
                  (sum, answer) => sum + (answer.score || 0),
                  0
                );
                const averageScore = totalScore / userExam.userAnswers.length;

                html += `
                  <p>Điểm: ${averageScore.toFixed(1)}</p>
                `;
              }

              html += `</div>`;
            }
          });
        }

        html += `</div>`;
      });
    } else {
      html += `<p>Không có dữ liệu khóa học</p>`;
    }

    html += `</div>`;

    const content = document.getElementById("stats-content");
    content.innerHTML = html;

    document
      .getElementById("back-to-students")
      .addEventListener("click", () => {
        const panel = document.getElementById("gundam-stats-panel");
        showCourseSelection(panel);
      });
  } catch (error) {
    console.error("Error fetching student statistics:", error);
  }
}

// Theo dõi thay đổi DOM để thêm nút thống kê
function observeParticipantsList() {
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType === 1 && node.getAttribute("role") === "listitem") {
          addStatisticsButton(node);
        }
      });
    });
  });

  // Bắt đầu theo dõi danh sách người tham gia
  const participantsList = document.querySelector('[role="list"]');
  if (participantsList) {
    observer.observe(participantsList, { childList: true, subtree: true });
  }
}

// Khởi tạo extension
function initializeExtension() {
  createStatisticsPanel();
  createAttendancePanel();
  observeParticipantsList();
}

// Tạo panel điểm danh học viên
function createAttendancePanel() {
  const panel = document.createElement("div");
  panel.id = "gundam-attendance-panel";
  panel.style.cssText = `
    position: fixed;
    right: 20px;
    top: 80px;
    width: 320px;
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    padding: 16px;
    z-index: 9999;
    display: none;
  `;

  panel.innerHTML = `
    <div class="attendance-header" style="margin-bottom: 16px;">
      <h3 style="margin: 0; font-size: 16px;">Điểm danh học viên</h3>
      <button id="close-attendance" style="position: absolute; right: 8px; top: 8px; background: none; border: none; cursor: pointer;">✕</button>
    </div>
    <div id="attendance-content"></div>
  `;

  document.body.appendChild(panel);

  // Đóng panel khi click nút close
  document.getElementById("close-attendance").addEventListener("click", () => {
    panel.style.display = "none";
  });
}

// Hiển thị panel điểm danh học viên
async function showAttendanceMarkingPanel(participantItem) {
  try {
    // Lấy thông tin học viên từ participantItem
    const studentName =
      participantItem.querySelector("[data-self-name]")?.innerText ||
      participantItem.querySelector("[data-participant-id]")?.innerText ||
      "Học viên";

    const panel = document.getElementById("gundam-attendance-panel");
    const content = panel.querySelector("#attendance-content");

    // Lấy danh sách khóa học
    const courses = await getCourses();

    if (!courses || courses.length === 0) {
      content.innerHTML = "<p>Không có khóa học nào.</p>";
      panel.style.display = "block";
      return;
    }

    let html = `
      <div style="margin-bottom: 12px;">
        <p style="margin-top: 0;"><b>Học viên:</b> ${studentName}</p>
      </div>
      
      <div style="margin-bottom: 16px;">
        <label style="display: block; margin-bottom: 8px; font-weight: bold;">Chọn khóa học:</label>
        <select id="attendance-course-select" style="width: 100%; padding: 8px; border-radius: 4px; border: 1px solid #dadce0;">
          <option value="">-- Chọn khóa học --</option>
          ${courses
            .map(
              (course) => `<option value="${course.id}">${course.name}</option>`
            )
            .join("")}
        </select>
      </div>
      
      <div id="attendance-meetings-container" style="margin-bottom: 16px; display: none;">
        <label style="display: block; margin-bottom: 8px; font-weight: bold;">Chọn buổi học:</label>
        <select id="attendance-meeting-select" style="width: 100%; padding: 8px; border-radius: 4px; border: 1px solid #dadce0;">
          <option value="">-- Chọn buổi học --</option>
        </select>
      </div>
      
      <button id="mark-attendance-btn" style="width: 100%; padding: 8px 16px; background-color: #188038; color: white; border: none; border-radius: 4px; cursor: pointer; display: none;">
        Điểm danh
      </button>
      
      <div id="attendance-result" style="margin-top: 16px; padding: 12px; border-radius: 4px; display: none;"></div>
    `;

    content.innerHTML = html;
    panel.style.display = "block";

    // Xử lý khi chọn khóa học
    const courseSelect = document.getElementById("attendance-course-select");
    const meetingsContainer = document.getElementById(
      "attendance-meetings-container"
    );
    const meetingSelect = document.getElementById("attendance-meeting-select");
    const markAttendanceBtn = document.getElementById("mark-attendance-btn");

    courseSelect.addEventListener("change", async () => {
      const courseId = courseSelect.value;

      if (!courseId) {
        meetingsContainer.style.display = "none";
        markAttendanceBtn.style.display = "none";
        return;
      }

      try {
        // Lấy danh sách học viên trong khóa học
        const students = await getCourseStudents(courseId);
        const studentData = students.find(
          (s) => s.name === studentName || s.user?.name === studentName
        );

        if (!studentData) {
          document.getElementById(
            "attendance-result"
          ).innerHTML = `<div style="background-color: #fce8e6; color: #c5221f; padding: 12px; border-radius: 4px;">
              Học viên ${studentName} không thuộc khóa học này.
            </div>`;
          document.getElementById("attendance-result").style.display = "block";
          meetingsContainer.style.display = "none";
          markAttendanceBtn.style.display = "none";
          return;
        }

        // Lấy danh sách buổi học
        const meetings = await getCourseMeetings(courseId);

        meetingSelect.innerHTML =
          '<option value="">-- Chọn buổi học --</option>';

        if (meetings && meetings.length > 0) {
          meetings.forEach((meeting) => {
            const meetingName =
              meeting.name ||
              (meeting.date
                ? new Date(meeting.date).toLocaleDateString("vi-VN")
                : `Buổi học ${meeting.id}`);
            meetingSelect.innerHTML += `<option value="${meeting.id}">${meetingName}</option>`;
          });

          meetingsContainer.style.display = "block";

          // Lưu thông tin học viên vào data attribute
          markAttendanceBtn.setAttribute(
            "data-student-id",
            studentData.id || studentData.user?.id
          );

          // Hiển thị nút điểm danh khi chọn buổi học
          meetingSelect.addEventListener("change", () => {
            if (meetingSelect.value) {
              markAttendanceBtn.style.display = "block";
            } else {
              markAttendanceBtn.style.display = "none";
            }
          });
        } else {
          document.getElementById(
            "attendance-result"
          ).innerHTML = `<div style="background-color: #fce8e6; color: #c5221f; padding: 12px; border-radius: 4px;">
              Không có buổi học nào trong khóa học này.
            </div>`;
          document.getElementById("attendance-result").style.display = "block";
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        document.getElementById(
          "attendance-result"
        ).innerHTML = `<div style="background-color: #fce8e6; color: #c5221f; padding: 12px; border-radius: 4px;">
            Đã xảy ra lỗi: ${error.message}
          </div>`;
        document.getElementById("attendance-result").style.display = "block";
      }
    });

    // Xử lý khi click nút điểm danh
    markAttendanceBtn.addEventListener("click", async () => {
      const studentId = markAttendanceBtn.getAttribute("data-student-id");
      const courseId = courseSelect.value;
      const meetingId = meetingSelect.value;

      if (!studentId || !courseId || !meetingId) {
        document.getElementById(
          "attendance-result"
        ).innerHTML = `<div style="background-color: #fce8e6; color: #c5221f; padding: 12px; border-radius: 4px;">
            Vui lòng chọn đầy đủ thông tin.
          </div>`;
        document.getElementById("attendance-result").style.display = "block";
        return;
      }

      try {
        await markAttendance(studentId, courseId, meetingId, true);

        document.getElementById(
          "attendance-result"
        ).innerHTML = `<div style="background-color: #e6f4ea; color: #188038; padding: 12px; border-radius: 4px;">
            Điểm danh thành công cho học viên ${studentName}!
          </div>`;
        document.getElementById("attendance-result").style.display = "block";

        // Disable nút điểm danh sau khi điểm danh thành công
        markAttendanceBtn.disabled = true;
        markAttendanceBtn.style.backgroundColor = "#ccc";
        markAttendanceBtn.textContent = "Đã điểm danh";
      } catch (error) {
        console.error("Error marking attendance:", error);
        document.getElementById(
          "attendance-result"
        ).innerHTML = `<div style="background-color: #fce8e6; color: #c5221f; padding: 12px; border-radius: 4px;">
            Điểm danh thất bại: ${error.message}
          </div>`;
        document.getElementById("attendance-result").style.display = "block";
      }
    });
  } catch (error) {
    console.error("Error showing attendance panel:", error);
  }
}

// Biến lưu trữ yêu cầu điểm danh
let attendanceRequests = {};

// Hàm nhận yêu cầu điểm danh từ popup.js thông qua background.js
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === "ATTENDANCE_REQUEST") {
    const { studentId, studentEmail, lessonId, requesterId } = request.data;

    console.log("Received attendance request for", studentEmail);

    // Lưu yêu cầu vào danh sách
    attendanceRequests[studentEmail] = {
      studentId,
      lessonId,
      requesterId,
      timestamp: Date.now(),
    };

    // Tìm kiếm người tham gia phù hợp với email
    findParticipantByEmail(studentEmail);

    sendResponse({ success: true });
    return true;
  }

  if (request.type === "CHECK_ATTENDANCE_REQUESTS") {
    // Trả về danh sách yêu cầu hiện tại
    sendResponse({ attendanceRequests });
    return true;
  }
});

// Hàm tìm người tham gia theo email
async function findParticipantByEmail(email) {
  // Đơn giản hóa: Chúng ta giả định rằng người dùng hiện tại là người cần chụp ảnh
  // Trong thực tế, chúng ta sẽ cần tìm đúng người tham gia với email tương ứng
  console.log("Finding participant with email:", email);

  // Hiển thị thông báo yêu cầu điểm danh cho người dùng
  showAttendancePrompt(email);
}

// Hàm hiển thị yêu cầu điểm danh
function showAttendancePrompt(email) {
  // Tạo modal thông báo
  const modal = document.createElement("div");
  modal.id = "attendance-prompt";
  modal.style.cssText = `
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10000;
  `;

  modal.innerHTML = `
    <div style="background: white; padding: 24px; border-radius: 8px; max-width: 500px; text-align: center;">
      <h3 style="margin-top: 0;">Yêu cầu điểm danh</h3>
      <p>Giáo viên đang yêu cầu bạn điểm danh. Vui lòng bật camera và chụp ảnh để xác nhận sự hiện diện.</p>
      <div style="display: flex; justify-content: center; gap: 16px; margin-top: 24px;">
        <button id="accept-attendance" style="padding: 8px 16px; background: #1a73e8; color: white; border: none; border-radius: 4px; cursor: pointer;">Chụp ảnh điểm danh</button>
        <button id="reject-attendance" style="padding: 8px 16px; background: #f5f5f5; color: #333; border: none; border-radius: 4px; cursor: pointer;">Từ chối</button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  // Xử lý sự kiện chấp nhận
  document.getElementById("accept-attendance").addEventListener("click", () => {
    document.body.removeChild(modal);
    startAttendanceCapture(email);
  });

  // Xử lý sự kiện từ chối
  document.getElementById("reject-attendance").addEventListener("click", () => {
    document.body.removeChild(modal);
    // Thông báo từ chối
    sendAttendanceResponse(email, false);
  });
}

// Hàm bắt đầu quá trình chụp ảnh điểm danh
function startAttendanceCapture(email) {
  // Kiểm tra xem có yêu cầu hợp lệ không
  if (!attendanceRequests[email]) {
    alert("Không tìm thấy yêu cầu điểm danh hợp lệ!");
    return;
  }

  const request = attendanceRequests[email];

  // Tạo modal camera
  const modal = document.createElement("div");
  modal.id = "camera-modal";
  modal.style.cssText = `
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.8);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10000;
  `;

  modal.innerHTML = `
    <div style="background: white; padding: 24px; border-radius: 8px; max-width: 600px; text-align: center;">
      <h3 style="margin-top: 0;">Chụp ảnh điểm danh</h3>
      <video id="camera-preview" autoplay style="width: 100%; max-height: 300px; border: 1px solid #ddd; margin: 16px 0;"></video>
      <canvas id="camera-canvas" style="display: none;"></canvas>
      <div id="camera-status" style="margin-bottom: 16px; font-style: italic; color: #666;">Đang kết nối camera...</div>
      <div style="display: flex; justify-content: center; gap: 16px;">
        <button id="capture-photo" style="padding: 8px 16px; background: #1a73e8; color: white; border: none; border-radius: 4px; cursor: pointer;">Chụp ảnh</button>
        <button id="cancel-capture" style="padding: 8px 16px; background: #f5f5f5; color: #333; border: none; border-radius: 4px; cursor: pointer;">Hủy</button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  const video = document.getElementById("camera-preview");
  const canvas = document.getElementById("camera-canvas");
  const captureBtn = document.getElementById("capture-photo");
  const cancelBtn = document.getElementById("cancel-capture");
  const statusEl = document.getElementById("camera-status");

  // Bật camera
  navigator.mediaDevices
    .getUserMedia({ video: true })
    .then((stream) => {
      video.srcObject = stream;
      statusEl.textContent =
        "Camera đã sẵn sàng. Vui lòng nhìn thẳng vào camera và chụp ảnh.";
      captureBtn.disabled = false;
    })
    .catch((err) => {
      statusEl.textContent = "Không thể kết nối camera: " + err.message;
      captureBtn.disabled = true;
    });

  // Xử lý chụp ảnh
  captureBtn.addEventListener("click", () => {
    // Chụp ảnh từ video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Chuyển ảnh sang base64
    const imageData = canvas.toDataURL("image/jpeg", 0.8);

    // Dừng camera
    const tracks = video.srcObject.getTracks();
    tracks.forEach((track) => track.stop());

    // Cập nhật giao diện
    statusEl.textContent = "Đang tải ảnh lên...";
    captureBtn.disabled = true;
    cancelBtn.disabled = true;

    // Gửi ảnh đến server
    uploadAttendancePhoto(imageData, request.studentId, request.lessonId)
      .then((result) => {
        // Đóng modal
        document.body.removeChild(modal);

        // Thông báo thành công
        alert(
          "Đã tải lên ảnh điểm danh thành công! Giáo viên sẽ xác nhận sự hiện diện của bạn."
        );

        // Xóa yêu cầu đã xử lý
        delete attendanceRequests[email];

        // Thông báo đã xử lý
        sendAttendanceResponse(email, true, result.data);
      })
      .catch((error) => {
        statusEl.textContent = "Lỗi: " + error.message;
        captureBtn.disabled = false;
        cancelBtn.disabled = false;
      });
  });

  // Xử lý hủy
  cancelBtn.addEventListener("click", () => {
    // Dừng camera nếu đang bật
    if (video.srcObject) {
      const tracks = video.srcObject.getTracks();
      tracks.forEach((track) => track.stop());
    }

    // Đóng modal
    document.body.removeChild(modal);

    // Thông báo hủy
    sendAttendanceResponse(email, false);
  });
}

// Hàm tải ảnh điểm danh lên server
async function uploadAttendancePhoto(imageData, studentId, lessonId) {
  // Gửi dữ liệu đến background script để thực hiện API call
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(
      {
        type: "UPLOAD_ATTENDANCE_PHOTO",
        data: {
          imageData,
          studentId,
          lessonId,
        },
      },
      (response) => {
        if (response.success) {
          resolve(response.data);
        } else {
          reject(
            new Error(response.error || "Không thể tải lên ảnh điểm danh")
          );
        }
      }
    );
  });
}

// Hàm gửi phản hồi về yêu cầu điểm danh
function sendAttendanceResponse(email, accepted, data = null) {
  const request = attendanceRequests[email];
  if (!request) return;

  chrome.runtime.sendMessage({
    type: "ATTENDANCE_RESPONSE",
    data: {
      studentId: request.studentId,
      lessonId: request.lessonId,
      requesterId: request.requesterId,
      accepted,
      responseData: data,
    },
  });

  // Xóa yêu cầu đã xử lý
  delete attendanceRequests[email];
}

// Chạy extension khi trang đã tải xong
document.addEventListener("DOMContentLoaded", initializeExtension);
