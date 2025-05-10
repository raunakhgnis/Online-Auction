import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import './CheckoutForm.css'; // Optional custom styles

function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const [status, setStatus] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus("Processing...");

    if (!stripe || !elements) return;

    const card = elements.getElement(CardElement);

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: card,
    });

    if (error) {
      setStatus(`❌ Payment Failed: ${error.message}`);
    } else {
      // simulate success here (real implementation requires backend charge)
      setStatus(`✅ Payment Success! ID: ${paymentMethod.id}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="payment-form">
      <label>Card Details</label>
      <CardElement className="card-element" />
      <button type="submit" disabled={!stripe}>Pay</button>
      <p className="status">{status}</p>
    </form>
  );
}

export default CheckoutForm;
