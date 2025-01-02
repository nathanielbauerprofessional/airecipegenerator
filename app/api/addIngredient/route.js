import { connectMongoDB } from "@/lib/mongodb";
import { NextResponse } from "next/server";
import User from "@/models/user";

export async function POST(req) {
    if (req.method !== 'POST') {
        NextResponse.statusCode = 405;
        return NextResponse.json({ message: 'Method Not Allowed' });
    }
    try {
        let request = await req.json();
        await connectMongoDB();
        const result = await User.findOneAndUpdate(
            { email: request.email }, // Query document by email
            { $push: { "ingredients": request.ingredient } },
            { new: true } // Return the updated document
        );
        if (!result) {
            NextResponse.statusCode = 404;
            return NextResponse.json({ message: 'User not found' });
        }
    
        NextResponse.statusCode = 200;
        return NextResponse.json(result);
    } catch (error) {
        console.error("Error in updating ingredients:", error);
        NextResponse.statusCode = 500;
        return NextResponse.json({ message: 'Failed to update ingredients', error });
    }
}