"use client";

import '@fontsource/poppins';
import '@fontsource/quicksand';
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterForm() {


  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const router = useRouter();

  const validateInput = (e) => {
    const { name, value } = e.target;

    if (name === "email") {
      const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
      if (!emailPattern.test(value)) {
        setError("Please enter a valid email address.");
        return false;
      }
    }
    
    if (name === "password") {
        if (!/^(?=.*\d)[a-zA-Z\d]{8,16}$/.test(value)) {
            setError("Password must be 8-16 characters long and include at least one number.");
            return false;
        }
    }

    setError("");
    return true;
};

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !email || !password) {
      setError("All fields are necessary.");
      return;
    }
    if (validateInput({target: {name: "password", value: password}}) && validateInput({target: {name: "email", value: email}})) {
      try {
        const resUserExists = await fetch("api/userExists", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        });

        const { user } = await resUserExists.json();

        if (user) {
          setError("User already exists.");
          return;
        }

        const allergies = [];
        const ingredients = [];

        const res = await fetch("api/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            email,
            password,
            allergies,
            ingredients
          }),
        });

        if (res.ok) {
          const form = e.target;
          form.reset();
          router.push("/");
        } else {
          console.log("User registration failed.");
        }
      } catch (error) {
        console.log("Error during registration: ", error);
      }
    }
  };

    return (
        <div className = "w-full h-screen bg-white flex justify-center items-center">
            <div className = "flex flex-col bg-white shadow-xl rounded-lg border-t-4 border-blue-600 p-12 gap-6">
                <p className = "font-poppins text-2xl font-bold">
                    Enter Info
                </p>
                <hr className = "h-[2px] text-blue-500 bg-blue-500 w-8"/>
                <form className = "flex flex-col font-quicksand gap-6" onSubmit = {handleSubmit}>
                    <input onChange = {(e) => setName(e.target.value)} name = "name" type = "text" placeholder = "Name" className = "focus:outline-none focus:border-blue-600 w-[325px] border-2 border-gray-100 bg-gray-100 py-2 px-4"/>
                    <input onChange = {(e) => setEmail(e.target.value)} name = "email" type = "text" placeholder = "Email" className = "focus:outline-none focus:border-blue-600 w-[325px] border-2 border-gray-100 bg-gray-100 py-2 px-4" onBlur={validateInput}/>
                    <input onChange = {(e) => setPassword(e.target.value)} name = "password" type = "password" placeholder = "Password" className = "focus:outline-none focus:border-blue-600 w-[325px] border-2 border-gray-100 bg-gray-100 py-2 px-4" onBlur={validateInput}/>
                    <input type = "submit" value = "Register" className = "py-2 px-4 bg-blue-600 text-white"/>
                </form>

                {
                error && 
                <div className = "font-quicksand bg-red-600 text-white py-1 px-2 rounded-lg max-w-[325px] break-words">
                    <p>{error}</p>
                </div>
                }
                <div className = "self-end font-quicksand text-md text-black">
                    <p>Already have an account? <a href = "./" className = "underline">Login Here</a></p>
                </div>
            </div>
        </div>
    )
}
