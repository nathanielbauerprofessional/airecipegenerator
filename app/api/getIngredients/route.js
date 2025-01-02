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
        const ingredients = await User.findOne({ email: email }).select('ingredients');
        if (!ingredients) {
            NextResponse.statusCode = 404;
            return NextResponse.json({ message: 'User not found' });
        }
        NextResponse.statusCode = 200;
        return NextResponse.json(ingredients);
    } catch (error) {
        console.error("Error in getting ingredients:", error);
        NextResponse.statusCode = 500;
        return NextResponse.json({ message: 'Error in getting ingredients:', error });
    }
}