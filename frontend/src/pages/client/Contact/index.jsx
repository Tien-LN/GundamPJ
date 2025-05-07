import { useState } from "react";
import "./contact.css";

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    // Validate form
    if (!formData.name || !formData.email || !formData.message) {
      setSubmitStatus({
        success: false,
        message: "Please fill out all required fields.",
      });
      setIsSubmitting(false);
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setSubmitStatus({
        success: false,
        message: "Please enter a valid email address.",
      });
      setIsSubmitting(false);
      return;
    }

    // Simulate API call
    try {
      // In a real implementation, you would send the form data to your backend
      // await axios.post('http://localhost:3000/api/contact', formData, {
      //     withCredentials: true
      // });

      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setSubmitStatus({
        success: true,
        message: "Thank you for your message! We'll get back to you soon.",
      });

      // Reset form
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
    } catch (error) {
      console.error("Error submitting form:", error);
      setSubmitStatus({
        success: false,
        message:
          "There was an error sending your message. Please try again later.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="contact-container">
      <div className="contact-header">
        <h1>Contact Us</h1>
        <div className="contact-header-underline"></div>
        <p>We'd love to hear from you</p>
      </div>

      <div className="contact-content">
        <div className="contact-info">
          <div className="contact-info-item">
            <div className="contact-icon">
              <i className="fa-solid fa-location-dot"></i>
            </div>
            <div className="contact-text">
              <h3>Our Location</h3>
              <p>123 Education Street, Learning City, 10000</p>
            </div>
          </div>

          <div className="contact-info-item">
            <div className="contact-icon">
              <i className="fa-solid fa-envelope"></i>
            </div>
            <div className="contact-text">
              <h3>Email Us</h3>
              <p>
                <a href="mailto:info@pstudy.com">info@pstudy.com</a>
              </p>
            </div>
          </div>

          <div className="contact-info-item">
            <div className="contact-icon">
              <i className="fa-solid fa-phone"></i>
            </div>
            <div className="contact-text">
              <h3>Call Us</h3>
              <p>
                <a href="tel:+1234567890">(123) 456-7890</a>
              </p>
            </div>
          </div>

          <div className="contact-social">
            <h3>Follow Us</h3>
            <div className="social-icons">
              <a href="#" className="social-icon">
                <i className="fa-brands fa-facebook"></i>
              </a>
              <a href="#" className="social-icon">
                <i className="fa-brands fa-twitter"></i>
              </a>
              <a href="#" className="social-icon">
                <i className="fa-brands fa-instagram"></i>
              </a>
              <a href="#" className="social-icon">
                <i className="fa-brands fa-linkedin"></i>
              </a>
            </div>
          </div>
        </div>

        <div className="contact-form-container">
          <h2>Send Us a Message</h2>

          {submitStatus && (
            <div
              className={`form-status ${
                submitStatus.success ? "success" : "error"
              }`}
            >
              {submitStatus.message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="contact-form">
            <div className="form-group">
              <label htmlFor="name">
                Your Name <span className="required">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your name"
                disabled={isSubmitting}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">
                Your Email <span className="required">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                disabled={isSubmitting}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="subject">Subject</label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="Enter subject"
                disabled={isSubmitting}
              />
            </div>

            <div className="form-group">
              <label htmlFor="message">
                Message <span className="required">*</span>
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Enter your message"
                rows="5"
                disabled={isSubmitting}
                required
              ></textarea>
            </div>

            <button
              type="submit"
              className={`submit-button ${isSubmitting ? "loading" : ""}`}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <i className="fa-solid fa-spinner fa-spin"></i>
                  <span>Sending...</span>
                </>
              ) : (
                "Send Message"
              )}
            </button>
          </form>
        </div>
      </div>

      <div className="contact-map">
        <h2>Find Us On Map</h2>
        <div className="map-placeholder">
          <i className="fa-solid fa-map"></i>
          <p>Map integration would be here in a real implementation</p>
        </div>
      </div>
    </div>
  );
}

export default Contact;
