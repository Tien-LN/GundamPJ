import React from "react";
import { Link } from "react-router-dom";
import "./Footer.css";

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="footer-container">
        <div className="footer-row">
          <div className="footer-col about-col">
            <h3>PStudy</h3>
            <p>
              Nền tảng học trực tuyến hàng đầu cung cấp các khóa học chất lượng
              cao với giảng viên chuyên nghiệp, giúp bạn phát triển kỹ năng và
              đạt được mục tiêu học tập.
            </p>
            <div className="social-links">
              <a href="#" aria-label="Facebook">
                <i className="fa-brands fa-facebook-f"></i>
              </a>
              <a href="#" aria-label="Twitter">
                <i className="fa-brands fa-twitter"></i>
              </a>
              <a href="#" aria-label="Instagram">
                <i className="fa-brands fa-instagram"></i>
              </a>
              <a href="#" aria-label="LinkedIn">
                <i className="fa-brands fa-linkedin-in"></i>
              </a>
              <a href="#" aria-label="YouTube">
                <i className="fa-brands fa-youtube"></i>
              </a>
            </div>
          </div>

          <div className="footer-col links-col">
            <h3>Liên kết nhanh</h3>
            <ul>
              <li>
                <Link to="/">Trang chủ</Link>
              </li>
              <li>
                <Link to="/about">Về chúng tôi</Link>
              </li>
              <li>
                <Link to="/courses">Khóa học</Link>
              </li>
              <li>
                <Link to="/faq">Câu hỏi thường gặp</Link>
              </li>
              <li>
                <Link to="/contact">Liên hệ</Link>
              </li>
            </ul>
          </div>

          <div className="footer-col links-col">
            <h3>Hỗ trợ</h3>
            <ul>
              <li>
                <Link to="/terms">Điều khoản dịch vụ</Link>
              </li>
              <li>
                <Link to="/privacy">Chính sách bảo mật</Link>
              </li>
              <li>
                <Link to="/faq">Trung tâm trợ giúp</Link>
              </li>
              <li>
                <a href="mailto:support@pstudy.com">Hỗ trợ kỹ thuật</a>
              </li>
              <li>
                <a href="mailto:feedback@pstudy.com">Góp ý phản hồi</a>
              </li>
            </ul>
          </div>

          <div className="footer-col contact-col">
            <h3>Liên hệ</h3>
            <ul className="contact-info">
              <li>
                <i className="fa-solid fa-location-dot"></i>
                <span>123 Education Street, Learning City, 10000</span>
              </li>
              <li>
                <i className="fa-solid fa-phone"></i>
                <span>
                  <a href="tel:+1234567890">(123) 456-7890</a>
                </span>
              </li>
              <li>
                <i className="fa-solid fa-envelope"></i>
                <span>
                  <a href="mailto:info@pstudy.com">info@pstudy.com</a>
                </span>
              </li>
              <li>
                <i className="fa-solid fa-clock"></i>
                <span>Thứ Hai - Thứ Sáu: 9:00 - 17:00</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="copyright">
            <p>&copy; {currentYear} PStudy. Bảo lưu mọi quyền.</p>
          </div>
          <div className="footer-bottom-links">
            <Link to="/terms">Điều khoản</Link>
            <Link to="/privacy">Bảo mật</Link>
            <Link to="/cookies">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
