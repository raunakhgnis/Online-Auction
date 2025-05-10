import React, { useState } from 'react';
import './ContactPage.css';

const ContactPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [formMessage, setFormMessage] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // TODO: Implement actual form submission logic (e.g., send to an API endpoint or email service)
        console.log("Form data submitted:", formData);
        setFormMessage("Thank you for your message! We'll get back to you soon. (This is a demo)");
        setFormData({ name: '', email: '', subject: '', message: '' }); // Reset form
    };

    return (
        <div className="contact-page page-container">
            <div className="contact-hero">
                <h1>Contact Us</h1>
                <p>We'd love to hear from you! Whether you have a question about features, auctions, or anything else, our team is ready to answer all your questions.</p>
            </div>

            <div className="contact-content-wrapper">
                <div className="contact-info-section">
                    <h3>Get in Touch Directly</h3>
                    <p>
                        Feel free to reach out to us via phone or email. We strive to respond to all inquiries
                        within 24 business hours.
                    </p>
                    <ul className="contact-details">
                        <li>
                            <strong>Phone:</strong>
                            <a href="tel:+915487862457">+1 (234) 567-890</a> (Mon-Fri, 9am-5pm EST)
                        </li>
                        <li>
                            <strong>Email:</strong>
                            <a href="mailto:support@onlineauction.com">support@onlineauction.com</a>
                        </li>
                        <li>
                            <strong>General Inquiries:</strong>
                            <a href="mailto:info@onlineauction.com">info@onlineauction.com</a>
                        </li>
                    </ul>
                    {/* Optional: Add physical address or map embed here */}
                </div>

                <div className="contact-form-section">
                    <h3>Send Us a Message</h3>
                    {formMessage && <p className="message success">{formMessage}</p>}
                    <form onSubmit={handleSubmit} className="contact-form">
                        <div className="form-group">
                            <label htmlFor="name">Full Name</label>
                            <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="email">Email Address</label>
                            <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="subject">Subject</label>
                            <input type="text" id="subject" name="subject" value={formData.subject} onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="message">Your Message</label>
                            <textarea id="message" name="message" value={formData.message} onChange={handleChange} rows="6" required></textarea>
                        </div>
                        <button type="submit" className="submit-contact-button">Send Message</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ContactPage;
