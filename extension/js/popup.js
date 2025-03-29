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

    if (userData.user.role === "student") {
      studentStats.style.display = "block";
      teacherStats.style.display = "none";
      // Lấy thống kê của học viên
      const stats = await getStudentStatistics(userData.user.id);
      document.getElementById(
        "attendanceRate"
      ).textContent = `${stats.attendanceRate}%`;
      document.getElementById("averageScore").textContent = stats.averageScore;
    } else {
      studentStats.style.display = "none";
      teacherStats.style.display = "block";
      // Lấy danh sách khóa học
      const courses = await getCourses();
      const courseSelect = document.getElementById("courseSelect");
      courseSelect.innerHTML = '<option value="">Chọn khóa học...</option>';
      courses.forEach((course) => {
        courseSelect.innerHTML += `<option value="${course.id}">${course.name}</option>`;
      });

      // Xử lý khi chọn khóa học
      courseSelect.addEventListener("change", async (e) => {
        if (e.target.value) {
          const students = await getCourseStudents(e.target.value);
          const studentList = document.getElementById("studentList");
          studentList.innerHTML = students
            .map(
              (student) => `
              <div class="student-item">
                <span>${student.name}</span>
                <div class="student-actions">
                  <button onclick="viewStatistics('${student.id}')">Xem thống kê</button>
                  <button onclick="markStudentAttendance('${student.id}', '${e.target.value}')">Điểm danh</button>
                </div>
              </div>
            `
            )
            .join("");
        }
      });
    }
  }
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
function markStudentAttendance(studentId, courseId) {
  const meetingId = "current_meeting_id"; // Cần lấy ID của buổi học hiện tại
  markAttendance(studentId, courseId, meetingId, true)
    .then(() => {
      alert("Điểm danh thành công!");
    })
    .catch((error) => {
      alert("Điểm danh thất bại: " + error.message);
    });
}

// Make functions available globally
window.viewStatistics = viewStatistics;
window.markStudentAttendance = markStudentAttendance;
