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
    
    
    // const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
   
    // const [formData, setFormData] = useState({
    //     userId: "605c72ef1532075b18ed89f8", 
    //     email: "",
    //     name: "",
    //     planAmount: "",
    //     planInterval: "month", // Default interval
    //   });
    
    //   const [loading, setLoading] = useState(false);
    //   const [message, setMessage] = useState("");
    
    //   // Handle input change
    //   const handleChange = (e) => {
    //     const { name, value } = e.target;
    //     setFormData((prev) => ({ ...prev, [name]: value }));
    //   };
    
    //   // Handle form submission
    //   const handleSubmit = async (e) => {
    //     e.preventDefault();
    //     setLoading(true);
    //     setMessage("");
    
    //     try {
    //       const response = await axios.post("/api/subscription", formData); // Backend API endpoint
    //       setMessage(response.data.msg);
    //     } catch (error) {
    //       console.error("Error creating subscription:", error);
    //       setMessage(
    //         error.response?.data?.msg || "An error occurred. Please try again."
    //       );
    //     } finally {
    //       setLoading(false);
    //     }
    //   };
  return (
    
   <div>
    <form onSubmit={handleSubmit} className="space-y-4 p-4">
      <div>
        <label className="block">User ID</label>
        <input
          type="text"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
          required
        />
      </div>
      <div>
        <label className="block">Plan</label>
        <input
          type="text"
          value={plan}
          onChange={(e) => setPlan(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
          required
        />
      </div>
      <div>
        <label className="block">Start Date</label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
          required
        />
      </div>
      <button type="submit" className="bg-blue-500 text-white p-2 rounded">
        Create Subscription
      </button>
    </form>



       {/* <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-lg p-6 w-full max-w-lg"
      >
        <h2 className="text-2xl font-semibold text-gray-700 mb-6">
          Create Subscription
        </h2>

        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-600 mb-1">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="name" className="block text-gray-600 mb-1">
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="planAmount" className="block text-gray-600 mb-1">
            Plan Amount (in USD)
          </label>
          <input
            type="number"
            id="planAmount"
            name="planAmount"
            value={formData.planAmount}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="planInterval" className="block text-gray-600 mb-1">
            Plan Interval
          </label>
          <select
            id="planInterval"
            name="planInterval"
            value={formData.planInterval}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
          >
            <option value="month">Monthly</option>
            <option value="year">Yearly</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-300 disabled:opacity-50"
        >
          {loading ? "Processing..." : "Create Subscription"}
        </button>

        {message && (
          <p
            className={`mt-4 text-center ${
              message.includes("successfully") ? "text-green-600" : "text-red-600"
            }`}
          >
            {message}
          </p>
        )}
      </form> */}
   </div>
  
)
};

export default CollectUserInfo;
