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
    // Giả lập userId, trong thực tế cần lấy từ dữ liệu người dùng
    const userId = "user-123";
    const stats = await fetchUserStatistics(userId);
    const panel = document.getElementById("gundam-stats-panel");
    panel.style.display = "block";
    displayStatistics(stats);
  });

  menuButton.parentElement.appendChild(statsButton);
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
