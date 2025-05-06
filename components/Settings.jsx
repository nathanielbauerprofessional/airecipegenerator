"use client"

import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";

export default function SettingsComponent() {
    const [allergies, setAllergies] = useState([]);
    const [allergyInput, setAllergyInput] = useState('');
    const [allergiesLoaded, setAllergiesLoaded] = useState(false);
    const [isLoadingAllergies, setIsLoadingAllergies] = useState(false);
    const [isAddingAllergy, setIsAddingAllergy] = useState(false);

    const { data: session } = useSession();

    useEffect(() => {
        const fetchData = async () => {
            if (!allergiesLoaded && session?.user?.email) {
                await fetchAllergies();
                setAllergiesLoaded(true);
            }
        };
    
        if (session !== undefined) fetchData(); 
    }, [allergiesLoaded, session]);

    const fetchAllergies = async () => {
        setIsLoadingAllergies(true);
        try {
            const response = await fetch(`/api/getAllergies`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: session?.user?.email }),  // Use the session email
            });
            console.log("email", session?.user?.email);
            const responseJson = await response.json();
            console.log(responseJson);
            setAllergies(responseJson.allergies);
        } catch (error) {
            console.log("Error Fetching Allergies: ", error);
        } finally {
            setIsLoadingAllergies(false);
        }
    }

    const handleAddAllergy = async (event) => {
        setIsAddingAllergy(true);
        event.preventDefault();
        if (allergyInput.trim() === "") {
            return;
        } else {
            const response = await fetch(`/api/addAllergy`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ allergy: allergyInput, email: session?.user?.email }), // Include session email
            });
            setAllergies([...allergies, allergyInput]);
            setAllergyInput('');
        }
        setIsAddingAllergy(false);
    }

    const handleDeleteAllergy = async (allergenToDelete) => {
        try {
            setAllergies(allergies.filter(allergy => allergy !== allergenToDelete));
            const response = await fetch(`/api/deleteAllergy`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: session?.user?.email, allergy: allergenToDelete }),
            });

            if (!response.ok) {
                console.log("Failed to delete allergen");
            }
        } catch (error) {
            console.log("Error Deleting Allergen: ", error);
        }
    }

    const currentDate = new Date().toLocaleDateString();

    return (
        <div className="w-full max-w-4xl mx-auto px-4 py-8 font-quicksand">
          <h1
            className="text-6xl leading-tight font-poppins font-semibold
                       bg-gradient-to-r from-blue-200 via-blue-500 to-blue-800
                       bg-clip-text text-transparent text-center mb-8"
          >
            Settings
          </h1>
    
          <div className="bg-white shadow-md rounded-lg p-6 mb-10">
            <form onSubmit={handleAddAllergy} className="space-y-4">
              <div className="flex flex-col">
                <label htmlFor="allergyInput" className="font-semibold text-gray-700 mb-1">
                  Allergy
                </label>
                <input
                  id="allergyInput"
                  type="text"
                  placeholder="Enter an allergy"
                  value={allergyInput}
                  onChange={e => setAllergyInput(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 bg-blue-600 text-white font-medium rounded-md
                           hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500
                           transition"
              >
                Add Allergy
              </button>
            </form>
          </div>
    
          <div className="mb-10">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Your Allergies</h2>
            {isLoadingAllergies ? (
              <p className="text-center text-gray-600">Loading Settings…</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {allergies.length > 0 ? (
                  allergies.map((allergy, idx) => (
                    <div
                      key={idx}
                      className="bg-white border border-blue-300 rounded-lg shadow-sm p-4
                                 flex justify-between items-center"
                    >
                      <span className="text-lg text-blue-600 font-semibold">
                        {allergy}
                      </span>
                      <button
                        onClick={() => handleDeleteAllergy(allergy)}
                        className="py-1 px-3 bg-blue-100 text-blue-600 rounded-full
                                   hover:bg-blue-200 transition text-sm"
                      >
                        Remove
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-600 col-span-full">
                    No allergies added yet.
                  </p>
                )}
              </div>
            )}
          </div>
    
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">User Info</h2>
            <p className="text-gray-700">Email: {session?.user?.email || "Not logged in"}</p>
            <p className="text-gray-700">Date: {currentDate}</p>
            <button
              onClick={() => signOut()}
              className="mt-6 w-full py-3 bg-red-700 text-white font-medium rounded-md
                         hover:bg-red-400
                         transition"
            >
              Sign Out
            </button>
          </div>
        </div>
      );
    }
