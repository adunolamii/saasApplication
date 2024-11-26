"use client"
import React, { useState } from 'react';
import { useStripe,CardElement } from '@stripe/react-stripe-js';

const CollectUserInfo = ({ setUserDetails }) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState(null);
  const stripe = useStripe();
//   const elements = useElements();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) return; // Make sure stripe.js is loaded

    const cardElement = elements.getElement(CardElement);
    const { token, error: stripeError } = await stripe.createToken(cardElement);

    if (stripeError) {
      setError(stripeError.message);
      return;
    }

    // Send email, payment token, and other data to the parent (for subscription creation)
    setUserDetails({ email, token: token.id });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="email" className="block">Email</label>
        <input
          type="email"
          id="email"
          className="border p-2 w-full"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      {/* <div>
        <label className="block">Payment Details</label>
        <CardElement className="p-2 border" />
      </div> */}

      {error && <p className="text-red-500">{error}</p>}

      <button
        type="submit"
        disabled={!stripe}
        className="bg-blue-500 text-white p-2 w-full mt-4"
      >
        Proceed to Subscription
      </button>
    </form>
  );
};

export default CollectUserInfo;
