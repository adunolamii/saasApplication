"use client"
import React from 'react'
import axios from 'axios'
import { useState } from 'react'
import BillingLists from './BillingLists'
import { loadStripe } from '@stripe/stripe-js';
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

const BillingForm = () => {
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
  
    // Function to get userId from the JWT (stored in localStorage or cookies)
    const getUserIdFromToken = () => {
      const token = localStorage.getItem('token'); // Or get from cookies if needed
      if (!token) {
        setError('User is not logged in');
        return null;
      }
      try {
        const decoded = JSON.parse(atob(token.split('.')[1])); // Decode JWT token
        return decoded.userId;
      } catch (error) {
        setError('Error decoding token');
        return null;
      }
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
  
      if (!description || !amount || !dueDate) {
        setError('All fields are required');
        return;
      }
  
      const userId = getUserIdFromToken();
      if (!userId) return; // Exit if userId is not available
  
      try {
        const response = await fetch('/api/billing', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId, // Pass userId here
            description,
            amount: parseFloat(amount),
            dueDate,
          }),
        });
  
        if (!response.ok) {
          throw new Error('Failed to create billing entry');
        }
  
        const data = await response.json();
        setSuccessMessage(data.msg);
        setDescription('');
        setAmount('');
        setDueDate('');
      } catch (error) {
        setError(error.message);
      }
    };

  return (
    <div>
     
     <div>
      {error && <div>{error}</div>}
      {successMessage && <div>{successMessage}</div>}
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg space-y-4 max-w-md shadow-lg mx-auto">
  <div>
    <label className="block text-gray-700 font-medium mb-2">Description</label>
    <input
      type="text"
      placeholder="Description"
      value={description}
      onChange={(e) => setDescription(e.target.value)}
      className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
    />
  </div>
  <div>
    <label className="block text-gray-700 font-medium mb-2">Amount</label>
    <input
      type="number"
      placeholder="Amount"
      value={amount}
      onChange={(e) => setAmount(e.target.value)}
      className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
    />
  </div>
  <div>
    <label className="block text-gray-700 font-medium mb-2">Due Date</label>
    <input
      type="date"
      value={dueDate}
      onChange={(e) => setDueDate(e.target.value)}
      className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
    />
  </div>
  <button
    type="submit"
    className="w-full bg-orange-500 text-white py-2 px-4 rounded-md hover:bg-black transition"
  >
    Create Billing Entry
  </button>
</form>
    </div>
    
    </div>
  )
}

export default BillingForm