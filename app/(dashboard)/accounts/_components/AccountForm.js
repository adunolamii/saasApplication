"use client"
import React from 'react'
import { useState, useEffect } from 'react';

export const AccountForm = () => {
    const [formData, setFormData] = useState({
        name: "",
        type: "savings", // default type
        balance: "",
        description: "",
      });
    
      const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
      };
    
      const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(formData);
        
      }
  return (
    <div>
        <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Account Name"
          value={formData.name}
          onChange={handleChange}
          className="w-full p-2 border rounded-md"
          required
        />
        <select
          name="type"
          value={formData.type}
          onChange={handleChange}
          className="w-full p-2 border rounded-md"
        >
          <option value="savings">Savings</option>
          <option value="current">Current</option>
          <option value="business">Business</option>
        </select>
        <input
          type="number"
          name="balance"
          placeholder="Initial Balance"
          value={formData.balance}
          onChange={handleChange}
          className="w-full p-2 border rounded-md"
          required
        />
        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          className="w-full p-2 border rounded-md"
        />
        <button type="submit">
          Submit
        </button>
      </form>

    </div>
  )
}
