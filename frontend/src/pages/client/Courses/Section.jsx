import { Link } from "react-router-dom";
import "./Section.scss";
function Section(){
    return (
        <>
            <div className="section">
                <div className="section__containnerImg">
                    <img className="section__image" src="https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500" alt="ảnh"/>
                    <span className="section__description">UNIT 1 - UNIT 10</span>
                </div>
                
                
                <ul className="section__units">
                    <div className="section__units-hr"></div>
                    <li className="section__unit">
                        <h2 className="section__unit-title">Unit 1 : SCIENCE  IN LIFE (khoa học trong cuộc sống)</h2>
                        <ul className="section__lessons">
                            <li className="section__lessons-item">
                                <Link className="section__lessons-link">Lessons 1: My Body - Cơ thể của bé</Link>
                            </li>
                            <li className="section__lessons-item">
                                <Link className="section__lessons-link">Lesson 2: My sense - Các giác quan của bé </Link>
                            </li>
                            <li className="section__lessons-item">
                                <Link className="section__lessons-link">Lesson 3: Healthy Foods – Thức ăn tốt cho sức khỏe</Link>
                            </li>
                            <li className="section__lessons-item">
                                <Link className="section__lessons-link">Lesson 4: Animals Around Me – Những con vật quanh bé</Link>
                            </li>
                            <li className="section__lessons-item">
                                <Link className="section__lessons-link">Lesson 5: Big and Small Animals – Động vật to và nhỏ</Link>
                            </li>
                        </ul>
                    </li>
                </ul>
            </div>

        </>
    )
}
export default Section;