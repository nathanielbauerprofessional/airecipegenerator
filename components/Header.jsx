"use client"

import { PiChefHat } from "react-icons/pi";
import { useState } from "react";
import Link from "next/link";
import '@fontsource/poppins';
import '@fontsource/quicksand';

export default function Header() {

    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
      setIsMenuOpen((prev) => !prev);
    };

    return (
    <header className="bg-white shadow-sm font-poppins w-full">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center">
          {/* Logo and Site Title */}
          <a href = "/"><div className="flex items-center space-x-2">
            <PiChefHat className="w-8 h-8 text-blue-600" />
            <span className="text-2xl font-medium text-gray-800 font-poppins">
              AI Recipe Generator
            </span>
          </div></a>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="block md:hidden text-gray-700 focus:outline-none"
            aria-label="Toggle Menu"
          >
            <svg
              className="h-6 w-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:block font-poppins font-medium text-xl">
            <ul className="flex space-x-6">
              <li>
                <Link
                  href="/"
                  className="text-gray-700 hover:text-gray-900 transition-colors duration-200"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/howitworks"
                  className="text-gray-700 hover:text-gray-900 transition-colors duration-200"
                >
                  How It Works
                </Link>
              </li>
              <li>
                <Link
                  href="/pantry"
                  className="text-gray-700 hover:text-gray-900 transition-colors duration-200"
                >
                  Pantry
                </Link>
              </li>
              <li>
                <Link
                  href="/settings"
                  className="text-gray-700 hover:text-gray-900 transition-colors duration-200"
                >
                  Settings
                </Link>
              </li>
            </ul>
          </nav>
        </div>

        {/* Collapsible Mobile Navigation */}
        {isMenuOpen && (
          <nav className="mt-4 md:hidden">
            <ul className="flex flex-col space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-gray-700 hover:text-gray-900 transition-colors duration-200"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/howitworks"
                  className="text-gray-700 hover:text-gray-900 transition-colors duration-200"
                >
                  How It Works
                </Link>
              </li>
              <li>
                <Link
                  href="/pantry"
                  className="text-gray-700 hover:text-gray-900 transition-colors duration-200"
                >
                  Pantry
                </Link>
              </li>
              <li>
                <Link
                  href="/settings"
                  className="text-gray-700 hover:text-gray-900 transition-colors duration-200"
                >
                  Settings
                </Link>
              </li>
            </ul>
          </nav>
        )}
      </div>
    </header>
    );
  }
  