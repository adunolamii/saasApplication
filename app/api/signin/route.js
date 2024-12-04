import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { connectDB } from "@/lib/config/database";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { protect } from '@/lib/utility/protect';
import signinModel from "@/lib/models/signin.models";
import { sendEmail } from "@/lib/utility/sendEmail";
import crypto from 'crypto';
import nodemailer from 'nodemailer';


const loadDB = async()=>{
    await connectDB();
  }
  loadDB();

 
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
  
  async function sendEmailNotification(email, subject, text) {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: subject,
      text: text,
    };
  
    try {
      await transporter.sendMail(mailOptions);
    } catch (err) {
      console.log('Error sending email:', err);
    }
  }
  
  export async function POST(req) {
    const { action, email, password, token, newPassword } = await req.json();
  
    if (action === 'signin') {
      // Handle Sign-In
      try {
        const user = await signinModel.findOne({ email });
        if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });
  
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return NextResponse.json({ error: 'Invalid credentials' }, { status: 400 });
  
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
  
        await sendEmailNotification(
          user.email,
          'Login Successful',
          `Hello ${user.name},\n\nYou have successfully logged into your account.\n\nIf this wasn't you, please reset your password immediately.`
        );
  
        return NextResponse.json({ message: 'Sign-in successful', token }, { status: 200 });
  
      } catch (err) {
        console.error(err);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
      }
    }
  
    if (action === 'forgot-password') {
      // Handle Forgot Password
      try {
        const user = await signinModel.findOne({ email });
        if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });
  
        const resetToken = crypto.randomBytes(20).toString('hex');
        const resetTokenExpiry = Date.now() + 3600000; // 1 hour
  
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = resetTokenExpiry;
        await user.save();
  
        const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
  
        await sendEmailNotification(
          user.email,
          'Password Reset Request',
          `Hello ${user.name},\n\nYou requested a password reset. Please use the following link to reset your password:\n\n${resetLink}\n\nIf you didn't request this, please ignore this email.`
        );
  
        return NextResponse.json({ message: 'Password reset email sent' }, { status: 200 });
  
      } catch (err) {
        console.error(err);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
      }
    }
  
    if (action === 'reset-password') {
      // Handle Reset Password
      try {
        const user = await signinModel.findOne({
          resetPasswordToken: token,
          resetPasswordExpires: { $gt: Date.now() },
        });
  
        if (!user) return NextResponse.json({ error: 'Invalid or expired reset token' }, { status: 400 });
  
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();
  
        return NextResponse.json({ message: 'Password reset successful' }, { status: 200 });
  
      } catch (err) {
        console.error(err);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
      }
    }
  
    return NextResponse.json({ error: 'Invalid action type' }, { status: 400 });
  }