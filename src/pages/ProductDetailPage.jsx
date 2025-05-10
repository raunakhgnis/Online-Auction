// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom'; // Import hooks
// import axios from 'axios'; // Import axios if not already
// import { useAuth } from '../contexts/AuthContext';
// import { getItemById, placeBid, initiateItemPayment, getBidsForItem } from '../services/api'; // Import new API call
// import './ProductDetailPage.css';

// const ProductDetailPage = () => { // Removed navigate prop, use hook instead
//     const { id: itemId } = useParams(); // Get item ID from URL
//     const navigate = useNavigate(); // Use hook for navigation
//     const { currentUser, logout } = useAuth();

//     const [item, setItem] = useState(null);
//     const [bids, setBids] = useState([]); // State for bids
//     const [bidAmount, setBidAmount] = useState('');
//     const [message, setMessage] = useState('');
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState('');

//     // Function to fetch both item and bids
//     const fetchData = async () => {
//         if (!itemId) {
//             setError("No item ID provided.");
//             setLoading(false);
//             return;
//         }
//         setLoading(true);
//         setError('');
//         setMessage(''); // Clear previous messages on refresh
//         try {
//             const itemResponse = await getItemById(itemId);
//             setItem(itemResponse.data);
//             // Fetch bids for the item
//             const bidsResponse = await getBidsForItem(itemId);
//             setBids(bidsResponse.data);

//         } catch (err) {
//             console.error("Error fetching item/bids details:", err);
//             setError(err.response?.data?.message || "Failed to load item details or bids.");
//         } finally {
//             setLoading(false);
//         }
//     };

//     useEffect(() => {
//         fetchData(); // Fetch data on mount and when itemId changes
//     }, [itemId]);

//     const handlePlaceBid = async (e) => {
//         e.preventDefault();
//         if (!currentUser) {
//             setMessage("Please login to place a bid.");
//             navigate('/login'); // Redirect to login
//             return;
//         }
//         const currentPrice = item?.currentBidPrice || item?.startingPrice || 0;
//         if (!bidAmount || parseFloat(bidAmount) <= currentPrice) {
//             setMessage(`Bid must be higher than the current price of $${currentPrice.toFixed(2)}.`);
//             return;
//         }
//         setMessage('');
//         try {
//             const response = await placeBid(item.id, parseFloat(bidAmount));
//             setMessage(response.data.message || "Bid placed successfully!");
//             setBidAmount('');
//             // Refresh data to show new bid and potentially updated price
//             fetchData();
//         } catch (err) {
//             setMessage(err.response?.data?.message || "Failed to place bid.");
//             if (err.response && err.response.status === 401) {
//                 await logout();
//                 navigate('/login');
//             }
//         }
//     };

//     // --- Payment Handling ---
//     const handlePayment = async () => {
//         setMessage(''); // Clear previous messages
//         console.log(`Attempting payment for item ${item.id} by user ${currentUser?.email}`); // Debug log
//         try {
//             const response = await initiateItemPayment(item.id);
//             setMessage(response.data.message);
//             // Refresh data to show updated payment status
//             fetchData();
//         } catch (error) {
//              console.error("Payment error response:", error.response); // Log error details
//              setMessage(error.response?.data?.message || "Payment initiation failed.");
//              if (error.response && error.response.status === 401) {
//                  await logout();
//                  navigate('/login');
//              }
//         }
//     };
//     // --- End Payment Handling ---

//     if (loading) return <div className="page-container"><p>Loading item details...</p></div>;
//     if (error) return <div className="page-container"><p className="message error">{error} <button onClick={() => navigate('/')}>Go Home</button></p></div>;
//     if (!item) return <div className="page-container"><p>Item not found. <button onClick={() => navigate('/')}>Go Home</button></p></div>;

//     const isAuctionEnded = item.auctionEndTime && new Date(item.auctionEndTime) <= new Date();
//     const isWinner = currentUser && item.highestBidderEmail === currentUser.email;
//     const needsPayment = item.paymentStatus !== 'PAID';

//     return (
//         <div className="product-detail-container page-container">
//             <button onClick={() => navigate('/')} className="back-button">← Back to Listings</button>
//             <h2>{item.name}</h2>
//             {message && <p className={`message ${message.toLowerCase().includes("error") || message.toLowerCase().includes("failed") ? 'error' : 'success'}`}>{message}</p>}

//             <div className="product-layout">
//                 <div className="product-image-section">
//                     <img src={item.imageUrl || `https://via.placeholder.com/400x300.png?text=${item.name}`} alt={item.name} className="product-image-large"/>
//                 </div>
//                 <div className="product-info-section">
//                     <p className="product-category">Category: {item.category}</p>
//                     <p className="product-description">{item.description}</p>
//                     <p><strong>Starting Price:</strong> ${item.startingPrice?.toFixed(2)}</p>
//                     <p><strong>Current Bid:</strong> ${item.currentBidPrice?.toFixed(2) || item.startingPrice?.toFixed(2)}</p>
//                     <p><strong>Highest Bidder:</strong> {item.highestBidderEmail || 'None yet'}</p>
//                     <p><strong>Auction Ends:</strong> {new Date(item.auctionEndTime).toLocaleString()}</p>
//                     <p><strong>Seller:</strong> {item.sellerEmail}</p>
//                     {item.paymentStatus && <p><strong>Payment Status:</strong> {item.paymentStatus}</p>}


//                     {!isAuctionEnded && currentUser && currentUser.email !== item.sellerEmail && ( // Show bid form if auction active, user logged in, and not seller
//                         <form onSubmit={handlePlaceBid} className="bid-form">
//                             <h4>Place Your Bid</h4>
//                             <div className="form-group">
//                                 <label htmlFor="bidAmount">Your Bid ($):</label>
//                                 <input
//                                     type="number"
//                                     id="bidAmount"
//                                     value={bidAmount}
//                                     onChange={(e) => setBidAmount(e.target.value)}
//                                     step="1.00"
//                                     min={parseFloat(item.currentBidPrice || item.startingPrice) + 0.01}
//                                     required
//                                     placeholder={`> $${(item.currentBidPrice || item.startingPrice).toFixed(2)}`}
//                                 />
//                             </div>
//                             <button type="submit" className="place-bid-button">Place Bid</button>
//                         </form>
//                     )}

//                      {!isAuctionEnded && !currentUser && (
//                          <p className="login-prompt">
//                              Please <button onClick={() => navigate('/login')} className="login-link-inline">login</button> to place a bid.
//                          </p>
//                      )}

//                      {isAuctionEnded && (
//                          <p className="auction-ended-message">Auction has ended.</p>
//                      )}

//                      {/* --- Payment Button Logic --- */}
//                      {isAuctionEnded && isWinner && needsPayment && (
//                         <div className="payment-section">
//                             <h4>Congratulations! You won!</h4>
//                             <button onClick={handlePayment} className="pay-now-button">
//                                 Pay ${item.currentBidPrice?.toFixed(2)} Now (Simulated)
//                             </button>
//                         </div>
//                     )}
//                     {isAuctionEnded && isWinner && item.paymentStatus === 'PAID' && (
//                          <p className="payment-status-paid">Payment Confirmed! Thank you.</p>
//                     )}
//                      {/* --- End Payment Button Logic --- */}

//                 </div>
//             </div>

//             {/* Bidding history display */}
//             <div className="bidding-history-section">
//                 <h4>Bidding Activity</h4>
//                 {bids.length > 0 ? (
//                     <ul>
//                         {bids.map(bid => (
//                             <li key={bid.id}>
//                                 ${bid.bidAmount.toFixed(2)} by {bid.bidderEmail} at {new Date(bid.bidTime).toLocaleString()}
//                             </li>
//                         ))}
//                     </ul>
//                 ) : (
//                     <p>No bids placed yet.</p>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default ProductDetailPage;







import React, { useState, useEffect, useRef } from 'react'; // Added useRef
import { useParams, useNavigate, useLocation } from 'react-router-dom'; // Added useLocation
import { useAuth } from '../contexts/AuthContext';
import { getItemById, placeBid as apiPlaceBid, getBidsForItem } from '../services/api'; // Renamed placeBid
import './ProductDetailPage.css';

const ProductDetailPage = () => {
    const { id: itemId } = useParams();
    const navigate = useNavigate();
    const location = useLocation(); // To get state from BidPaymentPage
    const { currentUser, logout } = useAuth();

    const [item, setItem] = useState(null);
    const [bids, setBids] = useState([]);
    const [bidAmount, setBidAmount] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Ref to prevent multiple submissions while one is in progress
    const isSubmittingBid = useRef(false);


    const fetchData = async () => {
        // ... (fetchData remains largely the same, ensure isMounted check if needed) ...
         if (!itemId) { setError("No item ID provided."); setLoading(false); return; }
        setLoading(true); setError(''); /* Don't clear message here to see payment status */
        try {
            const itemResponse = await getItemById(itemId);
            setItem(itemResponse.data);
            const bidsResponse = await getBidsForItem(itemId);
            setBids(bidsResponse.data);
        } catch (err) { console.error("Error fetching item/bids details:", err); setError(err.response?.data?.message || "Failed to load item details or bids.");
        } finally { setLoading(false); }
    };

    useEffect(() => {
        fetchData();
    }, [itemId]);


    // Effect to handle result from BidPaymentPage
    useEffect(() => {
        if (location.state?.bidPaymentSuccessful === true && location.state?.attemptedBidAmount && !isSubmittingBid.current) {
            setMessage("Payment successful! Placing your bid...");
            isSubmittingBid.current = true; // Mark as submitting
            const actualBidAmount = parseFloat(location.state.attemptedBidAmount);
            const paymentId = location.state.paymentMethodId; // Mock payment ID

            apiPlaceBid(itemId, actualBidAmount, paymentId) // Pass paymentId to backend if needed
                .then(response => {
                    setMessage(response.data.message || "Bid placed successfully after payment!");
                    setBidAmount(''); // Clear bid input
                    fetchData(); // Refresh item and bid data
                })
                .catch(err => {
                    setMessage(err.response?.data?.message || "Failed to place bid after payment.");
                    if (err.response && err.response.status === 401) {
                        logout().then(() => navigate('/login'));
                    }
                })
                .finally(() => {
                    isSubmittingBid.current = false; // Reset submitting flag
                     // Clear location state to prevent re-processing on refresh/navigation
                    navigate(location.pathname, { replace: true, state: {} });
                });

        } else if (location.state?.bidPaymentSuccessful === false) {
            setMessage(location.state.paymentError || "Payment failed. Bid not placed.");
            // Clear location state
            navigate(location.pathname, { replace: true, state: {} });
        }
    }, [location.state, itemId, navigate, logout, fetchData]); // Rerun when location.state changes

    const redirectToPayment = (e) => {
        e.preventDefault(); // Prevent default form submission if any
        if (!currentUser) {
            setMessage("Please login to place a bid.");
            navigate('/login');
            return;
        }
        const currentPrice = item?.currentBidPrice || item?.startingPrice || 0;
        const enteredBidAmount = parseFloat(bidAmount);

        if (!bidAmount || isNaN(enteredBidAmount) || enteredBidAmount <= currentPrice) {
            setMessage(`Bid must be a number higher than the current price of $${currentPrice.toFixed(2)}.`);
            return;
        }
        setMessage(''); // Clear previous messages

        // Navigate to the BidPaymentPage with necessary data
        navigate(`/bid-payment/${itemId}`, {
            state: {
                bidAmount: enteredBidAmount, // Pass the validated bid amount
                itemId: item.id,
                itemName: item.name
            }
        });
    };

    // ... (rest of the component, including loading/error/item not found states) ...
    // ... (isAuctionEnded, isWinner, needsPayment for actual final payment logic) ...

    if (loading) return <div className="page-container loading-indicator"><p>Loading item details...</p></div>;
    if (error) return <div className="page-container"><p className="message error">{error} <button onClick={() => navigate('/')}>Go Home</button></p></div>;
    if (!item) return <div className="page-container"><p>Item not found. <button onClick={() => navigate('/')}>Go Home</button></p></div>;

    const isAuctionActive = item.auctionEndTime && new Date(item.auctionEndTime) > new Date();

    return (
        <div className="product-detail-container page-container">
            <button onClick={() => navigate('/')} className="back-button">← Back to Listings</button>
            <h2>{item.name}</h2>
            {message && <p className={`message ${message.toLowerCase().includes("error") || message.toLowerCase().includes("failed") ? 'error' : 'success'}`}>{message}</p>}

            <div className="product-layout">
                {/* ... Image Section ... */}
                <div className="product-image-section">
                    <img src={item.imageUrl || `https://via.placeholder.com/400x300.png?text=${item.name}`} alt={item.name} className="product-image-large"/>
                </div>

                <div className="product-info-section">
                    {/* ... Item Info (category, description, prices, etc.) ... */}
                     <p className="product-category">Category: {item.category}</p>
                    <p className="product-description">{item.description}</p>
                    <p><strong>Starting Price:</strong> ${item.startingPrice?.toFixed(2)}</p>
                    <p><strong>Current Bid:</strong> ${item.currentBidPrice?.toFixed(2) || item.startingPrice?.toFixed(2)}</p>
                    <p><strong>Highest Bidder:</strong> {item.highestBidderEmail || 'None yet'}</p>
                    <p><strong>Auction Ends:</strong> {new Date(item.auctionEndTime).toLocaleString()}</p>
                    <p><strong>Seller:</strong> {item.sellerEmail}</p>
                    {item.paymentStatus && <p><strong>Payment Status:</strong> <span className={`payment-status-${item.paymentStatus.toLowerCase()}`}>{item.paymentStatus}</span></p>}


                    {isAuctionActive && currentUser && currentUser.email !== item.sellerEmail && (
                        <form onSubmit={redirectToPayment} className="bid-form"> {/* Changed onSubmit */}
                            <h4>Place Your Bid</h4>
                            <div className="form-group">
                                <label htmlFor="bidAmount">Your Bid ($):</label>
                                <input
                                    type="number"
                                    id="bidAmount"
                                    value={bidAmount}
                                    onChange={(e) => setBidAmount(e.target.value)}
                                    step="1.00"
                                    min={parseFloat(item.currentBidPrice || item.startingPrice) + 0.01}
                                    required
                                    placeholder={`> $${(item.currentBidPrice || item.startingPrice).toFixed(2)}`}
                                />
                            </div>
                            <button type="submit" className="place-bid-button">
                                Proceed to Secure Bid
                            </button>
                        </form>
                    )}
                    {/* ... (other conditional rendering for login prompt, auction ended message) ... */}
                </div>
            </div>

            <div className="bidding-history-section">
                <h4>Bidding Activity</h4>
                {/* ... bids mapping ... */}
                 {bids.length > 0 ? (
                    <ul>
                        {bids.map(bid => (
                            <li key={bid.id}>
                                ${bid.bidAmount.toFixed(2)} by {bid.bidderEmail || 'Anonymous'} at {new Date(bid.bidTime).toLocaleString()}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No bids placed yet.</p>
                )}
            </div>
        </div>
    );
};

export default ProductDetailPage;
