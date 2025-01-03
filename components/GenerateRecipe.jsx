"use client"
import { useState } from "react";
import { useSession } from "next-auth/react";
import CircleSelect from "./CircleSelect";
import OblongSelect from "./OblongSelect";
import { MdOutlineBreakfastDining, MdOutlineDinnerDining, MdOutlineLunchDining  } from "react-icons/md";
import { LuDessert } from "react-icons/lu";
import { GiChipsBag } from "react-icons/gi";
import { RiNumber1, RiNumber2, RiNumber3 } from "react-icons/ri";
import { FaCheck, FaX } from "react-icons/fa6";

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
                if(response.ok && isValidRecipe(parsedRecipe)) { // Parse JSON only if response is ok
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
        <div className="w-full h-screen flex flex-col items-center font-quicksand text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold bg-gradient-to-r from-blue-200 via-blue-500 to-blue-800 bg-clip-text text-transparent my-4 sm:my-6 lg:my-8">
            AI Recipe Generator
          </h1>
          <div className="flex flex-wrap gap-4 justify-center py-4">
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


          <div className = "border-2 border-gray-300 p-6 max-w-[1000px]">
          {active == "recipeinfo" && 
            <div className="flex flex-col items-center justify-center px-4">
              <form className="text-center w-full max-w-lg"> 
                <h5 className="text-base mb-2 text-wrap">What type of meal are you looking for?</h5>
                <div className="w-full">
                  <CircleSelect
                    options={[
                      { value: "breakfast", icon: MdOutlineBreakfastDining, label: "Breakfast" },
                      { value: "lunch", icon: MdOutlineLunchDining, label: "Lunch" },
                      { value: "dinner", icon: MdOutlineDinnerDining, label: "Dinner" },
                      { value: "dessert", icon: LuDessert, label: "Dessert" },
                      { value: "snack", icon: GiChipsBag, label: "Snack" },
                    ]}
                    onChange={(value) => setMealInput(value)}
                    prevSelected={mealInput !== "" ? mealInput : null}
                  />
                </div>
                
                <h5 className="text-base mb-2 mt-4 text-wrap">What cuisine are you in the mood for?</h5>
                <div className="w-full">
                  <OblongSelect
                    options={["Any", "American", "Mexican", "Italian", "French", "Chinese", "Indian"]}
                    onChange={(value) => setCuisineInput(value)}
                    prevSelected={cuisineInput !== "" ? cuisineInput : null}
                  />
                </div>

                <h5 className="text-base mb-2 mt-4 text-wrap">What is your cooking skill level?</h5>
                <div className="w-full">
                  <CircleSelect
                    options={[
                      { value: "beginner", icon: RiNumber1, label: "Beginner" },
                      { value: "intermediate", icon: RiNumber2, label: "Intermediate" },
                      { value: "expert", icon: RiNumber3, label: "Expert" }
                    ]}
                    onChange={(value) => setLevelInput(value)}
                    prevSelected={levelInput !== "" ? levelInput : null}
                  />
                </div>

                <h5 className="text-base mb-2 mt-4 text-wrap">Do you have any dietary preferences or restrictions?</h5>
                <div className="w-full">
                  <OblongSelect
                    options={["None", "Vegan", "Vegetarian", "Low Carb", "High Protein"]}
                    onChange={(value) => setDietaryInput(value)}
                    prevSelected={dietaryInput !== "" ? dietaryInput : null}
                  />
                </div>

                <h5 className="text-base mb-2 mt-4 text-wrap">Do you need the recipe to be ready in under 30 minutes?</h5>
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

              <button className="self-center p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 mt-4" onClick={() => setActive("addingredients")}>
                Continue
              </button>
            </div>
          }


          {active == "addingredients" && 
            <div className="flex flex-col items-center px-2 sm:px-4 sm:min-w-[700px]">
              <button className="self-center p-2 w-fit bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4" onClick={fetchIngredients}>
                Get Ingredients From Pantry
              </button>
              <form onSubmit={handleAdd} className="space-y-4 max-w-xs sm:max-w-lg w-full">
                {/* Ingredient Input */}
                <div className="flex flex-col gap-1">
                  <label htmlFor="ingredientInput" className="font-semibold text-gray-700 text-sm sm:text-base">
                    Ingredient
                  </label>
                  <input
                    id="ingredientInput"
                    type="text"
                    placeholder="Enter an ingredient"
                    value={ingredientInput}
                    onChange={(e) => setIngredientInput(e.target.value)}
                    className="p-2 text-sm sm:text-base rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Quantity Input */}
                <div className="flex flex-col gap-1">
                  <label htmlFor="quantityInput" className="font-semibold text-gray-700 text-sm sm:text-base">
                    Quantity
                  </label>
                  <input
                    min="0"
                    id="quantityInput"
                    type="number"
                    placeholder="Enter a quantity"
                    value={quantityInput}
                    onChange={(e) => setQuantityInput(e.target.value)}
                    className="p-2 text-sm sm:text-base rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Unit Selection */}
                <div className="flex flex-col gap-1">
                  <label htmlFor="unitsInput" className="font-semibold text-gray-700 text-sm sm:text-base">
                    Unit
                  </label>
                  <select
                    id="unitsInput"
                    value={unitsInput}
                    onChange={(e) => setUnitsInput(e.target.value)}
                    className="p-2 text-sm sm:text-base rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
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

                {/* Add Ingredient Button */}
                <button
                  type="submit"
                  className="w-full p-2 text-sm sm:text-base bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Add Ingredient
                </button>
              </form>

              <div className="flex flex-wrap gap-4 justify-center py-4 w-full">
                {ingredients.length > 0 ? (
                  ingredients.map((ingredient, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-white border border-blue-300 rounded-lg shadow-sm max-w-xs w-full text-sm sm:text-base">
                      <div>
                        <h3 className="text-blue-600 font-semibold">{ingredient.ingredientName}</h3>
                        {ingredient.quantity != 0 && <p className="text-sm text-gray-600">Quantity: {ingredient.quantity}</p>}
                        {ingredient.expDate && <p className="text-sm text-gray-600">Expires: {ingredient.expDate}</p>}
                      </div>
                      <button
                        onClick={() => handleDeleteIngredient(ingredient)}
                        className="ml-4 p-2 text-xs sm:text-sm bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200 transition"
                      >
                        Remove
                      </button>
                    </div>
                  ))
                ) : (
                  isLoadingPantry ? <p className="text-sm sm:text-base">Loading Pantry...</p> : <p className="text-sm sm:text-base">No ingredients added yet.</p>
                )}
              </div>

              {/* Buttons - Back, Submit */}
              <div className="flex flex-col sm:flex-row w-full justify-between sm:justify-center gap-4 items-center">
                <button className="p-2 w-1/2 sm:w-fit text-sm sm:text-base bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500" onClick={() => setActive("recipeinfo")}>
                  Back
                </button>
                <button className="p-2 w-1/2 sm:w-fit text-sm sm:text-base bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500" onClick={handleGenerate}>
                  Submit
                </button>
              </div>
            </div>
          }
          
            {active === "recipegeneration" ? (
              isLoadingRecipe ? (
                <p>Loading Recipe...</p> // Show a loading spinner or message
              ) : recipe ? (
                <div style={{ padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '8px', margin: '20px' }}>
                      <h1>{recipe.title || 'Recipe Title'}</h1>
                      <p><strong>Ingredients:</strong></p>
                      <ul>
                          {recipe.ingredients && recipe.ingredients.length > 0 ?
                              recipe.ingredients.map((ingredient, index) => (
                                  <li key={index}>{ingredient}</li>
                              )) : <li>No ingredients listed.</li>
                          }
                      </ul>
                      <p><strong>Preparation Time:</strong> {recipe.prepTime || 'N/A'}</p>
                      <p><strong>Cooking Time:</strong> {recipe.cookTime || 'N/A'}</p>
                      <p><strong>Servings:</strong> {recipe.servings || 'N/A'}</p>
                      <p><strong>Instructions:</strong></p>
                      <ol>
                          {recipe.instructions && recipe.instructions.length > 0 ?
                              recipe.instructions.map((instruction, index) => (
                                  <li key={index}>{instruction}</li>
                              )) : <li>No instructions provided.</li>
                          }
                      </ol>
                      <p><strong>Serving Suggestions:</strong></p>
                      <ul>
                          {recipe.suggestions && recipe.suggestions.length > 0 ?
                              recipe.suggestions.map((suggestion, index) => (
                                  <li key={index}>{suggestion}</li>
                              )) : <li>No serving suggestions.</li>
                          }
                      </ul>
                      <div className="flex flex-col sm:flex-row w-full justify-between sm:justify-center gap-4 items-center mt-4">
                  <button
                    onClick={() => setActive("recipeinfo")}
                    className="p-2 w-1/2 sm:w-fit text-xs sm:text-sm md:text-base bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => handleGenReset()}
                    className="p-2 w-1/2 sm:w-fit text-xs sm:text-sm md:text-base bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    Try A Different Recipe
                  </button>
                </div>
                  </div>// Show the recipe if it's not null
              ) : (
                <div> 
                  <p className = "text-lg mb-2">Failed to generate recipe. Please try again.</p>
                  <p className = "text-lg mb-2">{error}</p>
                  <button className = "p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" onClick = {() => handleGenReset()}>Get Different Recipe</button>
                </div>
              )
            ) : (
              <div></div>
            )
            }

          </div>
        </div>
    );
}
