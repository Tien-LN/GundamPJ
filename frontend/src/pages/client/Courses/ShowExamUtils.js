// Hiển thị thông báo khi xóa câu trả lời thành công
export const showDeleteNotification = (elementId) => {
  // Tạo thông báo
  const notification = document.createElement("div");
  notification.className = "delete-notification";
  notification.textContent = "Đã xóa câu trả lời";

  // Thêm vào DOM
  document.body.appendChild(notification);

  // Hiển thị và sau đó biến mất sau 2 giây
  setTimeout(() => {
    notification.classList.add("show");

    setTimeout(() => {
      notification.classList.remove("show");
      setTimeout(() => document.body.removeChild(notification), 300);
    }, 1500);
  }, 0);
};

// Thêm hiệu ứng nhấp nháy khi một phần tử thay đổi
export const highlightChangedElement = (elementId) => {
  if (!elementId) return;

  const element = document.getElementById(elementId);
  if (!element) return;

  element.classList.add("highlight-change");
  setTimeout(() => {
    element.classList.remove("highlight-change");
  }, 800);
};
