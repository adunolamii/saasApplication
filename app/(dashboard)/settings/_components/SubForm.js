"use client"
import React, { useState } from 'react';
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import axios from 'axios';
import { loadStripe } from '@stripe/stripe-js';
    

    const CollectUserInfo = () => {
      const [userId, setUserId] = useState('');
      const [plan, setPlan] = useState('');
      const [startDate, setStartDate] = useState('');
      const [billingInfo, setBillingInfo] = useState(null);
    
      const handleSubmit = async (e) => {
        e.preventDefault();
    
        const subscriptionData = {
          userId,
          plan,
          startDate,
        };
    
        try {
          // Create Subscription
          const response = await fetch('/api/subscription', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(subscriptionData),
          });
    
          const data = await response.json();
    
          if (response.ok) {
            alert('Subscription created successfully');
            // Call function to create billing entry after successful subscription
            createBillingEntry(userId, plan, data.subscriptionStartDate);
          } else {
            alert('Error creating subscription: ' + data.error);
          }
        } catch (error) {
          alert('An error occurred: ' + error.message);
        }
      };
    
      const createBillingEntry = async (userId, plan, startDate) => {
        const dueDate = new Date(startDate);
        dueDate.setMonth(dueDate.getMonth() + 1); // Set due date to next month
    
        const billingData = {
          userId,
          description: `Subscription for ${plan}`,
          amount: 50, // Use your subscription plan's amount here
          dueDate,
        };
    
        try {
          // Create Billing Entry
          const response = await fetch('/api/billing', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(billingData),
          });
    
          const data = await response.json();
          if (response.ok) {
            alert('Billing entry created successfully');
            setBillingInfo(data.billing); // Optionally set state for billing info display
          } else {
            alert('Error creating billing entry: ' + data.error);
          }
        } catch (error) {
          alert('An error occurred: ' + error.message);
        }
      };
    
  return (
    
   <div>
    <form onSubmit={handleSubmit} className="space-y-4 p-6 bg-white rounded-lg shadow-lg max-w-md mx-auto">
    <h2 className="text-2xl font-bold text-center text-gray-800">Activate Subscription</h2>
   
  <div>
    <label className="block text-gray-700 font-semibold mb-2">User ID</label>
    <input
      type="text"
      value={userId}
      onChange={(e) => setUserId(e.target.value)}
      className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
      required
    />
  </div>
  <div>
    <label className="block text-gray-700 font-semibold mb-2">Plan</label>
    <input
      type="text"
      value={plan}
      onChange={(e) => setPlan(e.target.value)}
      className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
      required
    />
  </div>
  <div>
    <label className="block text-gray-700 font-semibold mb-2">Start Date</label>
    <input
      type="date"
      value={startDate}
      onChange={(e) => setStartDate(e.target.value)}
      className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
      required
    />
  </div>
  <button
    type="submit"
    className="w-full bg-orange-500 text-white p-3 rounded-md hover:bg-black transition"
  >
    Create Subscription
  </button>
</form>
   </div>
  
)
};

export default CollectUserInfo;
