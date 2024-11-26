"use client"
// HandleSubscription.js
import React, { useState } from 'react';
import axios from 'axios';
import SubForm from "./SubForm"

const HandleSubscription = () => {
  const [userDetails, setUserDetails] = useState(null); // Holds the email and token
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubscription = async (userDetails) => {
    setLoading(true);
    try {
      const response = await axios.post('/api/create-subscription', {
        email: userDetails.email,
        paymentMethod: userDetails.token, // Send token to the backend
        planId: 'plan_monthly', // Or any plan you want to use
      });

      if (response.data.msg === 'Subscription created successfully') {
        // Handle successful subscription
        alert('Subscription successful!');
      }
    } catch (err) {
      setError('Failed to create subscription: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {!userDetails ? (
        <SubForm setUserDetails={setUserDetails} />
      ) : (
        <div>
          <button
            onClick={() => handleSubscription(userDetails)}
            disabled={loading}
            className="bg-green-500 text-white p-2 w-full mt-4"
          >
            {loading ? 'Processing...' : 'Confirm Subscription'}
          </button>
          {error && <p className="text-red-500">{error}</p>}
        </div>
      )}
    </div>
  );
};

export default HandleSubscription;
