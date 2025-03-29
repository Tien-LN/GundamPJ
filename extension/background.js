// Lưu trữ thông tin phiên làm việc
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({ userSettings: {} });
});

// Lắng nghe tin nhắn từ content script
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
});
