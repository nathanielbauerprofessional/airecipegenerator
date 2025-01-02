import { connectMongoDB } from "@/lib/mongodb";
import { NextResponse } from "next/server";
import User from "@/models/user";

export async function POST(req) {
    if (req.method !== 'POST') {
        NextResponse.statusCode = 405;
        return NextResponse.json({ message: 'Method Not Allowed' });
    }
    try {
        let { allergy, email } = await req.json();
        await connectMongoDB();
        const result = await User.updateOne(
            { email: email },
            { $pull: { allergies: allergy } }  // Use $pull to remove the allergen from the array
        );
        if (result.modifiedCount > 0) {
            NextResponse.statusCode = 200;
            return NextResponse.json({ message: 'Allergen Deleted' });
        } else {
            NextResponse.statusCode = 404;
            return NextResponse.json({ message: 'Allergen Not Found' });
        }
    } catch (error) {
        console.error("Error in updating tasks:", error);
        NextResponse.statusCode = 500;
        return NextResponse.json({ message: 'Failed to update allergens', error });
    }
}