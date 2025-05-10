// src/components/CheckoutForm.jsx
import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import './CheckoutForm.css';

// Added amount, onSuccess, onFailure props
function CheckoutForm({ amount, onSuccess, onFailure }) {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [succeeded, setSucceeded] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setProcessing(true);
    setError(null);

    if (!stripe || !elements) {
      console.error("Stripe.js has not loaded yet.");
      setProcessing(false);
      if (onFailure) onFailure("Stripe.js has not loaded yet.");
      return;
    }

    const cardElement = elements.getElement(CardElement);

    // --- SIMULATING BACKEND INTERACTION ---
    // In a real app:
    // 1. Create a PaymentIntent on your backend.
    // 2. Use the clientSecret from the PaymentIntent here with stripe.confirmCardPayment.

    // For this demo, we'll create a payment method and simulate success/failure
    const { error: pmError, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: cardElement,
    });

    if (pmError) {
      console.error("Stripe createPaymentMethod error:", pmError);
      setError(pmError.message);
      setProcessing(false);
      if (onFailure) onFailure(pmError.message);
    } else {
      console.log("PaymentMethod created:", paymentMethod);
      // SIMULATE successful server-side charge/confirmation
      // In a real app, you'd send paymentMethod.id to your backend,
      // backend charges it, and then you get confirmation.
      // Here, we just call onSuccess.
      setSucceeded(true);
      setProcessing(false);
      if (onSuccess) onSuccess(paymentMethod.id); // Pass the mock paymentMethod.id
    }
  };

  return (
    <form onSubmit={handleSubmit} className="payment-form">
      <label htmlFor="card-element">Card Details</label>
      <CardElement id="card-element" className="card-element" options={{style: {base: {fontSize: '16px'}}}} />
      <button type="submit" disabled={!stripe || processing || succeeded} className="pay-button">
        {processing ? "Processing..." : succeeded ? "Payment Successful!" : `Pay $${(amount / 100).toFixed(2)}`}
      </button>
      {error && <div className="card-errors message error" role="alert">{error}</div>}
      {succeeded && <p className="payment-success message success">Your bid is being confirmed!</p>}
    </form>
  );
}

export default CheckoutForm;
