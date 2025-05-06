"use client"
import { useState } from "react";
import { useSession } from "next-auth/react";
import CircleSelect from "./CircleSelect";
import OblongSelect from "./OblongSelect";
import { MdBrunchDining, MdOutlineBreakfastDining, MdOutlineDinnerDining, MdOutlineLunchDining  } from "react-icons/md";
import { LuDessert } from "react-icons/lu";
import { GiChipsBag, GiNachos } from "react-icons/gi";
import { RiNumber1, RiNumber2, RiNumber3, RiNumber4 } from "react-icons/ri";
import { FaCheck, FaX } from "react-icons/fa6";
import { LuSoup, LuSalad  } from "react-icons/lu";
import { BiDish, BiDrink  } from "react-icons/bi";
import { CiFries } from "react-icons/ci";
import { FaBoxOpen, FaRegClock } from "react-icons/fa";

export default function GenerateRecipeComponent() {
  const { data: session } = useSession();

  //Overall form state
  const [active, setActive] = useState("recipeinfo");

  //First form inputs
    const [mealInput, setMealInput] = useState('');
    const [cuisineInput, setCuisineInput] = useState('');
    const [levelInput, setLevelInput] = useState('');
    const [dietaryInput, setDietaryInput] = useState('');
    const [quickInput, setQuickInput] = useState('');

  //Second form inputs
    const [ingredients, setIngredients] = useState([]);
    const [ingredientInput, setIngredientInput] = useState('');
    const [quantityInput, setQuantityInput] = useState('');
    const [unitsInput, setUnitsInput] = useState('');

  //Error state
    const [error, setError] = useState('');

  //Loading States
  const [isLoadingRecipe, setIsLoadingRecipe] = useState(false);
  const [isLoadingPantry, setIsLoadingPantry] = useState(false);

  //Final Generation state
  const [recipe, setRecipe] = useState();

    const fetchIngredients = async () => {
        setIsLoadingPantry(true);
        try {
            const response = await fetch(`/api/getIngredients`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: session?.user?.email }),
            });
            console.log("email", session?.user?.email);
            const responseJson = await response.json();
            console.log(responseJson, "RESPONSE JSON");
            setIngredients(responseJson.ingredients);
        } catch (error) {
            console.log("Error Fetching Ingredients: ", error);
        } finally {
            setIsLoadingPantry(false);
        }
    }

    const handleAdd = (event) => {
        document.forms[0].reset();
        event.preventDefault();
        if (ingredientInput.trim() === "") {
            return;
        } else {
            const ingredient = {ingredientName: ingredientInput, expDate: "", quantity: quantityInput ? quantityInput : 0, units: unitsInput ? unitsInput : ""}
            setIngredients([...ingredients, ingredient]);
            setIngredientInput('');
            setQuantityInput('');
            setUnitsInput('');
        }
    }

    const handleDeleteIngredient = (ingredientToBeDeleted) => {
        setIngredients(ingredients.filter(ingredient => ingredient.ingredientName !== ingredientToBeDeleted.ingredientName));
    }

    const fetchAllergies = async () => {
        try {
            const response = await fetch(`/api/getAllergies`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: session?.user?.email }),
            });
            const responseJson = await response.json();
            return responseJson.allergies;
        } catch (error) {
            console.log("Error Fetching Allergies: ", error);
        }
    }

    const handleGenerate = async (event) => {
        event.preventDefault();
        setActive("recipegeneration");
        setError("");
        if (ingredients.length >= 1 && mealInput && cuisineInput && levelInput && quickInput && dietaryInput) {
            setIsLoadingRecipe(true);
            try {
                const allergies = await fetchAllergies();
                const recipeObject = {
                  ingredients: ingredients,
                  allergies: allergies,
                  meal: mealInput, 
                  cuisine: cuisineInput,
                  level: levelInput,
                  dietary: dietaryInput,
                  quick: quickInput
                }
                const response = await fetch('/api/getRecipe', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(recipeObject),
                });
                const responseBody = await response.text();
                const data = JSON.parse(responseBody);
                const parsedRecipe = JSON.parse(data.recipe);
                if(response.ok && isValidRecipe(parsedRecipe)) { 
                    setRecipe(parsedRecipe);
                } else {
                    setError("There was an error parsing the AI's response. Please check to ensure your ingredients are all real food ingredients, and then try again.");
                }
            } catch (error) {
                console.error("Error occurred while handling submission: ", error);
                setError(error.message);  // Set error when an exception occurs
            } finally {
                setIsLoadingRecipe(false);
            }
        } else {
            setError("Ensure all parts of the form are filled out.");  // Set error when validation fails
        }
    };

    const handleDeleteAll = () => {
        setIngredients([]);
    }

    const handleGenReset = () => {
      setIngredients([]);
      setIngredientInput("");
      setQuantityInput("");
      setUnitsInput("");
      setMealInput("");
      setCuisineInput("");
      setLevelInput("");
      setDietaryInput("");
      setQuickInput("");
      setActive("recipeinfo");
    }

    const isValidRecipe = (recipe) => {
        try {
            return recipe.title && Array.isArray(recipe.ingredients) && recipe.instructions.length > 0;
        } catch (error) {
            return false; 
        }
    };

    return (
      <>
    <section
        id="hero"
        className="relative w-full bg-gray-100 flex items-center py-20 md:py-32"
      >
        <div className="max-w-5xl mx-auto px-12 flex flex-col md:flex-row items-center justify-between">

          <div className="md:w-1/2 space-y-6 text-center md:text-left">
            <span className="uppercase text-sm tracking-wide text-blue-600">
              DISCOVER
            </span>
            <h1 className="text-5xl font-bold leading-tight bg-gradient-to-r from-blue-200 via-blue-500 to-blue-800 bg-clip-text text-transparent">
              Delicious AI‑Powered Recipes
            </h1>
            <p className="text-lg text-gray-700">
              Tell us what’s in your pantry and we’ll generate mouth‑watering
              recipes tailored to your ingredients, dietary needs, and schedule—
              no more “what’s for dinner?” stress.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-8 justify-center lg:justify-start items-center">
              <div className="flex items-start space-x-4">
                <FaBoxOpen className="h-6 w-6 text-blue-500 mt-1" />
                <div>
                  <h3 className="font-semibold text-black">Pantry‑Friendly</h3>
                  <p className="text-sm text-gray-600">
                    Make the most of what you already have at home.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <FaRegClock className="h-6 w-6 text-blue-500 mt-1" />
                <div>
                  <h3 className="font-semibold text-black">Ready in 30 Minutes</h3>
                  <p className="text-sm text-gray-600">
                    Fresh, fast, and fuss‑free meals for any weeknight.
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={e => {
                e.preventDefault();
                document
                  .getElementById("main-content")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
              className="mt-10 inline-block px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition"
            >
              Try It →
            </button>
          </div>

          <div className="hidden md:visible md:w-1/2 md:flex justify-center md:justify-end mt-12 md:mt-0">
            <img
              src="heroimage.png"
              alt="Delicious dish"
              className="w-96 h-96 rounded-full object-cover object-top border-4 border-blue-500 shadow-lg"
            />
          </div>
        </div>
      </section>

        <div className="w-full h-screen flex flex-col items-center font-quicksand text-center mt-12" id="main-content">
          <div className="flex flex-wrap gap-4 justify-center py-4 mb-4">
            {active === "recipeinfo" ? (
              <div className="bg-blue-500 border-blue-700 border-2 p-2 sm:p-4 text-white rounded-full text-xs sm:text-sm">
                <h3 className="text-center">Recipe Information</h3>
              </div>
            ) : (
              <div className="bg-blue-200 p-2 sm:p-4 text-blue-600 rounded-full text-xs sm:text-sm">
                <h3 className="text-center">Recipe Information</h3>
              </div>
            )}
            {active === "addingredients" ? (
              <div className="bg-blue-500 border-blue-700 border-2 p-2 sm:p-4 text-white rounded-full text-xs sm:text-sm">
                <h3 className="text-center">Ingredients</h3>
              </div>
            ) : (
              <div className="bg-blue-200 p-2 sm:p-4 text-blue-600 rounded-full text-xs sm:text-sm">
                <h3 className="text-center">Ingredients</h3>
              </div>
            )}
            {active === "recipegeneration" ? (
              <div className="bg-blue-500 border-blue-700 border-2 p-2 sm:p-4 text-white rounded-full text-xs sm:text-sm">
                <h3 className="text-center">Generated Recipe</h3>
              </div>
            ) : (
              <div className="bg-blue-200 p-2 sm:p-4 text-blue-600 rounded-full text-xs sm:text-sm">
                <h3 className="text-center">Generated Recipe</h3>
              </div>
            )}
          </div>


          <div className="w-full max-w-4xl mx-auto border-2 border-gray-300 p-6 items-center flex flex-col">
          {active == "recipeinfo" && 
            <div className="flex flex-col items-center justify-center px-4  max-w-lg md:max-w-4xl">
              <form className="text-center w-full"> 
                <h5 className="text-lg mb-2 text-wrap">What type of meal are you looking for?</h5>
                <div className="w-full">
                  <CircleSelect
                    options={[
                      { value: "breakfast", icon: MdOutlineBreakfastDining, label: "Breakfast" },
                      { value: "brunch", icon: MdBrunchDining, label: "Brunch" },
                      { value: "lunch", icon: MdOutlineLunchDining, label: "Lunch" },
                      { value: "snack", icon: GiChipsBag, label: "Snack" },
                      { value: "appetizer", icon: GiNachos, label: "Appetizer" },
                      { value: "soup", icon: LuSoup, label: "Soup" },
                      { value: "salad", icon: LuSalad, label: "Salad" },
                      { value: "main", icon: BiDish, label: "Main Course" },
                      { value: "side", icon: CiFries, label: "Side Dish" },
                      { value: "dessert", icon: LuDessert, label: "Dessert" },
                      { value: "beverage", icon: BiDrink, label: "Beverage" },
                    ]}
                    onChange={(value) => setMealInput(value)}
                    prevSelected={mealInput !== "" ? mealInput : null}
                  />
                </div>
                
                <h5 className="text-lg mb-2 mt-4 text-wrap">What cuisine are you in the mood for?</h5>
                <div className="w-full">
                  <OblongSelect
                    options={[  "Any",
                      "American",
                      "Mexican",
                      "Italian",
                      "French",
                      "Spanish",
                      "Greek",
                      "British",
                      "German",
                      "Russian",
                      "Middle Eastern",
                      "Mediterranean",
                      "Indian",
                      "Chinese",
                      "Japanese",
                      "Korean",
                      "Vietnamese",
                      "Thai",
                      "Indonesian",
                      "Filipino",
                      "Caribbean",
                      "African",
                      "Brazilian",
                      "Latin American"]}
                    onChange={(value) => setCuisineInput(value)}
                    prevSelected={cuisineInput !== "" ? cuisineInput : null}
                  />
                </div>

                <h5 className="text-lg mb-2 mt-4 text-wrap">What is your cooking skill level?</h5>
                <div className="w-full">
                  <CircleSelect
                    options={[
                      { value: "beginner", icon: RiNumber1, label: "Beginner" },
                      { value: "intermediate", icon: RiNumber2, label: "Intermediate" },
                      { value: "advanced", icon: RiNumber3, label: "Advanced" },
                      { value: "expert", icon: RiNumber4, label: "Expert" }
                    ]}
                    onChange={(value) => setLevelInput(value)}
                    prevSelected={levelInput !== "" ? levelInput : null}
                  />
                </div>

                <h5 className="text-lg mb-2 mt-4 text-wrap">Do you have any dietary preferences or restrictions?</h5>
                <div className="w-full">
                  <OblongSelect
                    options={[ "None",
                      "Vegetarian",
                      "Vegan",
                      "Pescatarian",
                      "Gluten-Free",
                      "Dairy-Free",
                      "Nut-Free",
                      "Keto",
                      "Paleo",
                      "Low Carb",
                      "Low Fat",
                      "Low Sugar",
                      "High Protein",
                      "Halal",
                      "Kosher",]}
                    onChange={(value) => setDietaryInput(value)}
                    prevSelected={dietaryInput !== "" ? dietaryInput : null}
                  />
                </div>

                <h5 className="text-lg mb-2 mt-4 text-wrap">Do you need the recipe to be ready in under 30 minutes?</h5>
                <div className="w-full">
                  <CircleSelect
                    options={[
                      { value: "yes", icon: FaCheck, label: "Yes" },
                      { value: "no", icon: FaX, label: "No" },
                    ]}
                    onChange={(value) => setQuickInput(value)}
                    prevSelected={quickInput !== "" ? quickInput : null}
                  />
                </div>
              </form>

              <button className="self-center py-3 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 mt-4" onClick={() => setActive("addingredients")}>
                Continue →
              </button>
            </div>
          }


          {active === "addingredients" && (
            <div className="w-full max-w-4xl mx-auto px-4 flex flex-col items-stretch">
              <button
                className="self-center py-3 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4 text-lg"
                onClick={fetchIngredients}
              >
                Get Ingredients From Pantry
              </button>

              <form onSubmit={handleAdd} className="space-y-4 w-full">
                <div className="flex flex-col gap-1">
                  <label htmlFor="ingredientInput" className="font-semibold text-gray-700 text-lg">
                    Ingredient
                  </label>
                  <input
                    id="ingredientInput"
                    type="text"
                    placeholder="Enter an ingredient"
                    value={ingredientInput}
                    onChange={(e) => setIngredientInput(e.target.value)}
                    className="w-full py-3 px-4 text-lg rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label htmlFor="quantityInput" className="font-semibold text-gray-700 text-lg">
                    Quantity
                  </label>
                  <input
                    id="quantityInput"
                    type="number"
                    min="0"
                    placeholder="Enter a quantity"
                    value={quantityInput}
                    onChange={(e) => setQuantityInput(e.target.value)}
                    className="w-full py-3 px-4 text-lg rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label htmlFor="unitsInput" className="font-semibold text-gray-700 text-lg">
                    Unit
                  </label>
                  <select
                    id="unitsInput"
                    value={unitsInput}
                    onChange={(e) => setUnitsInput(e.target.value)}
                    className="w-full py-3 px-4 text-lg rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="default">Select Units</option>
                    <option value="teaspoons">Teaspoons</option>
                    <option value="tablespoons">Tablespoons</option>
                    <option value="cups">Cups</option>
                    <option value="pints">Pints</option>
                    <option value="quarts">Quarts</option>
                    <option value="gallons">Gallons</option>
                    <option value="ounces">Ounces</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 px-4 text-lg bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Add Ingredient
                </button>
              </form>

              <div className="flex flex-wrap gap-4 justify-center py-4 w-full">
                {ingredients.length > 0 ? (
                  ingredients.map((ingredient, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 bg-white border border-blue-300 rounded-lg shadow-sm w-full"
                    >
                      <div>
                        <h3 className="text-blue-600 font-semibold">{ingredient.ingredientName}</h3>
                        {ingredient.quantity !== 0 && (
                          <p className="text-sm text-gray-600">Quantity: {ingredient.quantity}</p>
                        )}
                        {ingredient.expDate && (
                          <p className="text-sm text-gray-600">Expires: {ingredient.expDate}</p>
                        )}
                      </div>
                      <button
                        onClick={() => handleDeleteIngredient(ingredient)}
                        className="ml-4 p-2 text-xs sm:text-sm bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200 transition"
                      >
                        Remove
                      </button>
                    </div>
                  ))
                ) : isLoadingPantry ? (
                  <p className="text-sm sm:text-base">Loading Pantry...</p>
                ) : (
                  <p className="text-sm sm:text-base">No ingredients added yet.</p>
                )}
              </div>

              <div className="px-6 pb-6 flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  className="flex-1 py-3 bg-blue-200 text-blue-700 rounded-md hover:bg-blue-300 transition font-medium"
                  onClick={() => setActive("recipeinfo")}
                >
                  ← Back
                </button>
                <button
                  className="flex-1 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition font-medium"
                  onClick={handleGenerate}
                >
                  Submit
                </button>
              </div>
            </div>
          )}
          
          {active === "recipegeneration" && (
            isLoadingRecipe ? (
              <p className="text-center text-lg py-10">Loading Recipe…</p>
            ) : recipe ? (
              <div className="w-full max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden mt-6">
                <div className="bg-gradient-to-r from-blue-500 to-blue-700 p-6 text-white">
                  <h1 className="text-3xl font-bold">{recipe.title}</h1>
                  <p className="mt-2 text-sm">
                    Prep: <span className="font-medium">{recipe.prepTime || 'N/A'}</span> · 
                    Cook: <span className="font-medium">{recipe.cookTime || 'N/A'}</span> · 
                    Servings: <span className="font-medium">{recipe.servings || 'N/A'}</span>
                  </p>
                </div>

                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h2 className="text-2xl font-semibold mb-3">Ingredients</h2>
                    <ul className="list-disc list-inside space-y-1 text-gray-700">
                      {recipe.ingredients?.length
                        ? recipe.ingredients.map((ing,i) => <li key={i}>{ing}</li>)
                        : <li>No ingredients listed.</li>}
                    </ul>
                  </div>

                  <div>
                    <h2 className="text-2xl font-semibold mb-3">Instructions</h2>
                    <ol className="list-decimal list-inside space-y-2 text-gray-700">
                      {recipe.instructions?.length
                        ? recipe.instructions.map((step,i) => <li key={i}>{step}</li>)
                        : <li>No instructions provided.</li>}
                    </ol>
                  </div>
                </div>

                {recipe.suggestions?.length > 0 && (
                  <div className="px-6 pb-6">
                    <h2 className="text-2xl font-semibold mb-3">Serving Suggestions</h2>
                    <ul className="list-disc list-inside space-y-1 text-gray-700">
                      {recipe.suggestions.map((sug,i) => <li key={i}>{sug}</li>)}
                    </ul>
                  </div>
                )}

                <div className="px-6 pb-6 flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    onClick={() => setActive("recipeinfo")}
                    className="flex-1 py-3 bg-blue-200 text-blue-700 rounded-md hover:bg-blue-300 transition font-medium"
                  >
                    ← Back
                  </button>
                  <button
                    onClick={handleGenReset}
                    className="flex-1 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition font-medium"
                  >
                    Try Something Else
                  </button>
                </div>
              </div>
            ) : (
              <div className="w-full max-w-md mx-auto text-center mt-10">
                <p className="text-lg text-red-600 mb-4">Failed to generate recipe. Please try again.</p>
                <p className="text-sm text-gray-700 mb-6">{error}</p>
                <button
                  onClick={handleGenReset}
                  className="py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                >
                  Get Different Recipe
                </button>
              </div>
            )
          )}



          </div>
        </div>
        </>
    );
}
