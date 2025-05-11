// Lưu trữ thông tin phiên làm việc
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({ userSettings: {} });
});

// Lắng nghe tin nhắn từ content script và popup về điểm danh
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === "GET_USER_SETTINGS") {
    chrome.storage.local.get(["userSettings"], (result) => {
      sendResponse(result.userSettings);
    });
    return true;
  }

  if (request.type === "SAVE_USER_SETTINGS") {
    chrome.storage.local.set({ userSettings: request.data }, () => {
      sendResponse({ success: true });
    });
    return true;
  }

  if (request.type === "GET_AUTH_COOKIES") {
    chrome.cookies.getAll({ url: request.apiUrl }, (cookies) => {
      const jwtCookie = cookies.find((cookie) => cookie.name === "jwt");
      if (jwtCookie) {
        console.log("Found JWT cookie");
        sendResponse({ token: jwtCookie.value });
      } else {
        console.log("No JWT cookie found");
        sendResponse({ token: null });
      }
    });
    return true;
  }

  // Xử lý yêu cầu điểm danh từ popup.js
  if (request.type === "REQUEST_ATTENDANCE_VERIFICATION") {
    const { studentId, studentEmail, lessonId, meetingTabId } = request.data;

    console.log(
      "Background script received attendance verification request:",
      request.data
    );

    // Chuyển tiếp yêu cầu đến tab Google Meet
    chrome.tabs.sendMessage(
      meetingTabId,
      {
        type: "ATTENDANCE_REQUEST",
        data: {
          studentId,
          studentEmail,
          lessonId,
          requesterId: sender.tab?.id || "popup",
        },
      },
      (response) => {
        sendResponse(response);
      }
    );

    return true;
  }

  // Xử lý phản hồi từ content.js
  if (request.type === "ATTENDANCE_RESPONSE") {
    const { studentId, lessonId, requesterId, accepted, responseData } =
      request.data;

    console.log(
      "Background script received attendance response:",
      request.data
    );

    // Chuyển tiếp phản hồi đến popup hoặc tab yêu cầu
    if (requesterId === "popup") {
      // Lưu vào localStorage để popup có thể truy cập
      chrome.storage.local.set({
        attendanceResponse: {
          studentId,
          lessonId,
          accepted,
          responseData,
          timestamp: Date.now(),
        },
      });
    } else {
      chrome.tabs.sendMessage(parseInt(requesterId), {
        type: "ATTENDANCE_VERIFICATION_RESULT",
        data: {
          studentId,
          lessonId,
          accepted,
          responseData,
        },
      });
    }

    sendResponse({ success: true });
    return true;
  }

  // Xử lý yêu cầu tải ảnh điểm danh lên server
  if (request.type === "UPLOAD_ATTENDANCE_PHOTO") {
    const { imageData, studentId, lessonId } = request.data;

    // Lấy API URL từ config
    chrome.storage.local.get(["config"], async (result) => {
      try {
        const config = result.config || {};
        const API_URL = config.API_URL || "http://localhost:3000/api";

        // Lấy token xác thực
        const authData = await chrome.storage.local.get(["authToken"]);
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

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Không thể tải lên ảnh điểm danh");
        }

        sendResponse({
          success: true,
          data,
        });
      } catch (error) {
        console.error("Upload attendance photo error:", error);
        sendResponse({
          success: false,
          error: error.message,
        });
      }
    });

    return true;
  }
});
