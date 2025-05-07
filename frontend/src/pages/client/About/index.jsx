import "./about.css";

function About() {
    return (
        <div className="about-container">
            <div className="about-header">
                <h1>About PSTUDY</h1>
                <div className="about-header-underline"></div>
                <p>Your trusted partner in online education</p>
            </div>

            <section className="about-section">
                <h2>Our Mission</h2>
                <p>
                    At PSTUDY, we believe that education should be accessible to everyone. 
                    Our mission is to provide high-quality learning experiences that empower 
                    students to achieve their academic and professional goals.
                </p>
            </section>

            <section className="about-section">
                <h2>Our Story</h2>
                <p>
                    Founded in 2023, PSTUDY began with a simple idea: to create a learning 
                    platform that combines academic excellence with technological innovation. 
                    What started as a small project has grown into a comprehensive learning 
                    management system serving students and educators worldwide.
                </p>
            </section>

            <section className="about-section">
                <h2>Our Team</h2>
                <div className="team-grid">
                    <div className="team-member">
                        <div className="team-member-avatar">
                            <i className="fa-solid fa-user"></i>
                        </div>
                        <h3>John Doe</h3>
                        <p>Founder & CEO</p>
                    </div>
                    <div className="team-member">
                        <div className="team-member-avatar">
                            <i className="fa-solid fa-user"></i>
                        </div>
                        <h3>Jane Smith</h3>
                        <p>Head of Education</p>
                    </div>
                    <div className="team-member">
                        <div className="team-member-avatar">
                            <i className="fa-solid fa-user"></i>
                        </div>
                        <h3>David Johnson</h3>
                        <p>Lead Developer</p>
                    </div>
                </div>
            </section>

            <section className="about-section">
                <h2>Contact Us</h2>
                <p>
                    Have questions or feedback? We'd love to hear from you! Reach out to us at 
                    <a href="mailto:info@pstudy.com"> info@pstudy.com</a> or call us at 
                    <a href="tel:+1234567890"> (123) 456-7890</a>.
                </p>
            </section>
        </div>
    );
}

export default About;