// utils/sendEmail.js
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail', // You can also use other services like 'Mailgun', 'SendGrid', etc.
  auth: {
    user: process.env.EMAIL_USER, // Your email address (should be in .env file)
    pass: process.env.EMAIL_PASS, // Your email password (should be in .env file)
  },
});

export const sendEmail = async ({ to, subject, text, html }) => {
  const mailOptions = {
    from: process.env.EMAIL_USER, // Sender's email
    to, // Receiver's email
    subject, // Subject line
    text, // plain text body
    html, // html body
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Failed to send email');
  }
};
