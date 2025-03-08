const axios = require("axios");
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendEmail = async (to, subject, text, html) => {
  const msg = {
    to,
    from: process.env.EMAIL_SENDER,
    subject,
    text,
    html,
  };

  try {
    await sgMail.send(msg);
    console.log(`✅ Email đã gửi đến ${to}`);
    return { success: true, message: "Email sent successfully" };
  } catch (error) {
    console.error(
      "❌ Lỗi khi gửi email",
      error.response?.body?.errors || error
    );
    return { success: false, message: "Failed to send email" };
  }
};

const validateEmail = async (email) => {
  try {
    const API_KEY = process.env.ZEROBOUNCE_API_KEY;
    const response = await axios.get(
      `https://api.zerobounce.net/v2/validate?api_key=${API_KEY}&email=${email}`
    );
    // console.log(response);
    const { status, sub_status } = response.data;

    if (status === "valid") {
      return { valid: true, message: "Email hợp lệ" };
    } else if (sub_status === "disposable") {
      return { valid: false, message: "Email dùng một lần (disposable email)" };
    } else if (status === "invalid") {
      return { valid: false, message: "Email không hợp lệ" };
    } else {
      return { valid: false, message: `Lỗi: ${status}, ${sub_status}` };
    }
  } catch (error) {
    console.error("Lỗi kiểm tra email: ", error.message);
    return { valid: false, message: "Lỗi server khi kiểm tra email" };
  }
};

module.exports = { sendEmail, validateEmail };
