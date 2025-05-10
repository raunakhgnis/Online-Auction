import React from 'react';
import { Link } from 'react-router-dom';
import './BlogPage.css';
import img1 from '../assets/futureImage1.png';
import img2 from '../assets/ensuringSecurity2.png';
import img3 from '../assets/mobile3.jpeg';


const blogPosts = [
    {
        id: 1,
        title: "The Future of Bidding: AI in Online Auctions",
        date: "May 5, 2025",
        excerpt: "Artificial intelligence is set to revolutionize how online auctions operate, from fraud detection to personalized recommendations...",
        image: "https://th.bing.com/th/id/OIP.kAjOyiaSxjKycqVxeXiKsQHaD3?w=307&h=180&c=7&r=0&o=7&cb=iwp2&dpr=1.3&pid=1.7&rm=3", // Replace with actual or relevant images
        author: "Tech Analyst"
    },
    {
        id: 2,
        title: "Ensuring Security in P2P Transactions for Auction Sites",
        date: "April 28, 2025",
        excerpt: "With the rise of peer-to-peer auction platforms, robust security measures are more critical than ever. We explore the latest...",
        image: "https://syndelltech.com/wp-content/uploads/2024/02/Security-Matters-Best-Practices-in-safeguarding-transactions-on-auction-sites.webp",
        author: "Security Expert"
    },
    {
        id: 3,
        title: "Mobile First: Designing Auction Experiences for On-the-Go Users",
        date: "April 15, 2025",
        excerpt: "The shift to mobile continues, and auction sites must adapt by creating seamless, intuitive experiences for users on smartphones and tablets.",
        image: "https://media.designrush.com/tinymce_images/93432/conversions/mobile-design-content.jpg",
        author: "UX Designer"
    }
];

const BlogPage = () => {
    return (
        <div className="blog-page page-container">
            <div className="blog-hero">
                <h1>Our Tech & Auction Insights</h1>
                <p>Stay updated with the latest news, trends, and discussions in the world of online auctions and technology.</p>
            </div>

            <div className="blog-posts-grid">
                {blogPosts.map(post => (
                    <article className="blog-post-card" key={post.id}>
                        {post.image && (
                            <Link to={`/blog/post/${post.id}`} className="post-image-link"> {/* Placeholder link */}
                                <img src={post.image} alt={post.title} className="post-image" />
                            </Link>
                        )}
                        <div className="post-content">
                            <header>
                                <h2 className="post-title">
                                    <Link to={`/blog/post/${post.id}`}>{post.title}</Link> {/* Placeholder link */}
                                </h2>
                                <p className="post-meta">
                                    By <span className="post-author">{post.author}</span> on <time dateTime={post.date}>{post.date}</time>
                                </p>
                            </header>
                            <p className="post-excerpt">{post.excerpt}</p>
                            <Link to={`/blog/post/${post.id}`} className="read-more-link">Read More →</Link> {/* Placeholder link */}
                        </div>
                    </article>
                ))}
            </div>
        </div>
    );
};

export default BlogPage;
