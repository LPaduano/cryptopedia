"use client";

import { useState } from "react";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="glass fixed top-0 left-0 w-full p-4 flex items-center justify-between text-black z-10">
      {/* Logo */}
      <div className="flex items-center space-x-4">
        <a href="#" className="font-bold text-xl">
          Logo
        </a>

        {/* Menu Desktop */}
        <ul className="hidden lg:flex space-x-6">
          <li>
            <a href="/" className="hover:text-gray-700">
              Home
            </a>
          </li>
          <li>
            <a href="/ai-predict" className="hover:text-gray-700">
              Predizione
            </a>
          </li>
          <li>
            <a href="#" className="hover:text-gray-700">
              Chi siamo
            </a>
          </li>
          <li>
            <a href="#" className="hover:text-gray-700">
              Contatti
            </a>
          </li>
        </ul>
      </div>

      {/* Mobile Menu Button */}
      <button
        className="lg:hidden text-black focus:outline-none"
        onClick={toggleMenu}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 6h16M4 12h16M4 18h16"
          ></path>
        </svg>
      </button>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-16 left-0 w-full bg-white bg-opacity-50 p-4 rounded-lg h-[100vh] z-30">
          <ul className="flex flex-col items-center space-y-4">
            <li>
              <a href="/" className="text-black hover:text-gray-700">
                Home
              </a>
            </li>
            <li>
              <a href="#" className="text-black hover:text-gray-700">
                Servizi
              </a>
            </li>
            <li>
              <a href="#" className="text-black hover:text-gray-700">
                Chi siamo
              </a>
            </li>
            <li>
              <a href="#" className="text-black hover:text-gray-700">
                Contatti
              </a>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
