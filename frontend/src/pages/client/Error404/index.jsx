import { Link } from "react-router-dom";
import "./Error404.scss";
function Error404(){
    return (
        <>
            <div className="error404">
                <span className="error404__meteor" style={{"--x": 20, "--y": 20, "--s": 5400}}></span>
                <span className="error404__meteor" style={{"--x": 100, "--y": 30, "--s": 3400}}></span>
                <span className="error404__meteor" style={{"--x": 250, "--y": 80, "--s": 4000}}></span>
                <span className="error404__meteor" style={{"--x": 450, "--y": 20, "--s": 3000}}></span>
                <span className="error404__meteor" style={{"--x": 600, "--y": 10, "--s": 2600}}></span>
                <span className="error404__meteor" style={{"--x": 700, "--y": 24, "--s": 9800}}></span>
                <span className="error404__meteor" style={{"--x": 800, "--y": 30, "--s": 4400}}></span>
                <div className="error404__containner">
                    <p className="error404__subtitle">Opps!!!</p>
                    <h1 className="error404__title">404</h1>
                    <p className="error404__description">
                        Sorry. The link you clicked may be broken or the page may have been moved.
                    </p>
                    <p className="error404__footer">
                        Visit the out <Link to="/">home</Link> or <Link to="/about">contact us</Link>
                    </p>
                </div>
            </div>
        </>
    )
};
export default Error404;