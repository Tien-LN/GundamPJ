// Khởi tạo và xử lý sự kiện
document.addEventListener("DOMContentLoaded", async () => {
  const loginForm = document.getElementById("loginForm");
  const statisticsContent = document.getElementById("statisticsContent");
  const studentStats = document.getElementById("studentStats");
  const teacherStats = document.getElementById("teacherStats");
  const loginBtn = document.getElementById("loginBtn");
  const logoutBtn = document.getElementById("logoutBtn");
  const loginError = document.getElementById("loginError");

  // Kiểm tra người dùng đã đăng nhập
  const user = await getCurrentUser();
  if (user) {
    showStatistics(user);
  }

  // Xử lý đăng nhập
  loginBtn.addEventListener("click", async () => {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    try {
      const userData = await login(username, password);
      showStatistics(userData);
    } catch (error) {
      loginError.textContent = error.message;
    }
  });

  // Xử lý đăng xuất
  logoutBtn.addEventListener("click", async () => {
    await logout();
    loginForm.style.display = "block";
    statisticsContent.style.display = "none";
  });

  // Hiển thị thống kê theo role
  async function showStatistics(userData) {
    loginForm.style.display = "none";
    statisticsContent.style.display = "block";
    document.getElementById(
      "userName"
    ).textContent = `Xin chào, ${userData.user.name}`;

    if (userData.user.role.roleType === "STUDENT") {
      studentStats.style.display = "block";
      teacherStats.style.display = "none";
      // Lấy thống kê của học viên
      const stats = await getUserStatistics(userData.user.id);

      // Calculate attendance rate
      let totalAttended = 0;
      let totalLessons = 0;

      Object.values(stats.attendanceStats).forEach((courseAttendance) => {
        totalAttended += courseAttendance.attended || 0;
        totalLessons += courseAttendance.total || 0;
      });

      const attendanceRate =
        totalLessons > 0 ? Math.round((totalAttended / totalLessons) * 100) : 0;

      // Calculate average score across all exams
      let totalScore = 0;
      let examCount = 0;

      stats.courseStats.forEach((course) => {
        course.examStats.forEach((exam) => {
          totalScore += exam.averageScore;
          examCount++;
        });
      });

      const averageScore =
        examCount > 0 ? (totalScore / examCount).toFixed(1) : "-";

      document.getElementById(
        "attendanceRate"
      ).textContent = `${attendanceRate}%`;
      document.getElementById("averageScore").textContent = averageScore;
    } else {
      studentStats.style.display = "none";
      teacherStats.style.display = "block";
      // Lấy danh sách khóa học
      const courses = await getCourses();
      const courseSelect = document.getElementById("courseSelect");
      courseSelect.innerHTML = '<option value="">Chọn khóa học...</option>';
      courses.forEach((course) => {
        courseSelect.innerHTML += `<option value="${course.id}">${course.name}</option>`;
      }); // Xử lý khi chọn khóa học
      courseSelect.addEventListener("change", async (e) => {
        if (e.target.value) {
          const courseId = e.target.value;
          const students = await getCourseStudents(courseId);
          const studentList = document.getElementById("studentList");
          studentList.innerHTML = ""; // Lấy danh sách buổi học của khóa học
          let meetings = [];
          try {
            console.log("Fetching meetings for course:", courseId);
            meetings = await getCourseMeetings(courseId);
            console.log("Meetings data:", meetings);
          } catch (err) {
            console.error("Error fetching meetings:", err);
            alert("Không thể lấy danh sách buổi học: " + err.message);
          }

          // Container cho phần chọn buổi học
          const meetingContainer = document.createElement("div");
          meetingContainer.className = "meeting-selection";
          meetingContainer.style =
            "margin-bottom: 16px; padding: 8px; background: #f5f5f5; border-radius: 4px;";

          // Label cho dropdown
          const meetingLabel = document.createElement("div");
          meetingLabel.textContent = "Chọn buổi học để điểm danh:";
          meetingLabel.style = "font-weight: bold; margin-bottom: 8px;";
          meetingContainer.appendChild(meetingLabel);

          // Dropdown chọn buổi học
          const meetingSelect = document.createElement("select");
          meetingSelect.id = "meetingSelect";
          meetingSelect.style =
            "width: 100%; padding: 8px; margin-bottom: 8px;";
          meetingSelect.innerHTML =
            '<option value="">-- Chọn buổi học --</option>' +
            meetings
              .map(
                (m) =>
                  `<option value="${m.id}">${m.name || m.date || m.id}</option>`
              )
              .join("");
          meetingContainer.appendChild(meetingSelect);

          // Thêm container vào danh sách
          studentList.appendChild(meetingContainer);

          // Hiển thị số lượng học viên
          const studentCount = document.createElement("div");
          studentCount.textContent = `Số học viên: ${students.length}`;
          studentCount.style = "margin-bottom: 12px; font-weight: bold;";
          studentList.appendChild(studentCount);

          // Hiển thị danh sách học viên
          students.forEach((student) => {
            const div = document.createElement("div");
            div.className = "student-item";
            div.innerHTML = `
                <span>${student.name || student.user.name}</span>
                <div class="student-actions">
                  <button class="view-stat" data-id="${
                    student.id || student.user.id
                  }">Xem thống kê</button>
                  <button class="mark-att" data-id="${
                    student.id || student.user.id
                  }">Điểm danh</button>
                </div>
              `;
            studentList.appendChild(div);
          });

          // Xử lý sự kiện xem thống kê
          studentList.querySelectorAll(".view-stat").forEach((btn) => {
            btn.onclick = async function () {
              const stats = await getStudentStatistics(this.dataset.id);
              showStudentModal(stats);
            };
          }); // Xử lý sự kiện điểm danh
          studentList.querySelectorAll(".mark-att").forEach((btn) => {
            btn.onclick = async function () {
              const studentId = this.dataset.id;
              const meetingId = document.getElementById("meetingSelect").value;
              const studentElement =
                this.closest(".student-item").querySelector("span");
              const studentName = studentElement
                ? studentElement.textContent
                : "Học viên";

              if (!meetingId) {
                alert("Vui lòng chọn buổi học trước khi điểm danh!");
                return;
              }

              try {
                // Kiểm tra kết nối API
                const isConnected = await checkApiConnection();
                if (!isConnected) {
                  throw new Error(
                    "Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng!"
                  );
                }

                // Thay đổi hiển thị nút
                this.textContent = "Đang yêu cầu...";
                this.style.opacity = "0.7";

                // Lấy thông tin học viên
                const students = await getCourseStudents(courseId);
                const studentInfo = getStudentInfo(studentId, students);

                if (!studentInfo || !studentInfo.email) {
                  throw new Error(
                    "Không tìm thấy thông tin email của học viên. Vui lòng kiểm tra lại."
                  );
                }

                // Thông báo gửi yêu cầu
                alert(
                  `Đang gửi yêu cầu chụp ảnh điểm danh cho học viên: ${studentName} (${studentInfo.email}). Học viên sẽ nhận được yêu cầu bật camera để chụp ảnh xác thực.`
                );

                // Gửi yêu cầu điểm danh đến học viên trong Google Meet
                await requestAttendanceVerification(
                  studentId,
                  studentInfo.email,
                  meetingId
                );

                // Chờ phản hồi từ học viên
                this.textContent = "Chờ xác nhận...";

                // Biến để theo dõi kết quả
                let verificationComplete = false;
                let verificationResult = null;

                // Kiểm tra kết quả 5 lần với 2 giây mỗi lần
                for (let i = 0; i < 5; i++) {
                  // Tạm dừng 2 giây
                  await new Promise((resolve) => setTimeout(resolve, 2000));

                  // Kiểm tra kết quả
                  const result = await checkAttendanceVerificationResult(
                    studentId,
                    meetingId
                  );
                  if (result.success && !result.pending) {
                    verificationComplete = true;
                    verificationResult = result;
                    break;
                  }

                  // Cập nhật số lần thử còn lại
                  this.textContent = `Chờ xác nhận (${5 - i - 1})...`;
                }

                if (verificationComplete && verificationResult.accepted) {
                  // Nếu có hình ảnh, hiển thị để xác nhận
                  if (
                    verificationResult.data &&
                    verificationResult.data.imageUrl
                  ) {
                    // Hiển thị hình ảnh để giáo viên xác nhận
                    this.textContent = "Xác nhận ảnh...";

                    // Hiển thị modal xác nhận với hình ảnh
                    const verifyResult = await verifyAttendancePhoto(
                      studentId,
                      meetingId,
                      studentName
                    );

                    if (verifyResult.success) {
                      // Nếu được xác nhận, cập nhật giao diện
                      if (verifyResult.data.verified) {
                        this.textContent = "✓ Đã điểm danh";
                        this.disabled = true;
                        this.style.backgroundColor = "#4CAF50";
                        this.style.color = "white";
                        this.style.opacity = "1";
                      } else {
                        this.textContent = "Đã từ chối";
                        this.style.backgroundColor = "#f44336";
                        this.style.color = "white";
                        this.style.opacity = "1";

                        // Cho phép thử lại sau khi từ chối
                        setTimeout(() => {
                          this.textContent = "Điểm danh";
                          this.style.backgroundColor = "";
                          this.style.color = "";
                        }, 3000);
                      }
                    } else {
                      throw new Error("Không thể xác nhận hình ảnh điểm danh");
                    }
                  } else {
                    // Không có hình ảnh nhưng học viên đã xác nhận
                    // Thực hiện điểm danh thủ công
                    const result = await markAttendance(
                      studentId,
                      courseId,
                      meetingId,
                      true
                    );

                    if (result.success) {
                      this.textContent = "✓ Đã điểm danh";
                      this.disabled = true;
                      this.style.backgroundColor = "#4CAF50";
                      this.style.color = "white";
                      this.style.opacity = "1";
                    } else {
                      throw new Error("Không thể điểm danh");
                    }
                  }
                } else {
                  // Không nhận được phản hồi hoặc học viên từ chối
                  // Mở camera ở chế độ extension để giáo viên xử lý
                  this.textContent = "Chụp ảnh thay";

                  // Mở camera để chụp ảnh trực tiếp
                  try {
                    const captureResult = await captureAttendancePhoto(
                      studentId,
                      meetingId
                    );

                    if (captureResult.success) {
                      // Hiển thị ảnh để giáo viên xác nhận
                      this.textContent = "Xác nhận ảnh...";

                      // Hiển thị modal xác nhận với hình ảnh
                      const verifyResult = await verifyAttendancePhoto(
                        studentId,
                        meetingId,
                        studentName
                      );

                      if (verifyResult.success) {
                        // Nếu được xác nhận, cập nhật giao diện
                        if (verifyResult.data.verified) {
                          this.textContent = "✓ Đã điểm danh";
                          this.disabled = true;
                          this.style.backgroundColor = "#4CAF50";
                          this.style.color = "white";
                          this.style.opacity = "1";
                        } else {
                          this.textContent = "Đã từ chối";
                          this.style.backgroundColor = "#f44336";
                          this.style.color = "white";
                          this.style.opacity = "1";

                          // Cho phép thử lại sau khi từ chối
                          setTimeout(() => {
                            this.textContent = "Điểm danh";
                            this.style.backgroundColor = "";
                            this.style.color = "";
                          }, 3000);
                        }
                      } else {
                        throw new Error(
                          "Không thể xác nhận hình ảnh điểm danh"
                        );
                      }
                    } else {
                      throw new Error("Không thể chụp ảnh điểm danh");
                    }
                  } catch (error) {
                    console.error("Capture error:", error);
                    throw new Error("Không thể chụp ảnh: " + error.message);
                  }
                }
              } catch (error) {
                // Khôi phục nút nếu có lỗi
                this.textContent = "Điểm danh";
                this.style.opacity = "1";

                // Hiển thị lỗi cụ thể hơn
                let errorMessage = error.message;
                if (errorMessage.includes("Failed to fetch")) {
                  errorMessage =
                    "Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng!";
                }

                alert("Điểm danh thất bại: " + errorMessage);
                console.error("Điểm danh thất bại:", error);
              }
            };
          });

          // Cập nhật trạng thái điểm danh của các nút
          const attendanceButtons = studentList.querySelectorAll(".mark-att");
          updateAttendanceButtonStatus(attendanceButtons, meetingSelect.value);
        }
      });
    }
  }

  const checkConnectionBtn = document.getElementById("checkConnectionBtn");

  if (checkConnectionBtn) {
    checkConnectionBtn.addEventListener("click", updateConnectionStatus);
  }

  // Kiểm tra kết nối khi mở popup
  updateConnectionStatus();
});

// Hàm xem thống kê của học viên
function viewStatistics(studentId) {
  getStudentStatistics(studentId)
    .then((stats) => {
      // Hiển thị thống kê trong modal hoặc popup
      alert(
        `Tỷ lệ tham gia: ${stats.attendanceRate}%\nĐiểm trung bình: ${stats.averageScore}`
      );
    })
    .catch((error) => {
      alert("Không thể lấy thống kê: " + error.message);
    });
}

// Hàm điểm danh học viên - renamed to avoid conflict
function markStudentAttendance(studentId, courseId, meetingId) {
  if (!studentId || !courseId) {
    alert("Thiếu thông tin học viên hoặc khóa học!");
    return;
  }

  if (!meetingId) {
    alert("Vui lòng chọn buổi học trước khi điểm danh!");
    return;
  }

  // Hiển thị đang xử lý
  const btn = document.querySelector(`.mark-att[data-id="${studentId}"]`);
  if (btn) {
    btn.textContent = "Đang điểm danh...";
    btn.disabled = true;
    btn.style.opacity = "0.7";
  }

  markAttendance(studentId, courseId, meetingId, true)
    .then(() => {
      // Cập nhật giao diện
      if (btn) {
        btn.textContent = "✓ Đã điểm danh";
        btn.style.backgroundColor = "#4CAF50";
        btn.style.color = "white";
        btn.style.opacity = "1";
      }
      alert("Điểm danh thành công!");
    })
    .catch((error) => {
      // Khôi phục trạng thái nút
      if (btn) {
        btn.textContent = "Điểm danh";
        btn.disabled = false;
        btn.style.opacity = "1";
      }
      alert("Điểm danh thất bại: " + error.message);
      console.error("Lỗi điểm danh:", error);
    });
}

// Kiểm tra kết nối API và cập nhật giao diện
function updateConnectionStatus() {
  const statusElement = document.getElementById("connectionStatus");

  if (!statusElement) return;

  statusElement.textContent = "Đang kiểm tra kết nối...";
  statusElement.className = "status-indicator offline";

  checkApiConnection()
    .then((isConnected) => {
      if (isConnected) {
        statusElement.textContent = "Đã kết nối với API";
        statusElement.className = "status-indicator online";
      } else {
        statusElement.textContent = "Mất kết nối đến API";
        statusElement.className = "status-indicator offline";
      }

      // Lưu trạng thái kết nối
      chrome.storage.local.set({ apiConnectionStatus: isConnected });
    })
    .catch((error) => {
      console.error("Lỗi kiểm tra kết nối:", error);
      statusElement.textContent = "Lỗi kiểm tra kết nối";
      statusElement.className = "status-indicator offline";

      // Lưu trạng thái kết nối
      chrome.storage.local.set({ apiConnectionStatus: false });
    });
}

// Make functions available globally
window.viewStatistics = viewStatistics;
window.markStudentAttendance = markStudentAttendance;

/**
 * Kiểm tra và hiển thị trạng thái điểm danh của từng học viên
 * @param {Array} buttons - Danh sách các nút điểm danh
 * @param {string} meetingId - ID của buổi học
 */
async function updateAttendanceButtonStatus(buttons, meetingId) {
  if (!buttons || !buttons.length || !meetingId) return;

  for (const button of buttons) {
    const studentId = button.dataset.id;
    if (!studentId) continue;

    try {
      const status = await checkAttendanceStatus(studentId, meetingId);

      if (status.exists) {
        if (status.attended) {
          // Đã điểm danh
          button.textContent = "✓ Đã điểm danh";
          button.disabled = true;
          button.style.backgroundColor = "#4CAF50";
          button.style.color = "white";
        } else {
          // Đã đánh dấu vắng mặt
          button.textContent = "✗ Vắng mặt";
          button.disabled = false;
          button.style.backgroundColor = "#f44336";
          button.style.color = "white";
        }
      }
    } catch (error) {
      console.warn(
        `Không thể kiểm tra trạng thái điểm danh cho học viên ${studentId}:`,
        error
      );
    }
  }
}

// Hiển thị modal thống kê học viên
function showStudentModal(stats) {
  let modal = document.getElementById("studentModal");
  if (!modal) {
    modal = document.createElement("div");
    modal.id = "studentModal";
    modal.style =
      "position:fixed;top:0;left:0;width:100vw;height:100vh;background:rgba(0,0,0,0.4);display:flex;align-items:center;justify-content:center;z-index:9999;";
    modal.innerHTML = `<div style='background:#fff;padding:24px 32px;border-radius:8px;min-width:320px;max-width:90vw;max-height:90vh;overflow-y:auto;'>
      <h3 style='margin-top:0;'>Thống kê học viên</h3>
      <div id='modalStats'></div>
      <button id='closeModalBtn' style='margin-top:16px;padding:8px 16px;'>Đóng</button>
    </div>`;
    document.body.appendChild(modal);
  } else {
    modal.style.display = "flex";
  }

  const modalStats = modal.querySelector("#modalStats");

  // Thông tin cơ bản
  let statsHtml = `
    <div style="margin-bottom:16px;">
      <h4 style="margin-top:0;margin-bottom:12px;">Thông tin học viên</h4>
      <div><b>Họ tên:</b> ${stats.name || "Không có thông tin"}</div>
      <div><b>Email:</b> ${stats.email || "Không có thông tin"}</div>
    </div>
    
    <div style="margin-bottom:16px;">
      <h4 style="margin-top:0;margin-bottom:12px;">Tổng quan</h4>
      <div><b>Tỷ lệ tham gia:</b> ${stats.attendanceRate || 0}%</div>
      <div><b>Điểm trung bình:</b> ${stats.averageScore || "-"}</div>
      <div><b>Số buổi đã tham gia:</b> ${stats.totalAttended || 0}</div>
      <div><b>Tổng số buổi học:</b> ${stats.totalLessons || 0}</div>
      <div><b>Số đề thi đã làm:</b> ${stats.examCount || 0}</div>
    </div>
  `;

  // Chi tiết điểm danh theo khóa học
  if (stats.enrollments && stats.enrollments.length > 0) {
    statsHtml += `<div style="margin-bottom:16px;">
      <h4 style="margin-top:0;margin-bottom:12px;">Chi tiết theo khóa học</h4>
    `;

    stats.enrollments.forEach((enrollment) => {
      const course = enrollment.course;

      // Tính tỷ lệ tham gia cho khóa học này
      const totalLessons = course.lessons ? course.lessons.length : 0;
      const attendedLessons = course.attendance
        ? course.attendance.filter((a) => a.isPresent).length
        : 0;
      const attendanceRate =
        totalLessons > 0
          ? Math.round((attendedLessons / totalLessons) * 100)
          : 0;

      statsHtml += `
        <div style="margin-bottom:12px;padding:8px;background:#f5f5f5;border-radius:4px;">
          <h5 style="margin-top:0;margin-bottom:8px;">${
            course.name || "Khóa học"
          }</h5>
          <div><b>Tỷ lệ tham gia:</b> ${attendanceRate}% (${attendedLessons}/${totalLessons})</div>
      `;

      // Chi tiết điểm thi
      if (course.exams && course.exams.length > 0) {
        statsHtml += `<div style="margin-top:8px;"><b>Điểm thi:</b></div>`;
        course.exams.forEach((exam) => {
          if (exam.UserExam && exam.UserExam.length > 0) {
            const userExam = exam.UserExam[0];
            let examScore = "-";

            if (userExam.userAnswers && userExam.userAnswers.length > 0) {
              const totalScore = userExam.userAnswers.reduce(
                (sum, answer) => sum + (answer.score || 0),
                0
              );
              const averageScore = totalScore / userExam.userAnswers.length;
              examScore = averageScore.toFixed(1);
            }

            statsHtml += `
              <div style="margin-left:12px;">
                - ${exam.title || "Đề thi"}: <b>${examScore}</b>
              </div>
            `;
          }
        });
      }

      statsHtml += `</div>`;
    });

    statsHtml += `</div>`;
  }

  modalStats.innerHTML = statsHtml;

  modal.querySelector("#closeModalBtn").onclick = () => {
    modal.style.display = "none";
  };
}

/**
 * Mở giao diện chụp ảnh điểm danh trực tiếp từ popup
 * @param {string} studentId - ID của học viên
 * @param {string} lessonId - ID của buổi học
 * @returns {Promise<Object>} - Kết quả chụp ảnh
 */
async function captureAttendancePhoto(studentId, lessonId) {
  return new Promise((resolve, reject) => {
    try {
      // Tạo modal chụp ảnh
      const modal = document.createElement("div");
      modal.id = "photo-capture-modal";
      modal.classList.add("modal");
      modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.7);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 9999;
      `;

      modal.innerHTML = `
        <div class="modal-content" style="background-color: white; padding: 20px; border-radius: 8px; width: 90%; max-width: 500px;">
          <div class="modal-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
            <h3 style="margin: 0;">Chụp ảnh điểm danh</h3>
            <button id="close-capture-modal" style="background: none; border: none; font-size: 20px; cursor: pointer;">&times;</button>
          </div>
          <div class="modal-body">
            <div id="camera-container" style="display: flex; flex-direction: column; align-items: center;">
              <video id="capture-video" autoplay style="width: 100%; max-height: 300px; border: 1px solid #ddd; margin-bottom: 10px;"></video>
              <canvas id="capture-canvas" style="display: none;"></canvas>
              <div id="camera-status" style="margin-bottom: 10px; font-style: italic;">Đang kết nối camera...</div>
              <div style="display: flex; gap: 10px; margin-top: 10px;">
                <button id="capture-btn" style="padding: 8px 16px; background: #1a73e8; color: white; border: none; border-radius: 4px; cursor: pointer;" disabled>Chụp ảnh</button>
                <button id="retake-btn" style="padding: 8px 16px; background: #f5f5f5; color: #333; border: none; border-radius: 4px; cursor: pointer; display: none;">Chụp lại</button>
                <button id="upload-btn" style="padding: 8px 16px; background: #4CAF50; color: white; border: none; border-radius: 4px; cursor: pointer; display: none;">Tải lên</button>
              </div>
            </div>
          </div>
        </div>
      `;

      document.body.appendChild(modal);

      // Lấy các phần tử DOM
      const video = document.getElementById("capture-video");
      const canvas = document.getElementById("capture-canvas");
      const captureBtn = document.getElementById("capture-btn");
      const retakeBtn = document.getElementById("retake-btn");
      const uploadBtn = document.getElementById("upload-btn");
      const statusEl = document.getElementById("camera-status");
      const closeBtn = document.getElementById("close-capture-modal");

      // Khởi tạo biến lưu dữ liệu ảnh
      let imageData = null;

      // Hàm dọn dẹp
      const cleanup = () => {
        // Dừng video stream nếu đang chạy
        if (video.srcObject) {
          const tracks = video.srcObject.getTracks();
          tracks.forEach((track) => track.stop());
        }

        // Xóa modal
        document.body.removeChild(modal);
      };

      // Bắt sự kiện đóng
      closeBtn.addEventListener("click", () => {
        cleanup();
        reject(new Error("Đã hủy chụp ảnh"));
      });

      // Khởi tạo camera
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
          video.srcObject = stream;
          statusEl.textContent = "Camera đã sẵn sàng. Vui lòng chụp ảnh.";
          captureBtn.disabled = false;
        })
        .catch((error) => {
          statusEl.textContent = "Không thể kết nối camera: " + error.message;
          reject(new Error("Không thể kết nối camera: " + error.message));
        });

      // Bắt sự kiện chụp ảnh
      captureBtn.addEventListener("click", () => {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        // Vẽ khung hình từ video lên canvas
        const ctx = canvas.getContext("2d");
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Chuyển canvas thành dữ liệu ảnh base64
        imageData = canvas.toDataURL("image/jpeg", 0.8);

        // Hiển thị ảnh đã chụp
        video.srcObject.getTracks().forEach((track) => track.stop());
        video.style.display = "none";
        canvas.style.display = "block";

        // Cập nhật UI
        captureBtn.style.display = "none";
        retakeBtn.style.display = "inline-block";
        uploadBtn.style.display = "inline-block";
        statusEl.textContent =
          "Ảnh đã được chụp. Bạn có thể tải lên hoặc chụp lại.";
      });

      // Bắt sự kiện chụp lại
      retakeBtn.addEventListener("click", () => {
        // Xóa ảnh đã chụp
        imageData = null;
        canvas.style.display = "none";

        // Kết nối lại camera
        navigator.mediaDevices
          .getUserMedia({ video: true })
          .then((stream) => {
            video.srcObject = stream;
            video.style.display = "block";

            // Cập nhật UI
            captureBtn.style.display = "inline-block";
            retakeBtn.style.display = "none";
            uploadBtn.style.display = "none";
            statusEl.textContent = "Camera đã sẵn sàng. Vui lòng chụp ảnh.";
          })
          .catch((error) => {
            statusEl.textContent = "Không thể kết nối camera: " + error.message;
          });
      });

      // Bắt sự kiện tải lên
      uploadBtn.addEventListener("click", async () => {
        if (!imageData) {
          statusEl.textContent =
            "Không có ảnh để tải lên. Vui lòng chụp ảnh trước.";
          return;
        }

        try {
          // Cập nhật UI
          uploadBtn.disabled = true;
          retakeBtn.disabled = true;
          statusEl.textContent = "Đang tải ảnh lên...";

          // Lấy API URL từ config
          const config = await new Promise((resolve) => {
            chrome.storage.local.get(["config"], (result) => {
              resolve(result.config || {});
            });
          });

          const API_URL = config.API_URL || "http://localhost:3000/api";

          // Lấy token xác thực
          const authData = await new Promise((resolve) => {
            chrome.storage.local.get(["authToken"], (result) => {
              resolve(result);
            });
          });

          const token = authData.authToken;

          // Gửi request tải ảnh lên
          const response = await fetch(`${API_URL}/cloudinary/upload`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            body: JSON.stringify({
              image: imageData,
              userId: studentId,
              lessonId: lessonId,
            }),
          });

          const result = await response.json();

          if (!response.ok) {
            throw new Error(result.error || "Không thể tải lên ảnh điểm danh");
          }

          // Đóng modal
          cleanup();

          // Trả về kết quả tải lên
          resolve({
            success: true,
            data: result,
          });
        } catch (error) {
          statusEl.textContent = "Lỗi: " + error.message;
          uploadBtn.disabled = false;
          retakeBtn.disabled = false;
          reject(error);
        }
      });
    } catch (error) {
      console.error("Error in captureAttendancePhoto:", error);
      reject(error);
    }
  });
}

/**
 * Hiển thị giao diện xác nhận ảnh điểm danh
 * @param {string} studentId - ID của học viên
 * @param {string} lessonId - ID của buổi học
 * @param {string} studentName - Tên học viên
 * @returns {Promise<Object>} - Kết quả xác nhận
 */
async function verifyAttendancePhoto(studentId, lessonId, studentName) {
  return new Promise(async (resolve, reject) => {
    try {
      // Lấy thông tin ảnh điểm danh
      const config = await new Promise((resolve) => {
        chrome.storage.local.get(["config"], (result) => {
          resolve(result.config || {});
        });
      });

      const API_URL = config.API_URL || "http://localhost:3000/api";

      // Lấy token xác thực
      const authData = await new Promise((resolve) => {
        chrome.storage.local.get(["authToken"], (result) => {
          resolve(result);
        });
      });

      const token = authData.authToken;

      // Lấy thông tin ảnh điểm danh mới nhất
      const response = await fetch(
        `${API_URL}/cloudinary/attendance/${studentId}/${lessonId}`,
        {
          method: "GET",
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.error || "Không thể lấy thông tin ảnh điểm danh"
        );
      }

      if (!result.data) {
        throw new Error("Không tìm thấy ảnh điểm danh");
      }

      // Tạo modal xác nhận
      const modal = document.createElement("div");
      modal.id = "verify-photo-modal";
      modal.classList.add("modal");
      modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.7);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 9999;
      `;

      modal.innerHTML = `
        <div class="modal-content" style="background-color: white; padding: 20px; border-radius: 8px; width: 90%; max-width: 500px;">
          <div class="modal-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
            <h3 style="margin: 0;">Xác nhận điểm danh</h3>
            <button id="close-verify-modal" style="background: none; border: none; font-size: 20px; cursor: pointer;">&times;</button>
          </div>
          <div class="modal-body">
            <p>Xác nhận điểm danh cho học viên: <strong>${studentName}</strong></p>
            <div style="margin: 15px 0; text-align: center;">
              <img id="attendance-image" src="${result.data.imageUrl}" alt="Ảnh điểm danh" style="max-width: 100%; max-height: 300px; border: 1px solid #ddd;" />
            </div>
            <div style="display: flex; justify-content: center; gap: 15px; margin-top: 20px;">
              <button id="approve-btn" style="padding: 8px 16px; background: #4CAF50; color: white; border: none; border-radius: 4px; cursor: pointer;">Xác nhận điểm danh</button>
              <button id="reject-btn" style="padding: 8px 16px; background: #f44336; color: white; border: none; border-radius: 4px; cursor: pointer;">Từ chối</button>
            </div>
          </div>
        </div>
      `;

      document.body.appendChild(modal);

      // Lấy các phần tử DOM
      const closeBtn = document.getElementById("close-verify-modal");
      const approveBtn = document.getElementById("approve-btn");
      const rejectBtn = document.getElementById("reject-btn");

      // Hàm dọn dẹp
      const cleanup = () => {
        document.body.removeChild(modal);
      };

      // Bắt sự kiện đóng
      closeBtn.addEventListener("click", () => {
        cleanup();
        reject(new Error("Đã hủy xác nhận"));
      });

      // Bắt sự kiện xác nhận
      approveBtn.addEventListener("click", async () => {
        try {
          // Cập nhật UI
          approveBtn.disabled = true;
          rejectBtn.disabled = true;

          // Gửi request xác nhận
          const verifyResponse = await fetch(`${API_URL}/cloudinary/verify`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            body: JSON.stringify({
              attendanceImageId: result.data.id,
              verified: true,
            }),
          });

          const verifyResult = await verifyResponse.json();

          if (!verifyResponse.ok) {
            throw new Error(
              verifyResult.error || "Không thể xác nhận điểm danh"
            );
          }

          // Đóng modal
          cleanup();

          // Trả về kết quả xác nhận
          resolve({
            success: true,
            data: {
              verified: true,
              attendanceImage: verifyResult.data,
            },
          });
        } catch (error) {
          approveBtn.disabled = false;
          rejectBtn.disabled = false;
          reject(error);
        }
      });

      // Bắt sự kiện từ chối
      rejectBtn.addEventListener("click", async () => {
        try {
          // Cập nhật UI
          approveBtn.disabled = true;
          rejectBtn.disabled = true;

          // Gửi request từ chối
          const verifyResponse = await fetch(`${API_URL}/cloudinary/verify`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            body: JSON.stringify({
              attendanceImageId: result.data.id,
              verified: false,
            }),
          });

          const verifyResult = await verifyResponse.json();

          if (!verifyResponse.ok) {
            throw new Error(
              verifyResult.error || "Không thể từ chối điểm danh"
            );
          }

          // Đóng modal
          cleanup();

          // Trả về kết quả từ chối
          resolve({
            success: true,
            data: {
              verified: false,
              attendanceImage: verifyResult.data,
            },
          });
        } catch (error) {
          approveBtn.disabled = false;
          rejectBtn.disabled = false;
          reject(error);
        }
      });
    } catch (error) {
      console.error("Error in verifyAttendancePhoto:", error);
      reject(error);
    }
  });
}

/**
 * Gửi yêu cầu điểm danh đến học viên trong Google Meet
 * @param {string} studentId - ID của học viên
 * @param {string} studentEmail - Email của học viên
 * @param {string} lessonId - ID của buổi học
 * @returns {Promise<Object>} - Kết quả yêu cầu
 */
async function requestAttendanceVerification(
  studentId,
  studentEmail,
  lessonId
) {
  try {
    if (!studentId || !studentEmail || !lessonId) {
      throw new Error("Thiếu thông tin học viên hoặc buổi học");
    }

    // Tìm tab Google Meet đang mở
    const tabs = await new Promise((resolve) => {
      chrome.tabs.query({ url: "https://meet.google.com/*" }, resolve);
    });

    if (!tabs || tabs.length === 0) {
      throw new Error(
        "Không tìm thấy cuộc họp Google Meet nào đang mở! Vui lòng mở Google Meet trước khi điểm danh."
      );
    }

    // Sử dụng tab đầu tiên tìm thấy
    const meetingTabId = tabs[0].id;

    // Gửi yêu cầu đến background script để chuyển tiếp đến content script
    return new Promise((resolve, reject) => {
      chrome.runtime.sendMessage(
        {
          type: "REQUEST_ATTENDANCE_VERIFICATION",
          data: {
            studentId,
            studentEmail,
            lessonId,
            meetingTabId,
          },
        },
        (response) => {
          if (response && response.success) {
            // Lưu thông tin yêu cầu
            chrome.storage.local.set({
              pendingAttendanceRequest: {
                studentId,
                studentEmail,
                lessonId,
                timestamp: Date.now(),
              },
            });

            resolve(response);
          } else {
            reject(new Error("Không thể gửi yêu cầu điểm danh"));
          }
        }
      );
    });
  } catch (error) {
    console.error("Request attendance verification error:", error);
    throw error;
  }
}

/**
 * Kiểm tra kết quả xác minh điểm danh
 * @param {string} studentId - ID của học viên
 * @param {string} lessonId - ID của buổi học
 * @returns {Promise<Object>} - Kết quả xác minh
 */
async function checkAttendanceVerificationResult(studentId, lessonId) {
  try {
    // Kiểm tra trong storage
    return new Promise((resolve) => {
      chrome.storage.local.get(["attendanceResponse"], (result) => {
        const response = result.attendanceResponse;

        if (
          response &&
          response.studentId === studentId &&
          response.lessonId === lessonId &&
          // Chỉ lấy phản hồi trong vòng 5 phút
          Date.now() - response.timestamp < 5 * 60 * 1000
        ) {
          // Xóa phản hồi đã xử lý
          chrome.storage.local.remove(["attendanceResponse"]);

          resolve({
            success: true,
            accepted: response.accepted,
            data: response.responseData,
          });
        } else {
          resolve({ success: false, pending: true });
        }
      });
    });
  } catch (error) {
    console.error("Check attendance verification result error:", error);
    throw error;
  }
}

/**
 * Lấy thông tin học viên từ danh sách
 * @param {string} studentId - ID của học viên
 * @param {Array} students - Danh sách học viên
 * @returns {Object|null} - Thông tin học viên
 */
function getStudentInfo(studentId, students) {
  if (!students || !Array.isArray(students)) return null;

  const student = students.find(
    (s) => s.id === studentId || (s.user && s.user.id === studentId)
  );

  if (!student) return null;

  return {
    id: student.id || (student.user && student.user.id),
    name: student.name || (student.user && student.user.name),
    email: student.email || (student.user && student.user.email),
  };
}

// Thêm vào danh sách hàm được export
window.captureAttendancePhoto = captureAttendancePhoto;
window.verifyAttendancePhoto = verifyAttendancePhoto;
window.requestAttendanceVerification = requestAttendanceVerification;
window.checkAttendanceVerificationResult = checkAttendanceVerificationResult;
window.getStudentInfo = getStudentInfo;
