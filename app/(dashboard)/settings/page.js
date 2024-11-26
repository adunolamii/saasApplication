"use client"

import React from 'react'
import EmailForm from './_components/EmailForm'
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

const page = () => {
  const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);
  return (
    <div>
       <Elements stripe={stripePromise}>
      <EmailForm/>
      </Elements>
    </div>
  )
}

export default page