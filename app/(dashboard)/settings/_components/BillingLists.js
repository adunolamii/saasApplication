"use client"
import React from 'react'
import axios from 'axios'
import { useState, useEffect } from 'react'
import billingForm from './BillingForm'

const BillingLists = () => {
  const [billingEntries, setBillingEntries] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBillingEntries = async () => {
      try {
        const response = await fetch('/api/billing');
        if (!response.ok) {
          throw new Error('Failed to fetch billing entries');
        }
        const data = await response.json();
        setBillingEntries(data);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchBillingEntries();
  }, []);

  return (
    <div>BillingLists
        <div>
      {error && <div>{error}</div>}
      <ul>
        {billingEntries.map((billing) => (
          <li key={billing._id}>
            <p>{billing.description}</p>
            <p>Amount: {billing.amount}</p>
            <p>Due Date: {new Date(billing.dueDate).toLocaleDateString()}</p>
            <p>Status: {billing.status}</p>
          </li>
        ))}
      </ul>
    </div>
    </div>
  )
}

export default BillingLists