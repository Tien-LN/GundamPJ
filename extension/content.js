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
  observeParticipantsList();
}

// Chạy extension khi trang đã tải xong
document.addEventListener("DOMContentLoaded", initializeExtension);
