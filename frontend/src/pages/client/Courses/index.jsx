import "./Courses.scss";
function Courses(){
    return (
        <>
            <div className="courses">
                <h1 className="courses__header">Khóa học đã đăng ký</h1>
                    <ul className="courses__type">
                        
                        <li className="subject">
                            <h2 className="courses__type-title">SEMESTER 1(Học kì 1) - GRADE 3</h2>

                            <div className="subject__containner">
                                <ul className="subject__list">
                                    <h3 className="subject__name">MATHS</h3>
                                    <ul className="subject__lessons">
                                        <li className="lessons lessons-1">
                                            <img src="https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500" alt="ảnh"/>
                                            <span className="lessons-title">UNIT 1 - 10</span>
                                        </li>
                                        <li className="lessons lessons-2">
                                            <img src="https://c8.alamy.com/comp/RBFJ21/education-shcool-supplies-to-study-background-RBFJ21.jpg" alt="ảnh"/>
                                            <span className="lessons-title">UNIT 1 - 10</span>
                                        </li>
                                        <li className="lessons lessons-3">
                                            <img src="https://i.ytimg.com/vi/b-q3a57JMCY/maxresdefault.jpg" alt="ảnh"/>
                                            <span className="lessons-title">UNIT 1 - 10</span>
                                        </li>
                                    </ul>
                                </ul>

                                <ul className="subject__list">
                                    <h3 className="subject__name">SIENCE</h3>
                                    <ul className="subject__lessons">
                                    <li className="lessons lessons-1">
                                            <img src="https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500" alt="ảnh"/>
                                            <span className="lessons-title">UNIT 1 - 10</span>
                                        </li>
                                        <li className="lessons lessons-2">
                                            <img src="https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500" alt="ảnh"/>
                                            <span className="lessons-title">UNIT 1 - 10</span>
                                        </li>
                                    </ul>
                                </ul>
                            </div>
                        </li>

                        <li className="subject">
                            <h2 className="courses__type-title">SEMESTER 2(Học kì 2) - GRADE 3</h2>

                            <div className="subject__containner">
                                <ul className="subject__list">
                                    <h3 className="subject__name">MATHS</h3>
                                    <ul className="subject__lessons">
                                    <li className="lessons lessons-1" >
                                            <img src="https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500" alt="ảnh"/>
                                            <span className="lessons-title">UNIT 1 - 10</span>
                                        </li>
                                        <li className="lessons lessons-2">
                                            <img src="https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500" alt="ảnh"/>
                                            <span className="lessons-title">UNIT 1 - 10</span>
                                        </li>
                                    </ul>
                                </ul>

                                <ul className="subject__list">
                                    <h3 className="subject__name">SIENCE</h3>
                                    <ul className="subject__lessons">
                                    <li className="lessons lessons-1">
                                            <img src="https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500" alt="ảnh"/>
                                            <span className="lessons-title">UNIT 1 - 10</span>
                                        </li>
                                        <li className="lessons lessons-2">
                                            <img src="https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500" alt="ảnh"/>
                                            <span className="lessons-title">UNIT 1 - 10</span>
                                        </li>
                                    </ul>
                                </ul>
                            </div>
                        </li>
                    </ul>
                
            </div>
        </> 
    )
}
export default Courses;