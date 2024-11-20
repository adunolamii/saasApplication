import { NextResponse } from "next/server";
import { connectDB } from "@/lib/config/database";
import AccountModels from "@/lib/models/account.models";

const loadDB = async()=>{
    await connectDB();
  }
  loadDB();

//   export async function GET(request){
//     return NextResponse.json({msg:"hom page"})
// }

// POST HTTP  METHOD
export async function POST(request){
    const{name, type, balance, description} = await request.json();
    await AccountModels.create({
        name,
        type,
        balance,
        description,
        
    })
    
    return NextResponse.json({msg:"Acount Added"})
}
// READ GET HTTP METHOD
export async function GET(request){
    const Account = await AccountModels.find({});
    return NextResponse.json({Account : Account})
    
}
//  DELETE HHTP METHOD
export async function DELETE(request){
    const mongoId = await request.nextUrl.searchParams.get('mongoId');
    await AccountModels.findByIdAndDelete(mongoId)
    
    return NextResponse.json({msg:"Account Deleted"})
}

//  PUT HHTP METHOD
export async function PUT(request){
    const mongoId = await request.nextUrl.searchParams.get('mongoId');
    await AccountModels.findByIdAndUpdate(mongoId, {
    $set:{
        isCompleted:true
    }
})
    return NextResponse.json({msg:"Account Updated"})
}

