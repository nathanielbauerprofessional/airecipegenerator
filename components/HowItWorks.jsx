"use client"

import { RiFridgeLine } from "react-icons/ri";
import {FaLeaf, FaRegClock, FaStar, FaQuestionCircle, FaFilter  } from "react-icons/fa";
import { FaUserGear } from "react-icons/fa6";
import { MdOutlineDinnerDining } from "react-icons/md";
import Link from "next/link";

export default function HowItWorksComponent() {
  return (
    <div className="font-quicksand text-gray-800">

      {/* HOW IT WORKS */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h2 className="text-6xl leading-tight font-poppins font-semibold
                       bg-gradient-to-r from-blue-200 via-blue-500 to-blue-800
                       bg-clip-text text-transparent text-center mb-8"
          >
            How It Works
          </h2>
          <p className="text-gray-600 mb-12">
            Three simple steps to transform your pantry into AI‑crafted meals.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[{
              icon: FaUserGear,
              title: "Customize Profile",
              desc: "Set dietary preferences, allergies & favorite cuisines for perfectly tailored recipes."
            },{
              icon: RiFridgeLine,
              title: "Build Your Pantry",
              desc: "Add what you have and our AI will prioritize recipes using your existing ingredients."
            },{
              icon: MdOutlineDinnerDining,
              title: "Generate & Cook",
              desc: "Get step‑by‑step recipes with cooking times, servings & ingredient lists in seconds."
            }].map((step, i) => (
              <div key={i} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
                <div className="flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mx-auto mb-4">
                  <step.icon className="text-blue-600 w-8 h-8" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-sm">{step.desc}</p>
                {/* optional screenshot */}
                {/* <img src={`/screenshots/step${i+1}.png`} alt={`${step.title}`} className="mt-4 rounded-lg" /> */}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* KEY FEATURES */}
      <section className="py-16">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-3xl font-poppins font-semibold text-center mb-8">Key Features</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[              {
                icon: FaLeaf,
                title: "Diet & Allergy Safe",
                desc: "Automatically avoids ingredients you’re allergic to or don’t eat."
              },
              {
                icon: RiFridgeLine,
                title: "Pantry Integration",
                desc: "Recipes that make use of what you already have on hand."
              },
              {
                icon: FaRegClock,
                title: "Quick Meals",
                desc: "Filter for recipes ready in 30 minutes or less."
              },
              {
                icon: FaFilter,
                title: "Custom Filters",
                desc: "Narrow by meal type, cuisine, and cooking skill level."
              }].map((feat, i) => (
              <div key={i} className="bg-gray-50 p-6 rounded-lg text-center">
                <feat.icon className="text-blue-500 w-10 h-10 mx-auto mb-3" />
                <h3 className="font-semibold mb-1">{feat.title}</h3>
                <p className="text-sm text-gray-600">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gray-50 py-16">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-poppins font-semibold mb-8">What Our Users Are Saying</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: "Elizabeth T.", quote: "I saved so much time and money—my fridge has never been so organized!" },
              { name: "Matthew B.", quote: "Delicious meals generated in seconds. Perfect for busy weeknights." },
              { name: "Kristen C.", quote: "I love how it adapts to my vegan diet. So many new recipes!" }
            ].map((test, i) => (
              <div key={i} className="bg-white p-6 rounded-lg shadow-md">
                <FaStar className="text-yellow-400 w-6 h-6 mb-2" />
                <p className="italic text-gray-700 mb-4">“{test.quote}”</p>
                <p className="font-semibold text-blue-600">— {test.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-3xl font-poppins font-semibold text-center mb-8">Frequently Asked Questions</h2>
          {[
            { q: "Can I use this on mobile?", a: "Absolutely – our responsive design works on any device." },
            { q: "Can I edit my pantry later?", a: "Yes! Update your pantry anytime to get fresh recipe ideas." },
            { q: "How accurate are the cook times?", a: "The AI estimates based on similar recipes. Always double‑check as you cook." }
          ].map((item, i) => (
            <div key={i} className="mb-6">
              <h3 className="flex items-center text-lg font-semibold">
                <FaQuestionCircle className="mr-2 text-blue-500"/> {item.q}
              </h3>
              <p className="ml-8 text-gray-700">{item.a}</p>
              <hr className="mt-4"/>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-blue-600 py-16">
        <div className="max-w-4xl mx-auto px-6 text-center text-white">
          <h2 className="text-3xl font-poppins font-semibold mb-4">
            Ready to Get Cooking?
          </h2>
          <p className="mb-8">
            Jump in now and let AI turn your pantry into delicious meals.
          </p>
          <Link
            href="/dashboard"
            className="inline-block px-8 py-3 bg-white text-blue-600 font-medium rounded-md hover:bg-gray-100 transition"
          >
            Start Generating Recipes →
          </Link>
        </div>
      </section>
    </div>
  );
}
