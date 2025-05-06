"use client"

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

export default function PantryComponent() {
  const [ingredients, setIngredients] = useState([]);
  const [ingredientInput, setIngredientInput] = useState("");
  const [expirationDateInput, setExpirationDateInput] = useState("");
  const [quantityInput, setQuantityInput] = useState("");
  const [unitsInput, setUnitsInput] = useState("");
  const [ingredientsLoaded, setIngredientsLoaded] = useState(false);
  const [isLoadingPantry, setIsLoadingPantry] = useState(false);
  const [isAddingPantry, setIsAddingPantry] = useState(false);
  const { data: session } = useSession();

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
    try {
      const response = await fetch(`/api/getIngredients`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: session?.user?.email }),
      });
      const responseJson = await response.json();
      setIngredients(responseJson.ingredients);
    } catch (error) {
      console.error("Error Fetching Ingredients:", error);
    } finally {
      setIsLoadingPantry(false);
    }
  };

  const handleAddToPantry = async (event) => {
    setIsAddingPantry(true);
    event.preventDefault();
    document.forms[0].reset();
    if (ingredientInput.trim() === "") {
      setIsAddingPantry(false);
      return;
    }
    const ingredient = {
      ingredientName: ingredientInput,
      expDate: expirationDateInput,
      quantity: quantityInput || 0,
      units: unitsInput,
    };
    try {
      await fetch(`/api/addIngredient`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: session?.user?.email, ingredient }),
      });
      setIngredients([...ingredients, ingredient]);
    } catch (error) {
      console.error("Error Adding Ingredient:", error);
    } finally {
      setIsAddingPantry(false);
    }
  };

  const handleDeleteIngredient = async (ingredientToBeDeleted) => {
    setIngredients(ingredients.filter(i => i.ingredientName !== ingredientToBeDeleted.ingredientName));
    try {
      await fetch(`/api/deleteIngredient`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: session?.user?.email, ingredient: ingredientToBeDeleted }),
      });
    } catch (error) {
      console.error("Error Deleting Ingredient:", error);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-12 font-quicksand">

      <h1
            className="text-6xl leading-tight font-poppins font-semibold
                       bg-gradient-to-r from-blue-200 via-blue-500 to-blue-800
                       bg-clip-text text-transparent text-center mb-8"
          >
            Pantry
          </h1>

      <div className="bg-white shadow-md rounded-lg p-6 mb-10">
        <form
          onSubmit={handleAddToPantry}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <div className="flex flex-col">
            <label htmlFor="ingredientInput" className="font-semibold text-gray-700 mb-1">
              Ingredient
            </label>
            <input
              id="ingredientInput"
              type="text"
              placeholder="Enter an ingredient"
              value={ingredientInput}
              onChange={e => setIngredientInput(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="quantityInput" className="font-semibold text-gray-700 mb-1">
              Quantity
            </label>
            <input
              id="quantityInput"
              type="number"
              min="0"
              placeholder="0"
              value={quantityInput}
              onChange={e => setQuantityInput(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="unitsInput" className="font-semibold text-gray-700 mb-1">
              Unit
            </label>
            <select
              id="unitsInput"
              value={unitsInput}
              onChange={e => setUnitsInput(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Unit</option>
              <option value="teaspoons">Teaspoons</option>
              <option value="tablespoons">Tablespoons</option>
              <option value="cups">Cups</option>
              <option value="pints">Pints</option>
              <option value="quarts">Quarts</option>
              <option value="gallons">Gallons</option>
              <option value="ounces">Ounces</option>
            </select>
          </div>

          <div className="flex flex-col">
            <label htmlFor="expirationInput" className="font-semibold text-gray-700 mb-1">
              Expiration Date
            </label>
            <input
              id="expirationInput"
              type="date"
              value={expirationDateInput}
              onChange={e => setExpirationDateInput(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={isAddingPantry}
              className="w-full py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 transition"
            >
              {isAddingPantry ? "Adding…" : "Add Ingredient"}
            </button>
          </div>
        </form>
      </div>

      {isLoadingPantry ? (
        <p className="text-center text-gray-600">Loading Pantry…</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {ingredients.length > 0 ? (
            ingredients.map((ingredient, idx) => (
              <div
                key={idx}
                className="bg-white border border-blue-300 rounded-lg shadow-sm p-4 flex flex-col justify-between"
              >
                <div>
                  <h3 className="text-xl text-blue-600 font-semibold mb-2">
                    {ingredient.ingredientName}
                  </h3>
                  <p className="text-gray-700">
                    Quantity: {ingredient.quantity}{" "}
                    {ingredient.units && ingredient.units !== "default" ? ingredient.units : ""}
                  </p>
                  {ingredient.expDate && (
                    <p className="text-gray-700">Expires: {ingredient.expDate}</p>
                  )}
                </div>
                <button
                  onClick={() => handleDeleteIngredient(ingredient)}
                  className="self-end mt-4 py-1 px-3 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200 transition text-sm"
                >
                  Remove
                </button>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-600 col-span-full">
              No ingredients added yet.
            </p>
          )}
        </div>
      )}
    </div>
  );
}