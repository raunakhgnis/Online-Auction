import React from 'react';
import './AboutPage.css';
// Import placeholder images or actual images from your assets
// For example, if you place them in src/assets/team/
import person1Image from '../assets/team/person1.jpg'; // Replace with actual paths
import person2Image from '../assets/team/person2.png';
import person3Image from '../assets/team/person3.jpg';

const teamMembers = [
    {
        name: "Manikanta",
        role: "Founder & CEO",
        bio: "manikanta started Online Auction with a passion for connecting collectors and enthusiasts. With over 10 years in tech and e-commerce, Manikanta leads the vision and strategy.",
        image: person1Image // Replace with actual image or placeholder
    },
    {
        name: "Raunak Singh",
        role: "Head of Operations",
        bio: "I Felt very delightful working on this project.We always have enthuasium to connect people.",
        image: person2Image
    },
    {
        name: "Sasi vardhan",
        role: "Lead Developer",
        bio: "Sasi is the architect behind our robust platform. He's dedicated to building a secure, fast, and user-friendly auction site for everyone.",
        image: person3Image
    }
];

const AboutPage = () => {
    return (
        <div className="about-page page-container">
            <section className="about-hero">
                <h1>About Online Auction</h1>
                <p className="lead-text">
                    We are dedicated to providing a vibrant and trustworthy platform for buyers and sellers
                    to discover unique items and engage in exciting auctions. Our mission is to make auctions
                    accessible, transparent, and enjoyable for everyone.
                </p>
            </section>

            <section className="our-story-section">
                <h2>Our Story</h2>
                <p>
                    Founded in [Year], Online Auction began as a small idea driven by a shared love for rare finds
                    and the thrill of the bid. We saw an opportunity to create a modern, digital space where
                    communities could gather, share their passions, and unearth treasures. From vintage collectibles
                    to contemporary art, our platform has grown, but our core values of integrity, community,
                    and excitement remain.
                </p>
                <p>
                    We believe in the power of connection – connecting sellers with eager buyers, and connecting
                    individuals with items that tell a story. Our team is committed to continuous improvement,
                    ensuring that Online Auction is always a leading destination for online bidding.
                </p>
            </section>

            <section className="team-section">
                <h2>Meet Our Team</h2>
                <div className="team-grid">
                    {teamMembers.map((member, index) => (
                        <div className="team-member-card" key={index}>
                            <img src={member.image || `https://via.placeholder.com/250?text=${member.name.split(' ')[0]}`} alt={member.name} className="team-member-image" />
                            <h3>{member.name}</h3>
                            <h4>{member.role}</h4>
                            <p>{member.bio}</p>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default AboutPage;
