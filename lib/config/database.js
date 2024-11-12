import mongoose from "mongoose";
import dotenv from "dotenv"

 export const connectDB = async ()=>{

    await mongoose.connect(process.env.MONGODB_URL)
    console.log("connectedDB for saas app");
    
}

