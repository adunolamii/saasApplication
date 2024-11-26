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
    // Parse the incoming JSON data (userId, email, plan details)
    const { userId, email, planName, priceAmount, currency = 'usd', paymentMethodId } = await req.json();

    // Validate fields
    if (!userId || !email || !planName || !priceAmount || !paymentMethodId) {
      return NextResponse.json(
        { msg: 'All fields (userId, email, planName, priceAmount, paymentMethodId) are required' },
        { status: 400 }
      );
    }

    // Step 1: Create a Product
    const product = await stripe.products.create({
      name: planName,  // This is the name of the subscription plan
      description: `Subscription for ${planName}`,  // Optional description
    });

    // Step 2: Create a Recurring Price for the Product
    const price = await stripe.prices.create({
      unit_amount: priceAmount * 100, // Amount in cents, e.g., 10 dollars = 1000 cents
      currency: currency,  // Currency like 'usd'
      product: product.id,  // Link the price to the product
      recurring: { interval: 'month' },  // Set the price to be recurring (monthly in this case)
    });

    // Step 3: Create a Stripe customer
    const customer = await stripe.customers.create({
      email: email,  // User's email
      metadata: {
        userId: userId,  // Custom metadata for your user
      },
    });

    // Step 4: Attach a Payment Method to the Customer
    await stripe.paymentMethods.attach(paymentMethodId, {
      customer: customer.id,  // Customer ID for which the payment method is being attached
    });

    // Step 5: Set the Payment Method as the Default Payment Method for the Customer
    await stripe.customers.update(customer.id, {
      invoice_settings: {
        default_payment_method: paymentMethodId,  // Set the attached payment method as default
      },
    });

    // Step 6: Create a subscription for the customer with the price
    const subscription = await stripe.subscriptions.create({
      customer: customer.id,  // The created Stripe customer ID
      items: [
        {
          price: price.id,  // The price ID created for the product
        },
      ],
      expand: ['latest_invoice.payment_intent'],  // Expanding invoice for payment details (optional)
    });

    // Step 7: Save the subscription info in your database (optional)
    // Example: Save customer.id, subscription.id, price.id in your DB for future reference

    // Respond with success
    return NextResponse.json(
      {
        msg: 'Subscription created successfully',
        subscription,
        stripeCustomerId: customer.id, // Returning the created customer ID
        stripeSubscriptionId: subscription.id, // Returning the created subscription ID
        stripePriceId: price.id,  // Returning the created price ID
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating subscription:', error);
    return NextResponse.json(
      { msg: 'Failed to create subscription', error: error.message },
      { status: 500 }
    );
  }
}
//   export async function GET(request){
//     return NextResponse.json({msg:"hom page"})
// }

// Initialize Stripe with the secret key
// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
//   apiVersion: '2023-08-16', // Ensure this is the latest supported version.
// });

// HTTP POST REQ
// export async function POST(req) {
//   try {
//     // Parse the request body
//     const { userId, stripeCustomerId, stripeSubscriptionId, planId } =
//       await req.json();

//     // Validation
//     if (!userId || !stripeCustomerId || !stripeSubscriptionId || !planId) {
//       return NextResponse.json(
//         { msg: "All fields are required" },
//         { status: 400 }
//       );
//     }

//     // Create a new subscription
//     const subscription = await Subscription.create({
//       userId,
//       stripeCustomerId,
//       stripeSubscriptionId,
//       planId,
//     });

//     return NextResponse.json(
//       { msg: "Subscription created successfully", subscription },
//       { status: 201 }
//     );
//   } catch (error) {
//     console.error("Error creating subscription:", error);

//     return NextResponse.json(
//       { msg: "Failed to create subscription", error: error.message },
//       { status: 500 }
//     );
//   }
// }

//   GET REQ
// export async function GET(req) {
//   try {
//     // Extract `userId` from the query parameters
//     const { searchParams } = new URL(req.url);
//     const userId = searchParams.get("userId");

//     if (!userId) {
//       return NextResponse.json({ msg: "User ID is required" }, { status: 400 });
//     }

//     // Fetch subscriptions for the given userId
//     const subscriptions = await Subscription.find({ userId });

//     if (!subscriptions.length) {
//       return NextResponse.json(
//         { msg: "No subscriptions found for this user" },
//         { status: 404 }
//       );
//     }

//     return NextResponse.json(
//       { msg: "Subscriptions retrieved successfully", subscriptions },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error("Error fetching subscriptions:", error);
//     return NextResponse.json(
//       { msg: "Failed to fetch subscriptions", error },
//       { status: 500 }
//     );
//   }
// }

//   UPDATE HTTP REQ
// export async function PUT(request) {
//   const { subscriptionId, status, cancelAt } = await request.json(); // Extract data from request

//   try {
//     // Find the subscription by subscriptionId and update it with new data
//     const updatedSubscription = await Subscription.findOneAndUpdate(
//       { _id: subscriptionId }, // Filter by subscriptionId
//       { status, cancelAt }, // Fields to update
//       { new: true } // Return the updated document
//     );

//     if (!updatedSubscription) {
//       return NextResponse.json(
//         { msg: "Subscription not found" },
//         { status: 404 }
//       );
//     }

//     return NextResponse.json({
//       msg: "Subscription updated",
//       updatedSubscription,
//     });
//   } catch (error) {
//     console.error("Error updating subscription:", error);
//     return NextResponse.json(
//       { msg: "Failed to update subscription", error },
//       { status: 500 }
//     );
//   }
// }

// DELETE REQ
  