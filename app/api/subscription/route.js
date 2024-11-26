import { NextResponse } from "next/server";
import { connectDB } from "@/lib/config/database";
import Stripe from "stripe";
import Subscription from "@/lib/models/subscription.models";
import User from "@/lib/models/user.models";


const loadDB = async () => {
  await connectDB();
};
loadDB();

// Initialize Stripe with the secret key from environment variables
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// POST endpoint for creating a subscription

export async function POST(req) {
  try {
    const { userId, email, name, planAmount, planInterval } = await req.json();

    // Validation
    if (!userId || !email || !name || !planAmount || !planInterval) {
      return NextResponse.json(
        {
          msg: "All fields (userId, email, name, planAmount, planInterval) are required",
        },
        { status: 400 }
      );
    }

    // 1. Create a Stripe Customer
    const customer = await stripe.customers.create({
      email,
      name,
    });

    // 2. Create a Stripe Price (Plan)
    const product = await stripe.products.create({
      name: `${planAmount}-${planInterval}-plan`,
    });

    const price = await stripe.prices.create({
      unit_amount: planAmount * 100, // Amount in cents
      currency: "usd",
      recurring: { interval: planInterval }, // 'month' or 'year'
      product: product.id,
    });

    // 3. Create a Stripe Subscription
    const subscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: [{ price: price.id }],
      payment_behavior: "default_incomplete",
    });

    // 4. Save data in MongoDB
    const newSubscription = await Subscription.create({
      userId, // Ensure this field is provided
      email,
      stripeCustomerId: customer.id,
      stripeSubscriptionId: subscription.id,
      planId: price.id,
      planAmount,
      planInterval,
    });

    return NextResponse.json(
      {
        msg: "Subscription created successfully",
        subscription: newSubscription,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating subscription:", error);
    return NextResponse.json(
      { msg: "Failed to create subscription", error: error.message },
      { status: 500 }
    );
  }
}



// DELETE REQ
  