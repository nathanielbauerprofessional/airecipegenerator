// pages/api/getRecipe.js
import OpenAI from "openai";
import { NextResponse } from "next/server";

export async function handler(req, res) {
    if (req.method === 'POST') {
        const data = await req.json();
        console.log(data);
        const { ingredients, allergies, meal, cuisine, dietary, level, quick } = data;
        const openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
          });
        const quantityIngredientsList = [];
        ingredients.forEach((ingredient) => {
          quantityIngredientsList.push(`${(ingredient.quantity != 0 ? ingredient.quantity : "")} ${(ingredient.quantity != 0 ? ingredient.units: "").trim()} ${ingredient.ingredientName}`);
        })
        const ingredientsSend = quantityIngredientsList.join(", ");
        const prompt = `Create a recipe for a ${cuisine == "any" ? "" : cuisine} ${dietary == "any" ? "" : dietary} ${meal} using these ingredients: ${ingredientsSend}. ${allergies.length > 0 ? `My allergies are ${allergies.join(", ")}.`: ""} The difficulty of the recipe should be ${level} level. ${quick == "yes" ? "The entire time to make the recipe should be less than 30 minutes." : ""} The exact amounts of the ingredients do not have to be exact, just preferrably not more than the possessed quantity. If any ingredient doesn't make sense as a food item, return an empty recipe JSON. Format the recipe as JSON with the following structure:
{
  "title": "Dish name",
  "ingredients": [
    "Item 1 - quantity",
    "Item 2 - quantity"
  ],
  "prepTime": "Total preparation time in minutes",
  "cookTime": "Total cooking time in minutes",
  "servings": "Number of servings",
  "instructions": [
    "Step 1",
    "Step 2",
    etc.
  ],
  "suggestions": [
    "Suggestion 1",
    "Suggestion 2",
    etc.
  ]
}
Ensure all fields are present in the response, and use this exact structure.
            `;
        console.log("FINAL PROMPT", prompt);
        try {
            const completion = await openai.chat.completions.create({
                model: "gpt-4o-mini",
                response_format: { "type": "json_object" },
                messages: [
                    { role: "system", content: "You are a culinary assistant." },
                    { role: "user", content: prompt }
                ],
            });

            NextResponse.statusCode = 200;
            return NextResponse.json({ recipe: completion.choices[0].message.content });
        } catch (error) {
            console.error("Error fetching the recipe:", error);
            NextResponse.statusCode = 500;
            return NextResponse.json({ message: "Failed to fetch recipe" });
        }
    } else {
        NextResponse.statusCode = 405;
        return NextResponse.json({ message: `Method ${req.method} Not Allowed` });
    }
}

// Export handler as POST, matching Next.js conventions for API routes
export const POST = handler;