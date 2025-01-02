"use client"
import { RiFridgeLine } from "react-icons/ri";
import { FaUserGear } from "react-icons/fa6";
import { MdOutlineDinnerDining } from "react-icons/md";
import Link from "next/link";

export default function HowItWorksComponent() {
    return (
        <div className = "font-quicksand w-full h-screen text-center flex flex-col gap-8 p-12">
            <h1 className = "text-6xl font-semibold font-poppins p-4">
                How It Works
            </h1>
            <div className = "flex flex-col justify-center"> 
                <div className = "flex flex-row justify-center">
                <div className = "w-1/2 flex justify-end items-center p-12">
                    <div>
                        <FaUserGear className = "text-blue-600 h-48 w-48"/>
                    </div>
                </div>
                <div className = "flex flex-col w-1/2 text-left gap-4">
                    <div className = "self-start rounded-full h-8 w-8 bg-blue-600 text-white font-poppins flex items-center justify-center text-xl">
                        1
                    </div>
                    <h1 className = "font-poppins text-2xl">
                        Personalize Your Preferences
                    </h1>
                    <hr className="w-1/6 border-blue-500 border-t-2 self-start" />
                    <p className = "text-base text-gray-800 max-w-[480px] self-start">
                        Start by setting up your profile on the Settings page. Here, you can input important dietary details like food allergies, dietary restrictions (e.g., vegan, gluten-free, low-carb), and preferred cuisines (e.g., Italian, Mexican, Asian). You can also choose your cooking style, from quick 30-minute meals to more involved recipes. These preferences ensure that the recipes you generate are tailored to your tastes and lifestyle, making every meal both enjoyable and convenient.
                    </p>
                </div>
                </div>   
            </div>
            <div className = "flex flex-col justify-center">
                <div className = "flex flex-row justify-center">
                <div className = "flex flex-col w-1/2 text-right gap-4">
                    <div className = "rounded-full h-8 w-8 bg-blue-600 text-white font-poppins flex items-center justify-center text-xl self-end">
                        2
                    </div>
                    <h1 className = "font-poppins text-2xl">
                        Stock Your Pantry
                    </h1>
                    <hr className="w-1/6 border-blue-500 border-t-2 self-end" />
                    <p className = "text-base text-gray-800 max-w-[480px] self-end">
                    Once your preferences are set, head to the Pantry page to list the ingredients you have at home. By keeping this virtual pantry updated, the AI can prioritize recipes that use your existing ingredients, helping you save money and reduce food waste. Simply add staples like eggs, flour, or spices and update the list as items are used. The pantry feature makes sure that you’re always cooking with what’s readily available, so there’s no need for unnecessary grocery trips.
                    </p>
                </div>
                <div className = "w-1/2 flex justify-start items-center p-12">
                    <div>
                        <RiFridgeLine className = "text-blue-600 h-48 w-48"/>
                    </div>
                </div>
                </div>   
            </div>
            <div className = "flex flex-col justify-center">
                <div className = "flex flex-row justify-center">
                <div className = "w-1/2 flex justify-end items-center p-12">
                    <div>
                        <MdOutlineDinnerDining className = "text-blue-600 h-48 w-48"/>
                    </div>
                </div>
                <div className = "flex flex-col w-1/2 text-left gap-4">
                    <div className = "self-start rounded-full h-8 w-8 bg-blue-600 text-white font-poppins flex items-center justify-center text-xl">
                        3
                    </div>
                    <h1 className = "font-poppins text-2xl">
                        Generate Recipes & Cook!
                    </h1>
                    <hr className="w-1/6 border-blue-500 border-t-2 self-start" />
                    <p className = "text-base text-gray-800 max-w-[480px] self-start">
                    Now comes the exciting part—the Home page. Use the AI-powered recipe generator to create dishes that align with your preferences and pantry inventory. Select options like meal type (breakfast, lunch, dinner) and difficulty level (beginner, intermediate, expert). The app will instantly generate recipes with clear step-by-step instructions, cooking times, and ingredient lists. If you’re missing a minor ingredient, the app will let you know so you can decide whether to substitute it or make a quick trip to the store. With tailored suggestions, you’re ready to cook delicious meals without the guesswork.
                    </p>
                </div>
                </div>   
            </div>
            <div className = "pb-12 pt-8">
                <Link className = "bg-blue-600 text-white p-4 rounded-lg text-3xl" href = "/dashboard">
                    Try Generating Recipes Now!
                </Link>
            </div>
        </div>
    )
};


