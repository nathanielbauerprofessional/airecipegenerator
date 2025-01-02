"use client"

import '@fontsource/poppins';
import '@fontsource/quicksand';
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";


export default function LoginForm() {
    
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await signIn('credentials', {
                email, password, redirect: false,
            });

            if (res?.error){
                setError("Invalid Credentials");
                return;
            }
            if (typeof window !== 'undefined') {
                localStorage.setItem("email", email);
            }
            router.replace("./");
            
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className = "w-full h-screen bg-white flex justify-center items-center">
            <div className = "flex flex-col bg-white shadow-xl rounded-lg border-t-4 border-blue-600 p-12 gap-6">
                <p className = "font-poppins text-2xl font-bold">
                    Enter Login Info
                </p>
                <hr className = "h-[2px] text-blue-500 bg-blue-500 w-8"/>
                <form className = "flex flex-col font-quicksand gap-6" onSubmit = {handleSubmit}>
                    <input onChange = {e => setEmail(e.target.value)} type = "text" placeholder = "Email" className = "w-[325px] border-2 border-gray-100 bg-gray-100 py-2 px-4 focus:outline-none focus:border-blue-600"/>
                    <input onChange = {e => setPassword(e.target.value)} type = "password" placeholder = "Password" className = "w-[325px] border-2 border-gray-100 bg-gray-100 py-2 px-4 focus:outline-none focus:border-blue-600"/>
                    <input type = "submit" value = "Login" className = "py-2 px-4 bg-blue-600 text-white"/>
                </form>
                {
                error && 
                (<div className = "h-fit w-fit bg-red-600 text-white py-1 px-2 rounded-lg font-quicksand">
                    {error}
                </div>)
                }
                <div className = "self-end font-quicksand text-md text-black">
                    <p>Don't have an account? <a href = "./register" className = "underline">Register Here</a></p>
                </div>
            </div>
        </div>
    )
}