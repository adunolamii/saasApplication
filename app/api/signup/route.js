

import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { connectDB } from "@/lib/config/database";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
// import userLoginModels from '@/lib/models/userLogin.models';
import { protect } from '@/lib/utility/protect';
import signupModel from "@/lib/models/signup.model";
import { sendEmail } from "@/lib/utility/sendEmail";


const loadDB = async()=>{
    await connectDB();
  }
  loadDB();

  export async function POST(req) {
    try {
      
  
      // Parse request body
      const { name, email, password } = await req.json();
  
      // Check if the user already exists
      const existingUser = await signupModel.findOne({ email });
      if (existingUser) {
        return new Response(JSON.stringify({ error: 'Email already in use' }), { status: 400 });
      }
  
      // Hash the password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
  
      // Create the new user
      const user = await signupModel.create({ name, email, password: hashedPassword });
  
      // Generate JWT token
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
  
      // Send email notification
      await sendEmail({
        to: email,
        subject: 'Welcome to Our App!',
        text: `Hi ${name},\n\nThank you for signing up. Welcome aboard!`,
      });
  
      // Return success response
      return new Response(
        JSON.stringify({ message: 'Signup successful', token }),
        { status: 201 }
      );
    } catch (error) {
      console.error('Sign-up error:', error);
      return new Response(JSON.stringify({ error: 'Server error' }), { status: 500 });
    }
  }
  

 