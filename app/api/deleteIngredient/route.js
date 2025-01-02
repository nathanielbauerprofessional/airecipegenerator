import { connectMongoDB } from "@/lib/mongodb";
import { NextResponse } from "next/server";
import User from "@/models/user";

export async function POST(req) {
    if (req.method !== 'POST') {
        NextResponse.statusCode = 405;
        return NextResponse.json({ message: 'Method Not Allowed' });
    }
    try {
        let { ingredient, email } = await req.json();
        await connectMongoDB();
        const result = await User.updateOne(
            { email: email },
            { $pull: { ingredients: ingredient } }  // Use $pull to remove the allergen from the array
        );
        if (result.modifiedCount > 0) {
            NextResponse.statusCode = 200;
            return NextResponse.json({ message: 'Ingredient Deleted' });
        } else {
            NextResponse.statusCode = 404;
            return NextResponse.json({ message: 'Ingredient Not Found' });
        }
    } catch (error) {
        console.error("Error in updating tasks:", error);
        NextResponse.statusCode = 500;
        return NextResponse.json({ message: 'Failed to update ingredients', error });
    }
}