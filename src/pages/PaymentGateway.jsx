
import React from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import CheckoutForm from './CheckoutForm';

// Replace with your own Stripe public key
const stripePromise = loadStripe("pk_test_51RNIMbPIpqVsLNQyCIsErfPww3kIUAgxFQyXzUh6HI7YsMP9mwF4rX36XWwsGDgVQmEjGjGeg3nqglHl2N06LQ0L00RPaKztEA");

function App() {
  return (
    <div className="App">
      <h2>Payment Page</h2>
      <Elements stripe={stripePromise}>
        <CheckoutForm />
      </Elements>
    </div>
  );
}

export default PaymentGateway;
