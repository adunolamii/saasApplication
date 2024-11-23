import mongoose from 'mongoose';

// Define the email schema
const emailSchema = new mongoose.Schema({
  userId: { 
    type: String, 
    required: true, 
    unique: true, 
    trim: true 
  },
  userEmail: {  // Ensure this is the correct field name
    type: String, 
    required: true,  // This makes it mandatory
    unique: true, 
    trim: true, 
    lowercase: true, 
    match: [/.+@.+\..+/, 'Please fill a valid email address'] // Validates email format
  },
  emailNotifications: { 
    type: Boolean, 
    default: true
  },
}, { timestamps: true }); // Automatically adds createdAt and updatedAt fields

const EmailModel = mongoose.models.Email || mongoose.model('Email', emailSchema);

export default EmailModel;
