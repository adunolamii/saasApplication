import { NextResponse } from "next/server";
import { connectDB } from "@/lib/config/database";
import Stripe from "stripe";
import Subscription from "@/lib/models/subscription.models";
import User from "@/lib/models/user.models";

const loadDB = async () => {
  await connectDB();
};
loadDB();

//   export async function GET(request){
//     return NextResponse.json({msg:"hom page"})
// }

// Initialize Stripe with the secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2022-11-15',  // This ensures you are using a current version of the API
});

// HTTP POST REQ
export async function POST(req) {
  try {
    // Parse the request body
    const { userId, stripeCustomerId, stripeSubscriptionId, planId } =
      await req.json();

    // Validation
    if (!userId || !stripeCustomerId || !stripeSubscriptionId || !planId) {
      return NextResponse.json(
        { msg: "All fields are required" },
        { status: 400 }
      );
    }

    // Create a new subscription
    const subscription = await Subscription.create({
      userId,
      stripeCustomerId,
      stripeSubscriptionId,
      planId,
    });

    return NextResponse.json(
      { msg: "Subscription created successfully", subscription },
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

//   GET REQ
export async function GET(req) {
  try {
    // Extract `userId` from the query parameters
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ msg: "User ID is required" }, { status: 400 });
    }

    // Fetch subscriptions for the given userId
    const subscriptions = await Subscription.find({ userId });

    if (!subscriptions.length) {
      return NextResponse.json(
        { msg: "No subscriptions found for this user" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { msg: "Subscriptions retrieved successfully", subscriptions },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching subscriptions:", error);
    return NextResponse.json(
      { msg: "Failed to fetch subscriptions", error },
      { status: 500 }
    );
  }
}

//   UPDATE HTTP REQ
export async function PUT(request) {
  const { subscriptionId, status, cancelAt } = await request.json(); // Extract data from request

  try {
    // Find the subscription by subscriptionId and update it with new data
    const updatedSubscription = await Subscription.findOneAndUpdate(
      { _id: subscriptionId }, // Filter by subscriptionId
      { status, cancelAt }, // Fields to update
      { new: true } // Return the updated document
    );

    if (!updatedSubscription) {
      return NextResponse.json(
        { msg: "Subscription not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      msg: "Subscription updated",
      updatedSubscription,
    });
  } catch (error) {
    console.error("Error updating subscription:", error);
    return NextResponse.json(
      { msg: "Failed to update subscription", error },
      { status: 500 }
    );
  }
}

// DELETE REQ
// export async function DELETE(request) {
//   const { subscriptionId } = await request.json(); // Extract subscriptionId from request

//   try {
//     // Find and delete the subscription by subscriptionId
//     const deletedSubscription = await Subscription.findByIdAndDelete(
//       subscriptionId
//     );

//     if (!deletedSubscription) {
//       return NextResponse.json(
//         { msg: "Subscription not found" },
//         { status: 404 }
//       );
//     }

//     return NextResponse.json({
//       msg: "Subscription deleted",
//       deletedSubscription,
//     });
//   } catch (error) {
//     console.error("Error deleting subscription:", error);
//     return NextResponse.json(
//       { msg: "Failed to delete subscription", error },
//       { status: 500 }
//     );
//   }
// }
export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const stripeSubscriptionId = searchParams.get('stripeSubscriptionId');

    if (!stripeSubscriptionId) {
      return NextResponse.json({ msg: 'Stripe Subscription ID is required' }, { status: 400 });
    }

    // Fetch subscription from the database
    const subscription = await Subscription.findOne({ stripeSubscriptionId });

    if (!subscription) {
      return NextResponse.json({ msg: 'Subscription not found' }, { status: 404 });
    }

    // Log the subscription ID for debugging
    console.log('Attempting to cancel subscription with ID:', stripeSubscriptionId);

    // Attempt to cancel the subscription using Stripe API
    const cancelledSubscription = await stripe.subscriptions.del(stripeSubscriptionId);

    // Log the cancelled subscription for debugging
    console.log('Cancelled Subscription:', cancelledSubscription);

    // Update the subscription status in the database to 'canceled'
    await Subscription.updateOne(
      { stripeSubscriptionId },
      { $set: { status: 'canceled' } }
    );

    return NextResponse.json({
      msg: 'Subscription canceled successfully',
      subscription: cancelledSubscription,
    }, { status: 200 });
  } catch (error) {
    console.error('Error canceling subscription:', error);
    return NextResponse.json({
      msg: 'Failed to cancel subscription',
      error: error.message,
    }, { status: 500 });
  }
}