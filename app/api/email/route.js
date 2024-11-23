import { NextResponse } from "next/server";
import { connectDB } from "@/lib/config/database";
import EmailModels from "@/lib/models/email.models";
import nodemailer from "nodemailer";

const loadDB = async()=>{
    await connectDB();
  }
  loadDB();

//   export async function GET(request){
//     return NextResponse.json({msg:"hom page"})
// }
// THE SMPT IN my .env still doesnt count, msg shows with or without

export async function POST(request) {
    const { userId, userEmail } = await request.json();
  
    try {
      // Add email to the database
      const email = await EmailModels.create({ userId, userEmail });
  
      // Set up Nodemailer transporter
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER, // Your Gmail address
          pass: process.env.EMAIL_PASS, // Your Gmail app password
        },
      });
  
      // Define email options
      const mailOptions = {
        from: process.env.EMAIL_USERNAME,
        to: userEmail,
        subject: 'Welcome to Finance App',
        text: `Hi there! Your email ${userEmail} has been added successfully. Thank you for joining us! 🤝`,
      };
  
      // Send the email
      await transporter.sendMail(mailOptions);
  
      return NextResponse.json({ msg: 'Email added and notification sent successfully', email });
    } catch (error) {
      console.error('Error adding email or sending notification:', error);
      return NextResponse.json({ msg: 'Failed to add email or send notification', error }, { status: 500 });
    }
  }


// GET HTTP REQ
export async function GET(request) {
    try {
      // Extract the `userId` from query parameters
      const { searchParams } = new URL(request.url);
      const userId = searchParams.get("userId");
  
      if (!userId) {
        return NextResponse.json(
          { msg: "userId is required" },
          { status: 400 }
        );
      }
  
      // Find the user's email notification settings
      const email = await EmailModels.findOne({ userId });
  
      if (!email) {
        return NextResponse.json(
          { msg: "Email settings not found for this user" },
          { status: 404 }
        );
      }
  
      // Respond with the user's email and notification preferences
      return NextResponse.json({
        msg: "Email settings fetched successfully",
        email,
      });
    } catch (error) {
      console.error("Error fetching email settings:", error);
      return NextResponse.json(
        { msg: "Failed to fetch email settings", error },
        { status: 500 }
      );
    }
  }

//   PATCH HTTP REQ
export async function PATCH(request) {
    try {
      const { userId, userEmail, emailNotifications } = await request.json();
  
      // Validate input
      if (!userId) {
        return NextResponse.json({ msg: "userId is required" }, { status: 400 });
      }
  
      // Find and update the user's email settings
      const updatedEmail = await EmailModels.findOneAndUpdate(
        { userId }, // Search by userId
        { userEmail, emailNotifications }, // Update fields
        { new: true } // Return the updated document
      );
  
      if (!updatedEmail) {
        return NextResponse.json(
          { msg: "Email settings not found for this user" },
          { status: 404 }
        );
      }
  
      return NextResponse.json({
        msg: "Email settings updated successfully",
        email: updatedEmail,
      });
    } catch (error) {
      console.error("Error updating email settings:", error);
      return NextResponse.json(
        { msg: "Failed to update email settings", error },
        { status: 500 }
      );
    }
  }

//   DELETE HTTP REQ
export async function DELETE(request) {
    try {
      const { userId } = await request.json();
  
      if (!userId) {
        return NextResponse.json({ msg: "userId is required" }, { status: 400 });
      }
  
      // Delete the user's email settings
      const deletedEmail = await EmailModels.findOneAndDelete({ userId });
  
      if (!deletedEmail) {
        return NextResponse.json(
          { msg: "Email settings not found for this user" },
          { status: 404 }
        );
      }
  
      return NextResponse.json({
        msg: "Email settings deleted successfully",
        email: deletedEmail,
      });
    } catch (error) {
      console.error("Error deleting email settings:", error);
      return NextResponse.json(
        { msg: "Failed to delete email settings", error },
        { status: 500 }
      );
    }
  }
  