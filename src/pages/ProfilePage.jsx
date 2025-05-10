import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import Link
import axios from 'axios'; // Import axios
import { getMyListedItems, getMyBids, initiateItemPayment, getItemById } from '../services/api'; // Import getItemById too if needed
import { useAuth } from '../contexts/AuthContext';
import ItemCard from '../components/ItemCard';
import './ProfilePage.css'; // Make sure this CSS exists

const ProfilePage = () => {
    const { currentUser, logout } = useAuth();
    const navigate = useNavigate();
    const [listedItems, setListedItems] = useState([]);
    const [bidsPlaced, setBidsPlaced] = useState([]);
    const [wonItems, setWonItems] = useState([]);
    const [loadingListed, setLoadingListed] = useState(true);
    const [loadingBids, setLoadingBids] = useState(true); // Tracks loading for bids *and* won items check
    const [error, setError] = useState('');
    const [paymentMessage, setPaymentMessage] = useState('');

    useEffect(() => {
        let isMounted = true; // Prevent state updates on unmounted component

        const fetchData = async () => {
            if (!currentUser) {
                if (isMounted) {
                    setLoadingListed(false);
                    setLoadingBids(false);
                }
                return;
            }

            setLoadingListed(true);
            setLoadingBids(true); // Start loading bids/won items
            setError('');
            setPaymentMessage('');

            // Fetch Listed Items
            try {
                const listedResponse = await getMyListedItems();
                if (isMounted) setListedItems(listedResponse.data);
            } catch (err) {
                console.error("Error fetching listed items:", err);
                if (isMounted) setError(prev => (prev ? prev + "\n" : "") + "Failed to load items you listed.");
                if (err.response && err.response.status === 401 && isMounted) { await logout(); navigate('/login'); return; }
            } finally {
                if (isMounted) setLoadingListed(false);
            }

            // Fetch Bids Placed and Determine Won Items
            try {
                const bidsResponse = await getMyBids();
                if (isMounted) setBidsPlaced(bidsResponse.data);

                // Determine won items from bids placed
                // This is still inefficient but uses the imported function now
                const potentiallyWonPromises = bidsResponse.data.map(async (bid) => {
                    try {
                        // Fetch each item to check status - Consider a dedicated backend endpoint for optimization
                        const itemResponse = await getItemById(bid.itemId); // Use imported function
                        const item = itemResponse.data;
                        const isEnded = item.auctionEndTime && new Date(item.auctionEndTime) <= new Date();
                        const isHighestBidder = item.highestBidderEmail === currentUser.email;

                        if (isEnded && isHighestBidder) {
                            return item; // Return the full item DTO if won
                        }
                    } catch (itemErr) {
                        // Avoid failing the whole Promise.all if one item fetch fails
                        console.error(`Error fetching item ${bid.itemId} for won check:`, itemErr.response?.data || itemErr.message);
                    }
                    return null; // Return null if not won or error occurred
                });

                const resolvedWonItems = await Promise.all(potentiallyWonPromises);
                if (isMounted) {
                    setWonItems(resolvedWonItems.filter(item => item !== null));
                }

            } catch (err) {
                console.error("Error fetching bids placed:", err);
                 if (isMounted) setError(prev => (prev ? prev + "\n" : "") + "Failed to load your bids.");
                if (err.response && err.response.status === 401 && isMounted) { await logout(); navigate('/login'); return; }
            } finally {
                if (isMounted) setLoadingBids(false); // Loading finished for bids/won items
            }
        };

        fetchData();

        // Cleanup function to set isMounted to false when the component unmounts
        return () => {
            isMounted = false;
        };

    }, [currentUser, navigate, logout]); // Re-fetch if user changes

    const handlePayment = async (itemId) => {
         setPaymentMessage('');
         try {
             const response = await initiateItemPayment(itemId);
             setPaymentMessage(`Item ${itemId}: ${response.data.message || 'Payment initiated.'}`);
             // Refresh ALL data after payment attempt to get latest statuses
             fetchData();
         } catch (error) {
              setPaymentMessage(`Item ${itemId}: ${error.response?.data?.message || "Payment initiation failed."}`);
               if (error.response && error.response.status === 401) {
                   await logout();
                   navigate('/login');
               }
         }
     };

    // Display loading indicator until both sections are loaded
    const isLoading = loadingListed || loadingBids;

    return (
        <div className="profile-page page-container">
            <h2>Your Profile Dashboard</h2>
            {isLoading && <div className="loading-indicator">Loading profile data...</div>}
            {error && <p className="message error">{error}</p>}
            {paymentMessage && <p className={`message ${paymentMessage.toLowerCase().includes("failed") ? 'error' : 'success'}`}>{paymentMessage}</p>}

            {/* Sections are rendered conditionally based on loading state */}
            {!isLoading && (
                <>
                    <section className="profile-section">
                        <h3>Items You Have Won</h3>
                        {wonItems.length > 0 ? (
                            <div className="items-grid">
                                {wonItems.map(item => (
                                    <div key={`won-${item.id}`} className="item-card won-item">
                                        <ItemCard item={item} />
                                        <div className="won-item-actions">
                                            {item.paymentStatus === 'PAID' ? (
                                                <p className="payment-status-paid">PAID</p>
                                            ) : (
                                                <button onClick={() => handlePayment(item.id)} className="pay-now-button">
                                                    Pay ${item.currentBidPrice?.toFixed(2)} Now
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : <p>You haven't won any items yet, or auctions haven't ended.</p> }
                    </section>

                    <section className="profile-section">
                        <h3>Items You Are Selling</h3>
                        {listedItems.length > 0 ? (
                            <div className="items-grid">
                                {listedItems.map(item => <ItemCard key={`listed-${item.id}`} item={item} />)}
                            </div>
                        ) : <p>You haven't listed any items for auction.</p>}
                    </section>

                    <section className="profile-section">
                        <h3>Your Bidding History</h3>
                        {bidsPlaced.length > 0 ? (
                            <ul className="bid-history-list">
                                {bidsPlaced.map(bid => (
                                    <li key={bid.id}>
                                        Bid ${bid.bidAmount.toFixed(2)} on
                                        {/* Use Link component here */}
                                        <Link to={`/products/${bid.itemId}`}> {bid.itemName || `Item #${bid.itemId}`}</Link>
                                        at {new Date(bid.bidTime).toLocaleString()}
                                    </li>
                                ))}
                            </ul>
                        ) : <p>You haven't placed any bids yet.</p>}
                    </section>
                </>
            )}
        </div>
    );
};
export default ProfilePage;
