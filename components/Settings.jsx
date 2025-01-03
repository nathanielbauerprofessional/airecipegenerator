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
        <div className="w-full flex flex-col items-center font-quicksand">
            <h1 className="text-6xl font-semibold font-poppins p-10">Settings</h1>
            <form onSubmit={handleAddAllergy} className="space-y-4 max-w-[800px] w-full font-quicksand px-4 sm:px-6">
                {/* Ingredient Input */}
                <div className="flex flex-col gap-1">
                <label htmlFor="allergyInput" className="font-semibold text-gray-700 font-quicksand">
                    Allergy
                </label>
                <input
                    id="allergyInput"
                    type="text"
                    placeholder="Enter an allergy"
                    value={allergyInput}
                    onChange={(e) => setAllergyInput(e.target.value)}
                    className="p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                </div>

                {/* Add Ingredient Button */}
                <button
                type="submit"
                className="w-full p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                Add Allergy
                </button>
            </form>

            <div className="flex flex-wrap gap-4 justify-center py-4">
                {allergies.length > 0 ? (
                allergies.map((allergy, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-white border border-blue-300 rounded-lg shadow-sm">
                    <div>
                        <h3 className="text-blue-600 font-semibold text-lg">{allergy}</h3>
                    </div>
                    <button
                        onClick={() => handleDeleteAllergy(allergy)}
                        className="ml-4 p-2 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200 transition text-xs"
                    >
                        Remove
                    </button>
                    </div>
                ))
                ) : (
                isLoadingAllergies ? <p>Loading Settings...</p> : <p>No allergies added yet.</p>
                )}
            </div>

            <div className="w-full flex flex-col items-center mt-10">
                <h2 className="text-lg font-semibold">User Info</h2>
                <p>Email: {session?.user?.email || "Not logged in"}</p>
                <p>Date: {currentDate}</p>
                <button
                className="bg-blue-600 text-white rounded-md py-2 px-4 mt-4 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                onClick={() => signOut()}
                >
                Sign Out
                </button>
            </div>
            </div>

    );
}
