import React from 'react';
import { Link } from 'react-router-dom';
import './ItemCard.css'; // Create this CSS

const ItemCard = ({ item }) => {
    const isAuctionEnded = item.auctionEndTime && new Date(item.auctionEndTime) <= new Date();
    const defaultImage = `https://via.placeholder.com/250x180.png?text=${encodeURIComponent(item.name)}`;

    return (
        <div className={`item-card ${isAuctionEnded ? 'ended' : ''}`}>
            <Link to={`/products/${item.id}`}>
                <img
                    src={item.imageUrl || defaultImage}
                    alt={item.name}
                    onError={(e) => { e.target.onerror = null; e.target.src=defaultImage; }} // Handle broken images
                />
            </Link>
            <div className="item-card-content">
                <h4>
                     <Link to={`/products/${item.id}`}>{item.name}</Link>
                </h4>
                <p className="item-category">Category: {item.category}</p>
                <p className="item-price">
                    {isAuctionEnded ? 'Ended at' : 'Starts at'}: ${item.startingPrice?.toFixed(2)}
                </p>
                {item.currentBidPrice && item.currentBidPrice > item.startingPrice && !isAuctionEnded && (
                     <p className="item-current-bid">Current Bid: ${item.currentBidPrice?.toFixed(2)}</p>
                )}
                <p className="item-end-time">
                    {isAuctionEnded ? `Ended: ${new Date(item.auctionEndTime).toLocaleDateString()}` : `Ends: ${new Date(item.auctionEndTime).toLocaleString()}`}
                </p>
                 {isAuctionEnded && <p className="status-ended">Auction Ended</p>}
                <Link to={`/products/${item.id}`} className="view-details-button">
                    View Details
                </Link>
            </div>
        </div>
    );
};

export default ItemCard;
