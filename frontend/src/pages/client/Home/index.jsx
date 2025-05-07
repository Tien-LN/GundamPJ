import './home.css'
import { Link } from 'react-router-dom';

function Home() {
    return (
        <div className="home-container">
            {/* Hero Section */}
            <section className="hero-section">
                <div className="hero-content">
                    <h1 className="hero-title">PSTUDY Learning Management System</h1>
                    <p className="hero-subtitle">Nền tảng học tập trực tuyến hiện đại cho mọi người</p>
                    <div className="hero-buttons">
                        <Link to="/courses" className="hero-button primary">Khám phá khóa học</Link>
                        <Link to="/login" className="hero-button secondary">Đăng nhập</Link>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="features-section">
                <div className="section-header">
                    <h2 className="section-title">Tại sao chọn PSTUDY?</h2>
                    <p className="section-subtitle">Nền tảng học tập hiện đại với nhiều tính năng vượt trội</p>
                </div>

                <div className="features-grid">
                    <div className="feature-card">
                        <div className="feature-icon">
                            <i className="fa-solid fa-graduation-cap"></i>
                        </div>
                        <h3 className="feature-title">Học tập linh hoạt</h3>
                        <p className="feature-description">Không gian học tập mở và năng động. Thỏa sức làm việc nhóm, thỏa sức vận động</p>
                    </div>

                    <div className="feature-card">
                        <div className="feature-icon">
                            <i className="fa-solid fa-lightbulb"></i>
                        </div>
                        <h3 className="feature-title">Sáng tạo không giới hạn</h3>
                        <p className="feature-description">Trang trí sáng tạo, kích thích cảm hứng học tập</p>
                    </div>

                    <div className="feature-card">
                        <div className="feature-icon">
                            <i className="fa-solid fa-laptop"></i>
                        </div>
                        <h3 className="feature-title">Công nghệ hiện đại</h3>
                        <p className="feature-description">Thiết bị tương tác thông minh, giúp việc học trở nên thú vị</p>
                    </div>
                </div>
            </section>

            {/* Courses Section */}
            <section className="courses-section">
                <div className="section-header">
                    <h2 className="section-title">Chương trình học đa dạng</h2>
                    <p className="section-subtitle">Khám phá các khóa học chất lượng cao</p>
                </div>

                <div className="courses-grid">
                    <div className="course-card">
                        <div className="course-icon">
                            <i className="fa-solid fa-calculator"></i>
                        </div>
                        <h3 className="course-title">Toán học</h3>
                        <p className="course-description">Phát triển tư duy logic và kỹ năng giải quyết vấn đề</p>
                    </div>

                    <div className="course-card">
                        <div className="course-icon">
                            <i className="fa-solid fa-flask"></i>
                        </div>
                        <h3 className="course-title">Khoa học</h3>
                        <p className="course-description">Khám phá thế giới tự nhiên qua các thí nghiệm thú vị</p>
                    </div>

                    <div className="course-card">
                        <div className="course-icon">
                            <i className="fa-solid fa-language"></i>
                        </div>
                        <h3 className="course-title">Tiếng Anh</h3>
                        <p className="course-description">Toán và Khoa học ứng dụng bằng tiếng Anh</p>
                    </div>
                </div>
            </section>

            {/* Call to Action */}
            <section className="cta-section">
                <h2 className="cta-title">Sẵn sàng bắt đầu hành trình học tập?</h2>
                <p className="cta-description">Đăng ký ngay hôm nay để trải nghiệm nền tảng học tập hiện đại</p>
                <Link to="/login" className="cta-button">Bắt đầu ngay</Link>
            </section>
        </div>
    )
}

export default Home;