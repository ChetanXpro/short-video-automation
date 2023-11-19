import { NextResponse } from "next/server";
import connectDB from "@/db/mongodb";
import Email from "@/models/Email";

export async function GET(req) {
  return NextResponse.json({ message: "Email already exist" }, { status: 500 });
}

export async function POST(req) {
  await connectDB();

  try {
    const email = await req.json();
    if (!email) {
      return new NextResponse("Missing field", { status: 400 });
    }

    const checkEmail = await Email.findOne({ email: email });

    if (checkEmail) {
    
      return NextResponse.json(
        { message: "Email already exist" },
        { status: 400 }
      );
      
    }

    let ip = req.headers['x-real-ip'];
  
    const forwardedFor = req.headers['x-forwarded-for']
    if(!ip && forwardedFor){
      ip = forwardedFor?.split(",").at(0) ?? "Unknown";
    }

    

     await Email.create({ email , realIp: ip});

    return NextResponse.json("Saved", { status: 200 });
  } catch (error) {
    console.log(error);
  }
}
