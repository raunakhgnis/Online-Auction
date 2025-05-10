// import React from 'react';
// import './Footer.css'; // Create this

// const Footer = () => {
//     return (
//         <footer className="footer-container">
//             <div className="footer-content">
//                 <div className="footer-section about">
//                     {/* Content from video if any, or general info */}
//                     {/* <h4 className="footer-title">Online Auction</h4>
//                     <p>Your trusted platform for unique finds and exciting bids.</p> */}
//                 </div>
//                 <div className="footer-section links">
//                     {/* <h4 className="footer-title">Quick Links</h4>
//                     <ul>
//                         <li><a href="#home">Home</a></li>
//                         <li><a href="#about">About Us</a></li>
//                         <li><a href="#contact">Contact</a></li>
//                         <li><a href="#faq">FAQ</a></li>
//                     </ul> */}
//                 </div>
//                 <div className="footer-section newsletter">
//                     {/* From Video: STAY UPTO DATE ABOUT OUR LATEST OFFERS */}
//                     {/* <h4 className="footer-title">Stay Updated</h4>
//                     <p>Subscribe to our newsletter for the latest offers.</p>
//                     <form className="newsletter-form">
//                         <input type="email" placeholder="Enter your email" />
//                         <button type="submit">Subscribe</button>
//                     </form> */}
//                 </div>
//             </div>
//             <div className="footer-bottom">
//                 © {new Date().getFullYear()} Online Auction Website. All Rights Reserved.
//                 {/* Common Questions from video */}
//                 {/* <p>Some Questions People Usually Ask</p> */}
//             </div>
//         </footer>
//     );
// };
// export default Footer;


import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';
// You'll need social media icons. You can use an icon library like react-icons
// or use SVGs/images. For simplicity, I'll use text placeholders.
// To use react-icons: npm install react-icons
// import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from 'react-icons/fa';

const Footer = () => {
    const handleNewsletterSubmit = (e) => {
        e.preventDefault();
        // TODO: Implement newsletter subscription logic
        alert("Thank you for subscribing! (This is a demo)");
        e.target.reset();
    };

    return (
        <footer className="site-footer">
            {/* Optional Newsletter Section */}
            <div className="footer-newsletter-section">
                <div className="container"> {/* Optional container for centering */}
                    <h3>Stay Up-to-Date with Our Auctions!</h3>
                    <p>Subscribe to our newsletter for new items, special offers, and auction news.</p>
                    <form onSubmit={handleNewsletterSubmit} className="newsletter-form">
                        <input type="email" placeholder="Enter your email address" required />
                        <button type="submit">Subscribe</button>
                    </form>
                </div>
            </div>

            <div className="footer-main">
                <div className="container">
                    <div className="footer-social-media">
                        {/* Replace with actual icons or links */}
                        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                            {/* <FaFacebookF /> */} FB
                        </a>
                        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                            {/* <FaTwitter /> */} TW
                        </a>
                        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                            {/* <FaInstagram /> */} IG
                        </a>
                        <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                            {/* <FaLinkedinIn /> */} LI
                        </a>
                    </div>

                    <nav className="footer-navigation">
                        <Link to="/">Home</Link>
                        <Link to="/category/All">Products</Link> {/* Assuming /category/All shows all products */}
                        <Link to="/profile">Profile</Link>
                    </nav>

                    <nav className="footer-secondary-navigation">
                        <Link to="/contact">Contact Us</Link>
                        <Link to="/blog">Blog</Link>
                        <Link to="/about">About Us</Link>
                    </nav>
                </div>
            </div>

            <div className="footer-bottom">
                <div className="container">
                    <p>© {new Date().getFullYear()} Online Auction Platform. All Rights Reserved.</p>
                    {/* You can add more info like "Designed by..." or a small tagline here */}
                </div>
            </div>
        </footer>
    );
};

export default Footer;
