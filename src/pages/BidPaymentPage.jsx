import React from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useLocation, useNavigate } from 'react-router-dom';
import CheckoutForm from '../components/CheckoutForm'; // Assuming CheckoutForm is in components
import './BidPaymentPage.css'; // Create this CSS

// Replace with your own Stripe public key from .env
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const BidPaymentPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    // Get bidAmount and itemId passed via state in navigate()
    const { bidAmount, itemId, itemName } = location.state || { bidAmount: 0, itemId: null, itemName: 'Item' };

    if (!itemId || bidAmount <= 0) {
        // Redirect back if essential data is missing
        navigate(-1); // Go back to previous page
        return <p>Error: Missing bid information. Redirecting...</p>;
    }

    // This function will be called by CheckoutForm on successful "payment" (simulated)
    const handlePaymentSuccess = (paymentMethodId) => {
        console.log("Simulated Payment Success on BidPaymentPage, Payment Method ID:", paymentMethodId);
        // Navigate back to ProductDetailPage with success status and payment info
        // The ProductDetailPage will then make the actual placeBid API call
        navigate(`/products/${itemId}`, {
            replace: true, // Replace this payment page in history
            state: {
                bidPaymentSuccessful: true,
                paymentMethodId: paymentMethodId,
                attemptedBidAmount: bidAmount // Send back the bid amount that was "paid" for
            }
        });
    };

    const handlePaymentFailure = (errorMessage) => {
        console.log("Simulated Payment Failure on BidPaymentPage:", errorMessage);
        navigate(`/products/${itemId}`, {
            replace: true,
            state: {
                bidPaymentSuccessful: false,
                paymentError: errorMessage,
                attemptedBidAmount: bidAmount
            }
        });
    };


    return (
        <div className="bid-payment-page page-container">
            <h2>Secure Bid Payment</h2>
            <p>You are about to place a bid of <strong>${parseFloat(bidAmount).toFixed(2)}</strong> for the item: <strong>{itemName}</strong>.</p>
            <p>Please complete the payment to confirm your bid.</p>
            <Elements stripe={stripePromise}>
                <CheckoutForm
                    amount={bidAmount * 100} // Stripe expects amount in smallest currency unit (e.g., cents)
                    onSuccess={handlePaymentSuccess}
                    onFailure={handlePaymentFailure}
                />
            </Elements>
            <button onClick={() => navigate(-1)} className="cancel-payment-button">Cancel Bid & Payment</button>
        </div>
    );
};

export default BidPaymentPage;
