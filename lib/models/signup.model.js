
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const signupSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

// Add a method to check if passwords match
signupSchema.methods.matchPassword = async function (enteredPassword) {
  const bcrypt = await import('bcryptjs'); // Dynamically import bcrypt for compatibility
  return bcrypt.compare(enteredPassword, this.password);
};

const signupModels = mongoose.models.signup || mongoose.model('signup', signupSchema);

export default signupModels;


// const userSchema = new mongoose.Schema(
//   {
//     email: { type: String, required: true, unique: true },
//     password: { type: String, required: true },
//   },
//   { timestamps: true }
// );

// // Hash the password before saving to DB
// userSchema.pre('save', async function (next) {
//   if (!this.isModified('password')) return next();

//   const salt = await bcrypt.genSalt(10);
//   this.password = await bcrypt.hash(this.password, salt);
//   next();
// });

// // Method to compare passwords during login
// userSchema.methods.matchPassword = async function (enteredPassword) {
//   return await bcrypt.compare(enteredPassword, this.password);
// };

// export default mongoose.models.User || mongoose.model('User', userSchema);
