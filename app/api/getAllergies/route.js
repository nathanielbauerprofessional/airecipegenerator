import { connectMongoDB } from "@/lib/mongodb";
import { NextResponse } from "next/server";
import User from "@/models/user";

export async function POST(req) {
    if (req.method !== 'POST') {
        NextResponse.statusCode = 405;
        return NextResponse.json({ message: 'Method Not Allowed' });
    }
    try {
        let { email } = await req.json();
        await connectMongoDB();
        const allergies = await User.findOne({ email: email }).select('allergies');
        if (!allergies) {
            NextResponse.statusCode = 404;
            return NextResponse.json({ message: 'User not found' });
        }
        NextResponse.statusCode = 200;
        return NextResponse.json(allergies);
    } catch (error) {
        console.error("Error in getting allergens:", error);
        NextResponse.statusCode = 500;
        return NextResponse.json({ message: 'Error in getting allergens:', error });
    }
}