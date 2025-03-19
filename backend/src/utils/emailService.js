require("dotenv").config();
const axios = require("axios");
const sgMail = require("@sendgrid/mail");
const redis = require("redis");

const client = redis.createClient();
client.on("error", (err) => console.error("❌ Redis connection error:", err));
client.connect();

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
    // kiểm tra email đã có trong cache chưa:
    if (client.isReady) {
      const cachedResult = await client.get(email);
      if (cachedResult) {
        console.log(`sử dụng cache cho ${email}`);
        return JSON.parse(cachedResult);
      }
    }

    // gọi API validate email:
    const API_KEY = process.env.ABSTRACT_API_KEY;
    const response = await axios.get(
      `https://emailvalidation.abstractapi.com/v1/?api_key=${API_KEY}&email=${email}`
    );

    console.log(response);

    if (!response.data) {
      return { valid: false, message: "❌ Không nhận được phản hồi từ API." };
    }

    const { is_valid_format, is_mx_found, is_smtp_valid, is_disposable_email } =
      response.data;

    let result;
    if (!is_valid_format.value) {
      result = { valid: false, message: "❌ Định dạng email không hợp lệ." };
    } else if (!is_mx_found.value) {
      result = {
        valid: false,
        message: "❌ Email không có bản ghi MX hợp lệ.",
      };
    } else if (!is_smtp_valid.value) {
      result = {
        valid: false,
        message: "❌ Email không tồn tại trên máy chủ.",
      };
    } else if (is_disposable_email.value) {
      result = { valid: false, message: "❌ Email là email tạm thời." };
    } else {
      result = { valid: true, message: "✅ Email hợp lệ." };
    }

    // lưu vào redis cache trong vòng 24h
    await client.setEx(email, 86400, JSON.stringify(result));

    return result;
  } catch (error) {
    console.error("Lỗi kiểm tra email: ", error.message);
    return { valid: false, message: "❌ Lỗi server khi kiểm tra email." };
  }
};

const validateEmailBatch = async (emails) => {
  const results = [];
  for (let i = 0; i < emails.length; i += 5) {
    const batch = emails.slice(i, i + 5);
    const batchResults = await Promise.allSettled(
      batch.map((email) => validateEmail(email))
    );

    batchResults.forEach((res, index) => {
      results.push({
        email: batch[index],
        ...(res.status === "fulfilled"
          ? res.value
          : { valid: false, message: "❌ Lỗi kiểm tra email" }),
      });
    });

    if (i + 5 < emails.length) {
      await new Promise((res) => setTimeout(res, 1000));
    }
  }
  return results;
};

module.exports = { sendEmail, validateEmail, validateEmailBatch };
