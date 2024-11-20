const mongoose = require("mongoose");

const AccountSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Account name is required"],
      trim: true,
    },
    type: {
      type: String,
      enum: ["savings", "current", "business"],
      required: [true, "Account type is required"],
    },
    balance: {
      type: Number,
      required: [true, "Balance is required"],
      min: [0, "Balance cannot be negative"],
    },
    description: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.models.Account || mongoose.model("Account", AccountSchema);
