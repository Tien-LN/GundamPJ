import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./faq.css";

function Faq() {
    const [activeCategory, setActiveCategory] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [activeIndex, setActiveIndex] = useState(null);
    const [filteredFaqs, setFilteredFaqs] = useState([]);

    // FAQ data
    const faqData = [
        {
            id: 1,
            question: "Làm thế nào để đăng ký tài khoản?",
            answer: "Để đăng ký tài khoản, bạn cần nhấp vào nút 'Đăng ký' ở góc trên bên phải của trang web. Sau đó, điền thông tin cá nhân của bạn vào biểu mẫu đăng ký và làm theo hướng dẫn để hoàn tất quá trình đăng ký.",
            category: "account"
        },
        {
            id: 2,
            question: "Làm thế nào để đăng ký khóa học?",
            answer: "Để đăng ký khóa học, trước tiên bạn cần đăng nhập vào tài khoản của mình. Sau đó, duyệt qua danh sách khóa học hoặc tìm kiếm khóa học cụ thể. Khi tìm thấy khóa học bạn quan tâm, nhấp vào nút 'Đăng ký' hoặc 'Ghi danh' trên trang chi tiết khóa học.",
            category: "courses"
        },
        {
            id: 3,
            question: "Tôi có thể thanh toán bằng những phương thức nào?",
            answer: "Chúng tôi chấp nhận nhiều phương thức thanh toán khác nhau, bao gồm thẻ tín dụng/ghi nợ (Visa, MasterCard), chuyển khoản ngân hàng, và các ví điện tử phổ biến như MoMo, ZaloPay, và VNPay. Bạn có thể chọn phương thức thanh toán thuận tiện nhất khi thanh toán khóa học.",
            category: "payment"
        },
        {
            id: 4,
            question: "Làm thế nào để đặt lại mật khẩu của tôi?",
            answer: "Để đặt lại mật khẩu, nhấp vào liên kết 'Quên mật khẩu' trên trang đăng nhập. Nhập địa chỉ email đã đăng ký của bạn, và chúng tôi sẽ gửi cho bạn một email có hướng dẫn đặt lại mật khẩu. Làm theo hướng dẫn trong email để tạo mật khẩu mới.",
            category: "account"
        },
        {
            id: 5,
            question: "Tôi có thể truy cập khóa học trên thiết bị di động không?",
            answer: "Có, tất cả các khóa học của chúng tôi đều tương thích với thiết bị di động. Bạn có thể truy cập và học các khóa học trên điện thoại thông minh hoặc máy tính bảng thông qua trình duyệt web hoặc ứng dụng di động của chúng tôi, có sẵn cho cả iOS và Android.",
            category: "courses"
        },
        {
            id: 6,
            question: "Khóa học có thời hạn truy cập không?",
            answer: "Thời hạn truy cập khóa học phụ thuộc vào loại khóa học. Một số khóa học cung cấp quyền truy cập trọn đời, trong khi những khóa học khác có thể có thời hạn truy cập cụ thể (ví dụ: 6 tháng, 1 năm). Thông tin về thời hạn truy cập luôn được hiển thị rõ ràng trên trang chi tiết khóa học trước khi bạn đăng ký.",
            category: "courses"
        },
        {
            id: 7,
            question: "Tôi có thể yêu cầu hoàn tiền không?",
            answer: "Có, chúng tôi cung cấp chính sách hoàn tiền trong vòng 30 ngày. Nếu bạn không hài lòng với khóa học, bạn có thể yêu cầu hoàn tiền đầy đủ trong vòng 30 ngày kể từ ngày mua. Để yêu cầu hoàn tiền, vui lòng liên hệ với bộ phận hỗ trợ khách hàng của chúng tôi qua trang Liên hệ.",
            category: "payment"
        },
        {
            id: 8,
            question: "Làm thế nào để liên hệ với giảng viên?",
            answer: "Bạn có thể liên hệ với giảng viên thông qua diễn đàn thảo luận của khóa học hoặc hệ thống nhắn tin trong khóa học. Hầu hết các giảng viên đều phản hồi các câu hỏi trong vòng 24-48 giờ. Đối với các vấn đề khẩn cấp, bạn cũng có thể liên hệ với bộ phận hỗ trợ của chúng tôi.",
            category: "support"
        },
        {
            id: 9,
            question: "Tôi có thể tải xuống tài liệu khóa học không?",
            answer: "Có, hầu hết các khóa học của chúng tôi cung cấp tài liệu có thể tải xuống như PDF, bài tập, và tài nguyên bổ sung. Các tài liệu này có thể được truy cập và tải xuống từ phần 'Tài nguyên' hoặc 'Tài liệu' trong mỗi bài học của khóa học.",
            category: "courses"
        },
        {
            id: 10,
            question: "Làm thế nào để nhận chứng chỉ hoàn thành?",
            answer: "Để nhận chứng chỉ hoàn thành, bạn cần hoàn thành tất cả các bài học, bài tập, và bài kiểm tra bắt buộc trong khóa học với điểm đạt yêu cầu. Sau khi hoàn thành tất cả các yêu cầu, chứng chỉ sẽ tự động được cấp và có thể tải xuống từ trang 'Chứng chỉ' hoặc 'Thành tích' trong tài khoản của bạn.",
            category: "courses"
        },
    ];

    const categories = [
        { id: "all", name: "Tất cả" },
        { id: "account", name: "Tài khoản" },
        { id: "courses", name: "Khóa học" },
        { id: "payment", name: "Thanh toán" },
        { id: "support", name: "Hỗ trợ" },
    ];

    // Filter FAQs based on category and search query
    useEffect(() => {
        let filtered = faqData;

        // Filter by category
        if (activeCategory !== "all") {
            filtered = filtered.filter(faq => faq.category === activeCategory);
        }

        // Filter by search query
        if (searchQuery.trim() !== "") {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(
                faq => 
                    faq.question.toLowerCase().includes(query) || 
                    faq.answer.toLowerCase().includes(query)
            );
        }

        setFilteredFaqs(filtered);
    }, [activeCategory, searchQuery]);

    const toggleAccordion = (index) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    const handleCategoryChange = (categoryId) => {
        setActiveCategory(categoryId);
        setActiveIndex(null);
    };

    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
        setActiveIndex(null);
    };

    return (
        <div className="faq-container">
            <div className="faq-header">
                <h1>Câu hỏi thường gặp</h1>
                <div className="faq-header-underline"></div>
                <p>Tìm câu trả lời cho những câu hỏi phổ biến về nền tảng học trực tuyến của chúng tôi</p>
            </div>

            <div className="faq-search">
                <i className="fa-solid fa-magnifying-glass"></i>
                <input 
                    type="text" 
                    placeholder="Tìm kiếm câu hỏi..." 
                    value={searchQuery}
                    onChange={handleSearch}
                />
            </div>

            <div className="faq-categories">
                {categories.map(category => (
                    <button 
                        key={category.id}
                        className={`category-button ${activeCategory === category.id ? 'active' : ''}`}
                        onClick={() => handleCategoryChange(category.id)}
                    >
                        {category.name}
                    </button>
                ))}
            </div>

            <div className="faq-list">
                {filteredFaqs.length > 0 ? (
                    filteredFaqs.map((faq, index) => (
                        <div className="faq-item" key={faq.id}>
                            <div 
                                className={`faq-question ${activeIndex === index ? 'active' : ''}`}
                                onClick={() => toggleAccordion(index)}
                            >
                                {faq.question}
                                <i className={`fa-solid ${activeIndex === index ? 'fa-chevron-up' : 'fa-chevron-down'}`}></i>
                            </div>
                            <div className={`faq-answer ${activeIndex === index ? 'active' : ''}`}>
                                <p>{faq.answer}</p>
                            </div>
                        </div>
                    ))
                ) : (
                    <div style={{ textAlign: 'center', padding: '30px 0' }}>
                        <i className="fa-solid fa-search" style={{ fontSize: '40px', color: '#ddd', marginBottom: '15px' }}></i>
                        <p>Không tìm thấy câu hỏi nào phù hợp với tìm kiếm của bạn.</p>
                    </div>
                )}
            </div>

            <div className="faq-contact">
                <h2>Không tìm thấy câu trả lời bạn đang tìm kiếm?</h2>
                <p>Nếu bạn không thể tìm thấy câu trả lời cho câu hỏi của mình, vui lòng liên hệ với đội ngũ hỗ trợ của chúng tôi.</p>
                <Link to="/contact" className="contact-button">
                    <i className="fa-solid fa-envelope" style={{ marginRight: '8px' }}></i> Liên hệ với chúng tôi
                </Link>
            </div>
        </div>
    );
}

export default Faq;