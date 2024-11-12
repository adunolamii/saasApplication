import { NextResponse } from "next/server";
import { connectDB } from "@/lib/config/database";

import TransactionModel from "@/lib/models/transaction.models";

const loadDB = async()=>{
    await connectDB();
  }
  loadDB();

//   export async function GET(request){
//     return NextResponse.json({msg:"hom page"})
// }

// POST HTTP  METHOD
export async function POST(request){
    const{ date, amount, category, description} = await request.json();
    await TransactionModel.create({
        date: Date.now(),
        amount,
        category,
        description,
        
    })
    
    return NextResponse.json({msg:"Transaction Successful"})
}

// READ GET HTTP METHOD
    export async function GET(request){
    const Transaction = await TransactionModel.find({});
    return NextResponse.json({Transaction : Transaction})
    
}

// CREATE DELETE HHTP METHOD
export async function DELETE(request){
    const mongoId = await request.nextUrl.searchParams.get('mongoId');
    await TransactionModel.findByIdAndDelete(mongoId)
    
    return NextResponse.json({msg:"Transaction Deleted"})
}
// CREATE PUT HHTP METHOD
// export async function PUT(request){
//     const mongoId = await request.nextUrl.searchParams.get('mongoId');
//     await TransactionModel.findByIdAndUpdate(mongoId, {
//     $set:{
//         isCompleted:true
//     }
// })
//     return NextResponse.json({msg:"Transaction Updated"})
// }