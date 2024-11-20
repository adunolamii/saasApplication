import { NextResponse } from "next/server";
import { connectDB } from "@/lib/config/database";
import AccountModels from "@/lib/models/account.models";
import TransactionModel from "@/lib/models/transaction.models";

const loadDB = async()=>{
    await connectDB();
  }
  loadDB();

  export default async function handler(req, res) {
    const { id } = req.query; // Account ID from the URL
  
    // Ensure database connection
    await dbConnect();
  
    try {
      if (req.method === "GET") {
        // Find the account by its ID
        const account = await AccountModels.findById(id);
  
        if (!account) {
          return res.status(404).json({ message: "Account not found" });
        }
  
        // Find all transactions related to this account
        const transactions = await TransactionModel.find({ accountId: id });
  
        // Calculate the balance dynamically
        const balance = transactions.reduce((acc, transaction) => {
          return transaction.type === "credit"
            ? acc + transaction.amount
            : acc - transaction.amount;
        }, 0);
  
        // Return account details with the calculated balance
        return res.status(200).json({
          success: true,
          account: {
            ...account.toObject(),
            balance, // Override the static balance with the calculated one
          },
          transactions,
        });
      } else {
        // If the request is not GET
        res.setHeader("Allow", ["GET"]);
        return res.status(405).json({ message: `Method ${req.method} not allowed` });
      }
    } catch (error) {
      console.error("Error fetching account data:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }