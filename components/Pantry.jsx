"use client"

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

export default function PantryComponent() {
    const [ingredients, setIngredients] = useState([]);
    const [ingredientInput, setIngredientInput] = useState("");
    const [expirationDateInput, setExpirationDateInput] = useState('');
    const [quantityInput, setQuantityInput] = useState('');
    const [unitsInput, setUnitsInput] = useState('');
    const [ingredientsLoaded, setIngredientsLoaded] = useState(false);
    const [isLoadingPantry, setIsLoadingPantry] = useState(false);
    const [isAddingPantry, setIsAddingPantry] = useState(false);
    const { data: session} = useSession();

    useEffect(() => {
        const fetchData = async () => {
            if (!ingredientsLoaded && session?.user?.email) {
                await fetchIngredients();
                setIngredientsLoaded(true);
            }
        };
    
        if (session !== undefined) fetchData(); 
    }, [ingredientsLoaded, session]);

    const fetchIngredients = async () => {
        setIsLoadingPantry(true);
        console.log(!session);
        try {
            const response = await fetch(`/api/getIngredients`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: session?.user?.email }),
            });
            const responseJson = await response.json();
            console.log(responseJson, "RESPONSE JSON");
            setIngredients(responseJson.ingredients);
        } catch (error) {
            console.log("Error Fetching Ingredients: ", error);
        } finally {
            setIsLoadingPantry(false);
        }
    }

    const handleAddToPantry = async (event) => {
        setIsAddingPantry(true);
        document.forms[0].reset();
        event.preventDefault();
        if (ingredientInput.trim() === "") {
            return;
        } else {
            const ingredient = {ingredientName: ingredientInput, expDate: expirationDateInput ? expirationDateInput : "", quantity: quantityInput ? quantityInput : 0, units: unitsInput ? unitsInput : "" }
            const response = await fetch(`/api/addIngredient`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: session?.user?.email, ingredient: ingredient }),
            });
            console.log(response);
            setIngredients([...ingredients, ingredient])
        }
        setIsAddingPantry(false);
    }

    const handleDeleteIngredient = async (ingredientToBeDeleted) => {
        try {
            setIngredients(ingredients.filter(ingredient => ingredient.ingredientName !== ingredientToBeDeleted.ingredientName));
            const response = await fetch(`/api/deleteIngredient`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: session?.user?.email, ingredient: ingredientToBeDeleted }),
            });

            if (!response.ok) {
                console.log("Failed to delete allergen");
            }
        } catch (error) {
            console.log("Error Deleting Allergen: ", error);
        }
    }


    return (
      <div className="w-full flex flex-col items-center font-quicksand">
      <h1 className="text-6xl font-semibold font-poppins p-10">Pantry</h1>
      <form onSubmit={handleAddToPantry} className="space-y-4 max-w-[800px] w-full font-quicksand px-4 sm:px-6">
        {/* Ingredient Input */}
        <div className="flex flex-col gap-1">
          <label htmlFor="ingredientInput" className="font-semibold text-gray-700">
            Ingredient
          </label>
          <input
            id="ingredientInput"
            type="text"
            placeholder="Enter an ingredient"
            value={ingredientInput}
            onChange={(e) => setIngredientInput(e.target.value)}
            className="p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
    
        {/* Quantity Input */}
        <div className="flex flex-col gap-1">
          <label htmlFor="quantityInput" className="font-semibold text-gray-700">
            Quantity
          </label>
          <input
            min="0"
            id="quantityInput"
            type="number"
            placeholder="Enter a quantity"
            value={quantityInput}
            onChange={(e) => setQuantityInput(e.target.value)}
            className="p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
    
        {/* Unit Selection */}
        <div className="flex flex-col gap-1">
          <label htmlFor="unitsInput" className="font-semibold text-gray-700">
            Unit
          </label>
          <select
            id="unitsInput"
            value={unitsInput}
            onChange={(e) => setUnitsInput(e.target.value)}
            className="p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
    
        {/* Expiration Date Input */}
        <div className="flex flex-col gap-1">
          <label htmlFor="expirationInput" className="font-semibold text-gray-700">
            Expiration Date
          </label>
          <input
            type="date"
            id="expirationInput"
            value={expirationDateInput}
            onChange={(e) => setExpirationDateInput(e.target.value)}
            className="p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
    
        {/* Add Ingredient Button */}
        <button
          type="submit"
          className="w-full p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Add Ingredient
        </button>
      </form>
    
      <div className="flex flex-wrap gap-4 justify-center py-4">
        {ingredients.length > 0 ? (
          ingredients.map((ingredient, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-white border border-blue-300 rounded-lg shadow-sm">
              <div>
                <h3 className="text-blue-600 font-semibold text-lg">{ingredient.ingredientName}</h3>
                {ingredient.quantity != 0 && (
                  <p className="text-sm text-gray-600">Quantity: {ingredient.quantity} {ingredient.units === "default" ? "" : ingredient.units}</p>
                )}
                {ingredient.expDate && <p className="text-sm text-gray-600">Expires: {ingredient.expDate}</p>}
              </div>
              <button
                onClick={() => handleDeleteIngredient(ingredient)}
                className="ml-4 p-2 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200 transition text-xs"
              >
                Remove
              </button>
            </div>
          ))
        ) : (
          isLoadingPantry ? <p>Loading Pantry...</p> : <p>No ingredients added yet.</p>
        )}
      </div>
    </div>
    
    
    );
};