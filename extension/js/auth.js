// Xử lý xác thực người dùng

// Cấu hình API
const API_URL = "http://localhost:3000/api";

// Lưu trữ thông tin người dùng đã đăng nhập
let currentUser = null;

/**
 * Đăng nhập người dùng
 * @param {string} username - Tên đăng nhập
 * @param {string} password - Mật khẩu
 * @returns {Promise<Object>} - Thông tin người dùng
 */
async function login(email, password) {
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
      credentials: "include",
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Đăng nhập thất bại");
    }

    const userData = await response.json();
    console.log(userData);

    // Lưu thông tin người dùng vào storage
    await saveUserData(userData);

    // Cập nhật biến người dùng hiện tại
    currentUser = userData;

    return userData;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
}

/**
 * Đăng xuất người dùng
 * @returns {Promise<void>}
 */
async function logout() {
  try {
    // Gọi API để xóa cookie JWT
    await fetch(`${API_URL}/auth/logout`, {
      method: "POST",
      credentials: "include",
    });

    // Xóa thông tin người dùng khỏi storage
    await chrome.storage.local.remove(["userData"]);
    currentUser = null;
  } catch (error) {
    console.error("Logout error:", error);
    throw error;
  }
}

/**
 * Lưu thông tin người dùng vào storage
 * @param {Object} userData - Thông tin người dùng
 * @returns {Promise<void>}
 */
async function saveUserData(userData) {
  try {
    await chrome.storage.local.set({
      userData: userData.user,
    });
  } catch (error) {
    console.error("Save user data error:", error);
    throw error;
  }
}

/**
 * Lấy thông tin người dùng từ storage
 * @returns {Promise<Object|null>} - Thông tin người dùng hoặc null nếu chưa đăng nhập
 */
async function getCurrentUser() {
  try {
    // Nếu đã có thông tin người dùng, trả về luôn
    if (currentUser) return currentUser;

    // Nếu chưa có, lấy từ storage
    const data = await chrome.storage.local.get(["userData"]);

    if (data.userData) {
      currentUser = {
        user: data.userData,
      };
      return currentUser;
    }

    return null;
  } catch (error) {
    console.error("Get current user error:", error);
    return null;
  }
}

/**
 * Kiểm tra người dùng đã đăng nhập hay chưa
 * @returns {Promise<boolean>} - true nếu đã đăng nhập, false nếu chưa
 */
async function isLoggedIn() {
  const user = await getCurrentUser();
  return !!user;
}

/**
 * Kiểm tra người dùng có quyền admin/giáo viên hay không
 * @returns {Promise<boolean>} - true nếu là admin/giáo viên, false nếu không
 */
async function isTeacherOrAdmin() {
  const user = await getCurrentUser();
  if (!user) return false;

  // Kiểm tra role của người dùng
  return (
    user.user.role?.roleType === "TEACHER" ||
    user.user.role?.roleType === "ADMIN"
  );
}

window.login = login;
window.logout = logout;
window.getCurrentUser = getCurrentUser;
window.isLoggedIn = isLoggedIn;
window.isTeacherOrAdmin = isTeacherOrAdmin;
