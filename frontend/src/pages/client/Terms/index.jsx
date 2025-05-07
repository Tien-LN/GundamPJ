import React from "react";
import { Link } from "react-router-dom";
import "./terms.css";

function Terms() {
  return (
    <div className="terms-container">
      <div className="terms-header">
        <h1>Điều khoản dịch vụ</h1>
        <div className="terms-header-underline"></div>
        <p>Cập nhật lần cuối: 01/06/2023</p>
      </div>

      <div className="terms-content">
        <section className="terms-section">
          <h2>1. Giới thiệu</h2>
          <p>
            Chào mừng bạn đến với PStudy. Các Điều khoản Dịch vụ này ("Điều
            khoản") điều chỉnh việc bạn truy cập và sử dụng nền tảng học trực
            tuyến của chúng tôi, bao gồm trang web, ứng dụng di động, và tất cả
            các dịch vụ liên quan (gọi chung là "Dịch vụ").
          </p>
          <p>
            Bằng cách truy cập hoặc sử dụng Dịch vụ của chúng tôi, bạn đồng ý bị
            ràng buộc bởi các Điều khoản này. Nếu bạn không đồng ý với bất kỳ
            phần nào của các Điều khoản này, bạn không được phép truy cập hoặc
            sử dụng Dịch vụ của chúng tôi.
          </p>
        </section>

        <section className="terms-section">
          <h2>2. Tài khoản người dùng</h2>

          <h3>2.1 Đăng ký tài khoản</h3>
          <p>
            Để sử dụng một số tính năng của Dịch vụ, bạn có thể cần phải đăng ký
            tài khoản. Khi đăng ký, bạn đồng ý cung cấp thông tin chính xác, đầy
            đủ và cập nhật. Bạn chịu trách nhiệm duy trì tính bảo mật của tài
            khoản và mật khẩu của mình.
          </p>

          <h3>2.2 Trách nhiệm tài khoản</h3>
          <p>
            Bạn chịu trách nhiệm cho tất cả các hoạt động diễn ra dưới tài khoản
            của mình. Bạn đồng ý thông báo cho chúng tôi ngay lập tức về bất kỳ
            việc sử dụng trái phép tài khoản của bạn hoặc bất kỳ vi phạm bảo mật
            nào khác.
          </p>

          <h3>2.3 Đủ tuổi</h3>
          <p>
            Bạn phải từ 16 tuổi trở lên để đăng ký tài khoản. Nếu bạn dưới 18
            tuổi, bạn phải có sự đồng ý của cha mẹ hoặc người giám hộ hợp pháp
            để sử dụng Dịch vụ của chúng tôi.
          </p>
        </section>

        <section className="terms-section">
          <h2>3. Khóa học và thanh toán</h2>

          <h3>3.1 Đăng ký khóa học</h3>
          <p>
            Khi bạn đăng ký khóa học trên nền tảng của chúng tôi, bạn đồng ý
            thanh toán tất cả các khoản phí liên quan đến khóa học đó. Các khoản
            phí có thể thay đổi và sẽ được hiển thị rõ ràng trước khi bạn hoàn
            tất việc đăng ký.
          </p>

          <h3>3.2 Phương thức thanh toán</h3>
          <p>
            Chúng tôi chấp nhận nhiều phương thức thanh toán khác nhau, bao gồm
            thẻ tín dụng/ghi nợ, chuyển khoản ngân hàng, và các ví điện tử. Bằng
            cách cung cấp thông tin thanh toán, bạn xác nhận rằng bạn được ủy
            quyền sử dụng phương thức thanh toán đó.
          </p>

          <h3>3.3 Chính sách hoàn tiền</h3>
          <p>
            Chúng tôi cung cấp chính sách hoàn tiền trong vòng 30 ngày cho hầu
            hết các khóa học. Nếu bạn không hài lòng với khóa học, bạn có thể
            yêu cầu hoàn tiền đầy đủ trong vòng 30 ngày kể từ ngày mua. Một số
            khóa học đặc biệt có thể có chính sách hoàn tiền khác, sẽ được nêu
            rõ trên trang chi tiết khóa học.
          </p>

          <h3>3.4 Truy cập khóa học</h3>
          <p>
            Sau khi đăng ký và thanh toán thành công, bạn sẽ được cấp quyền truy
            cập vào khóa học. Thời hạn truy cập phụ thuộc vào loại khóa học và
            sẽ được nêu rõ trên trang chi tiết khóa học.
          </p>
        </section>

        <section className="terms-section">
          <h2>4. Quyền sở hữu trí tuệ</h2>

          <h3>4.1 Nội dung của chúng tôi</h3>
          <p>
            Tất cả nội dung trên nền tảng của chúng tôi, bao gồm nhưng không
            giới hạn ở văn bản, đồ họa, logo, biểu tượng, hình ảnh, clip âm
            thanh, video, phần mềm và giao diện người dùng, là tài sản của chúng
            tôi hoặc các nhà cung cấp nội dung của chúng tôi và được bảo vệ bởi
            luật bản quyền, thương hiệu và các luật sở hữu trí tuệ khác.
          </p>

          <h3>4.2 Giấy phép sử dụng</h3>
          <p>
            Chúng tôi cấp cho bạn giấy phép có giới hạn, không độc quyền, không
            thể chuyển nhượng để truy cập và sử dụng Dịch vụ của chúng tôi cho
            mục đích học tập cá nhân. Bạn không được sao chép, phân phối, sửa
            đổi, hiển thị công khai, thực hiện công khai, tái xuất bản, tải
            xuống, lưu trữ hoặc truyền bất kỳ nội dung nào từ nền tảng của chúng
            tôi, trừ khi được cho phép rõ ràng.
          </p>

          <h3>4.3 Nội dung người dùng</h3>
          <p>
            Bạn giữ quyền sở hữu đối với bất kỳ nội dung nào bạn gửi lên nền
            tảng của chúng tôi ("Nội dung người dùng"). Tuy nhiên, bằng cách gửi
            Nội dung người dùng, bạn cấp cho chúng tôi giấy phép toàn cầu, không
            độc quyền, miễn phí bản quyền để sử dụng, sao chép, sửa đổi, hiển
            thị công khai, thực hiện công khai, phân phối và tạo các tác phẩm
            phái sinh từ Nội dung người dùng của bạn liên quan đến Dịch vụ của
            chúng tôi.
          </p>
        </section>

        <section className="terms-section">
          <h2>5. Quy tắc ứng xử</h2>
          <p>Khi sử dụng Dịch vụ của chúng tôi, bạn đồng ý không:</p>
          <ul>
            <li>Vi phạm bất kỳ luật pháp hoặc quy định hiện hành nào</li>
            <li>
              Xâm phạm quyền sở hữu trí tuệ hoặc quyền riêng tư của người khác
            </li>
            <li>
              Đăng, tải lên hoặc truyền bất kỳ nội dung nào mang tính phỉ báng,
              khiêu dâm, xúc phạm, đe dọa hoặc quấy rối
            </li>
            <li>
              Sử dụng Dịch vụ để gửi thư rác, lừa đảo hoặc phần mềm độc hại
            </li>
            <li>
              Can thiệp vào hoạt động bình thường của Dịch vụ hoặc cơ sở hạ tầng
              của chúng tôi
            </li>
            <li>
              Truy cập trái phép vào bất kỳ phần nào của Dịch vụ, tài khoản
              người dùng khác, hoặc hệ thống máy tính hoặc mạng kết nối với Dịch
              vụ của chúng tôi
            </li>
            <li>
              Thu thập hoặc lưu trữ thông tin cá nhân về người dùng khác mà
              không có sự đồng ý của họ
            </li>
            <li>
              Giả mạo bất kỳ cá nhân hoặc tổ chức nào, hoặc xuyên tạc mối quan
              hệ của bạn với bất kỳ cá nhân hoặc tổ chức nào
            </li>
          </ul>
        </section>

        <section className="terms-section">
          <h2>6. Chấm dứt</h2>
          <p>
            Chúng tôi có quyền đình chỉ hoặc chấm dứt quyền truy cập của bạn vào
            Dịch vụ của chúng tôi, với hoặc không có thông báo trước, vì bất kỳ
            lý do gì, bao gồm nhưng không giới hạn ở việc vi phạm các Điều khoản
            này.
          </p>
          <p>
            Tất cả các điều khoản của Thỏa thuận này, mà theo bản chất hoặc ngôn
            từ rõ ràng của chúng, nhằm mục đích tồn tại sau khi chấm dứt Thỏa
            thuận này, sẽ tiếp tục có hiệu lực sau khi chấm dứt.
          </p>
        </section>

        <section className="terms-section">
          <h2>7. Từ chối bảo đảm</h2>
          <p>
            DỊCH VỤ CỦA CHÚNG TÔI ĐƯỢC CUNG CẤP "NGUYÊN TRẠNG" VÀ "NHƯ CÓ SẴN",
            MÀ KHÔNG CÓ BẤT KỲ BẢO ĐẢM NÀO, DÙ RÕ RÀNG HAY NGỤ Ý. CHÚNG TÔI
            KHÔNG ĐẢM BẢO RẰNG DỊCH VỤ SẼ ĐÁP ỨNG YÊU CẦU CỦA BẠN HOẶC SẼ KHÔNG
            BỊ GIÁN ĐOẠN, KỊP THỜI, AN TOÀN HOẶC KHÔNG CÓ LỖI.
          </p>
        </section>

        <section className="terms-section">
          <h2>8. Giới hạn trách nhiệm</h2>
          <p>
            TRONG MỌI TRƯỜNG HỢP, CHÚNG TÔI SẼ KHÔNG CHỊU TRÁCH NHIỆM VỚI BẠN
            HOẶC BẤT KỲ BÊN THỨ BA NÀO VỀ BẤT KỲ THIỆT HẠI GIÁN TIẾP, DO HẬU
            QUẢ, NGẪU NHIÊN, ĐẶC BIỆT HOẶC MANG TÍNH TRỪNG PHẠT, BAO GỒM MẤT LỢI
            NHUẬN, PHÁT SINH TỪ VIỆC SỬ DỤNG HOẶC KHÔNG THỂ SỬ DỤNG DỊCH VỤ CỦA
            CHÚNG TÔI.
          </p>
        </section>

        <section className="terms-section">
          <h2>9. Thay đổi đối với Điều khoản</h2>
          <p>
            Chúng tôi có thể sửa đổi các Điều khoản này theo thời gian. Nếu
            chúng tôi thực hiện các thay đổi, chúng tôi sẽ cung cấp thông báo
            hợp lý, chẳng hạn như đăng thông báo trên Dịch vụ của chúng tôi hoặc
            gửi email cho bạn. Việc bạn tiếp tục sử dụng Dịch vụ sau khi các
            thay đổi có hiệu lực đồng nghĩa với việc bạn chấp nhận các Điều
            khoản đã sửa đổi.
          </p>
        </section>

        <section className="terms-section">
          <h2>10. Luật áp dụng</h2>
          <p>
            Các Điều khoản này sẽ được điều chỉnh và giải thích theo luật pháp
            Việt Nam, không tính đến các nguyên tắc xung đột pháp luật.
          </p>
        </section>

        <section className="terms-section">
          <h2>11. Liên hệ</h2>
          <p>
            Nếu bạn có bất kỳ câu hỏi nào về các Điều khoản này, vui lòng liên
            hệ với chúng tôi tại:
          </p>
          <div className="contact-info">
            <p>
              <strong>Email:</strong>{" "}
              <a href="mailto:terms@pstudy.com">terms@pstudy.com</a>
            </p>
            <p>
              <strong>Địa chỉ:</strong> 123 Education Street, Learning City,
              10000
            </p>
            <p>
              <strong>Điện thoại:</strong>{" "}
              <a href="tel:+1234567890">(123) 456-7890</a>
            </p>
          </div>
        </section>

        <div className="terms-links">
          <p>Các chính sách liên quan:</p>
          <Link to="/privacy">Chính sách bảo mật</Link>
        </div>
      </div>

      <div className="terms-footer">
        <p>© 2023 PStudy. Bảo lưu mọi quyền.</p>
      </div>
    </div>
  );
}

export default Terms;
