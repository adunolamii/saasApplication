import { NextResponse } from "next/server";
import { connectDB } from "@/lib/config/database";
import CategoryModels from "@/lib/models/category.models";

const loadDB = async()=>{
    await connectDB();
  }
  loadDB();

//   export async function GET(request){
//     return NextResponse.json({msg:"hom page"})
// }

// POST HTTP  METHOD
export async function POST(request){
    const{name, type, color} = await request.json();
    await CategoryModels.create({
        name,
        type,
        color,
   })
    
    return NextResponse.json({msg:"Category Added"})
}

// READ GET HTTP METHOD
export async function GET(request){
    const Category = await CategoryModels.find({});
    return NextResponse.json({Category : Category})
    
}
//  DELETE HHTP METHOD
export async function DELETE(request){
    const mongoId = await request.nextUrl.searchParams.get('mongoId');
    await CategoryModels.findByIdAndDelete(mongoId)
    
    return NextResponse.json({msg:"Category Deleted"})
}