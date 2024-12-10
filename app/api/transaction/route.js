import { NextResponse } from "next/server";
import { connectDB } from "@/lib/config/database";
import transactionModels from "@/lib/models/transaction.models";

const loadDB = async()=>{
    await connectDB();
  }
  loadDB();

//   export async function GET(request){
//     return NextResponse.json({msg:"hom page"})
// }

// POST HTTP  METHOD
export async function POST(request){
    const{amount, category, description} = await request.json();
    await transactionModels.create({
        amount,
        category,
        description
   })
    
    return NextResponse.json({msg:"Transaction Added"})
}

// READ GET HTTP METHOD
export async function GET(request){
    const transaction = await transactionModels.find({});
    return NextResponse.json({transaction : transaction})
    
}
//  DELETE HHTP METHOD
export async function DELETE(request){
    const mongoId = await request.nextUrl.searchParams.get('mongoId');
    await transactionModels.findByIdAndDelete(mongoId)
    
    return NextResponse.json({msg:"Transaction Deleted"})
}