import { NextResponse } from "next/server";
import { connectDB } from "@/lib/config/database";
// import billingModels from "@/lib/models/billing.models";
import Billing from "@/lib/models/billing.models";
import mongoose from "mongoose";
import { sendEmail } from "@/lib/utility/sendEmail";


const loadDB = async()=>{
    await connectDB();
  }
  loadDB();

//   export async function GET(request){
//     return NextResponse.json({msg:"hom page"})
// }

// export async function POST(request){
//   const{userId, description, amount, dueDate} = await request.json();
//   await billingModels.create({
//     userId,
//     description,
//     amount,
//     dueDate,
     
//   })
  
//   return NextResponse.json({msg:"Billing Added"})
// }

// READ GET HTTP METHOD
export async function GET(request){
  const Billing = await billingModels.find({});
  return NextResponse.json({Billing : Billing})
  
}

//  DELETE HHTP METHOD
export async function DELETE(request){
  const mongoId = await request.nextUrl.searchParams.get('mongoId');
  await billingModels.findByIdAndDelete(mongoId)
  
  return NextResponse.json({msg:"Billing Deleted"})
}

export async function POST(req) {
  try {
    const { userId, description, amount, dueDate } = await req.json();

    // Validate required fields
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      throw new Error('Invalid or missing userId');
    }
    if (!description || !amount || !dueDate) {
      throw new Error('Missing required fields');
    }

    // Save billing entry
    await connectDB();
    const newBilling = await Billing.create({
      userId,
      description,
      amount,
      dueDate,
      status: 'unpaid',
    });

    // Trigger email notification (optional)
    await sendEmail({
      to: 'user@example.com',
      subject: 'New Invoice Created',
      text: `Details: ${description}, Amount: ${amount}`,
    });

    return NextResponse.json({
      Billing: newBilling,
      message: 'Billing entry created and email notification sent!',
    });
  } catch (error) {
    console.error('Error creating billing entry:', error.message);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}