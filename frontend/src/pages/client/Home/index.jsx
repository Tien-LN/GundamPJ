import './home.css'

function Home() {
    return (
        <>
            <div className="home-container">
                <div className='linear'></div>
                <img src="../../public/img/Frame 12.png" className='banner' />
                <div className='home-container__background'>
                    <div className='home-container__box'>
                        <div className='home-container__box--reason'>
                            <h1 className='home-container__box-header'>LÝ DO CHỌN iSMART</h1>
                            <div className='home-container__box--reason-descrip'>
                                <img src='../../public/img/Ảnh 1.png'></img>
                                <ul className='home-container__box--reason-descrip__list'>
                                    <li className='home-container-box-reason-desctip__list--detail'>Không gian học tập mở và năng động. Thỏa sức làm việc nhóm, thỏa sức vận động</li>
                                    <li className='home-container-box-reason-desctip__list--detail'>Trang trí sáng tạo, kích thích cảm hứng học tập</li>
                                    <li className='home-container-box-reason-desctip__list--detail'>Thiết bị tương tác thông minh, giúp việc học trở nên thú vị</li>
                                </ul>
                            </div>
                        </div>
                        <div className='home-container__box--content'>
                            <h1 className='home-container__box-header'>Nội dung của chương trình học iSMART</h1>
                            <h3 className='home-container__box-more'>4 TIẾT HỌC TRẢI NGHIỆM TẠI LỚP HỌC CHỨC NĂNG</h3>
                            <div className='home-containcer__box--content-courses'>
                                <div className='home-container__box--content-courses__detail1'>1 tiết Toán</div>
                                <div className='home-container__box--content-courses__detail2'>1 tiết Khoa học</div>
                                <div className='home-container__box--content-courses__detail3'>2 tiết Tiếng Anh (Toán và Khoa học ứng dụng)</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
export default Home;