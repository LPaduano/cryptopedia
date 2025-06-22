"use client";
import { useState } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import Image from "next/image";
import GoogleIcon from "./GoogleIcon";
import AppleIcon from "./AppleIcon";
import Link from "next/link";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [modalType, setModalType] = useState<null | "login" | "register">(null);
  const { data: session, status } = useSession();

  const toggleMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeModal = () => {
    setModalType(null);
  };

  return (
    <>
      <div className="border-b-2 border-gray-100 glass fixed top-0 left-0 w-full p-4 flex items-center justify-between text-black z-30 flex-col sm:flex-row">
        {/* Logo e menu */}
        <div className="ml-26 flex items-center space-x-4">
          <Link href="/" className="font-bold text-xl">
            CryptoPedia
          </Link>

          <ul className="hidden lg:flex space-x-6">
            <li></li>
            <li>
              <Link href="/ai-predict" className="hover:text-gray-700">
                Predizione
              </Link>
            </li>
            <li>News</li>
            <li>Impara</li>
          </ul>

          {/* Pulsanti login/register */}
          <div className="absolute right-2 hidden items-center justify-end gap-6 w-60 mr-24 sm:flex">
            {status === "loading" ? (
              <p>Loading...</p>
            ) : session?.user ? (
              <>
                <Image
                  src={session.user.image || "/default-avatar.png"}
                  alt="User avatar"
                  width={32}
                  height={32}
                  className="rounded-full"
                />
                <button onClick={() => signOut()}>Logout</button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setModalType("login")}
                  className="w-20 px-1 py-0.5 cursor-pointer hover:opacity-70 bg-black text-white rounded-sm"
                >
                  Accedi
                </button>
                <button
                  onClick={() => setModalType("register")}
                  className="w-20 px-1 py-0.5 cursor-pointer hover:opacity-70 bg-white text-black rounded-sm border-black border"
                >
                  Registrati
                </button>
              </>
            )}
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="absolute left-2 lg:hidden text-black focus:outline-none z-40"
          onClick={toggleMenu}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
            />
          </svg>
        </button>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden relative w-[100vw] h-[100vh] z-50">
            <div className="absolute top-0 left-0 w-full bg-white bg-opacity-90 p-4 rounded-lg h-[100vh] z-50">
              <ul className="flex flex-col items-center space-y-4 mt-8">
                <li>
                  <Link href="/" className="text-black hover:text-gray-700">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="/" className="text-black hover:text-gray-700">
                    predizioni
                  </Link>
                </li>
                <li>
                  {/* <a href="#" className="text-black hover:text-gray-700">
                    Chi siamo
                  </a> */}
                </li>
                <li>
                  {/* <a href="#" className="text-black hover:text-gray-700">
                    Contatti
                  </a> */}
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* Modal + overlay */}
      {modalType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Overlay separato */}
          <div className="absolute inset-0 bg-black opacity-30"></div>

          {/* Modale */}
          <div className="relative bg-white p-6 rounded-md w-120 max-w-full shadow-lg z-10">
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 text-gray-600 hover:text-black hover:cursor-pointer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                className="size-6"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                />
              </svg>
            </button>
            <h2 className="text-xl font-bold mb-4">
              {modalType === "login" ? "Accedi" : "Registrati"}
            </h2>

            {/* Pulsanti social login */}
            <div className="space-y-3">
              <button
                onClick={() => signIn("google")}
                className="w-full flex items-center justify-center border border-gray-300 rounded p-2 hover:bg-gray-100 hover:cursor-pointer"
              >
                <GoogleIcon />
                <p className="ml-4">Continua con Google</p>
              </button>

              <button
                onClick={() => alert("Apple non è ancora configurato")}
                className="w-full flex items-center justify-center border border-gray-300 rounded p-2 hover:bg-gray-100 hover:cursor-pointer"
              >
                <AppleIcon />
                <p className="ml-4 ">Continua con Apple</p>
              </button>
            </div>
            <div className="w-full h-[1px] bg-gray-400 mt-7"></div>
            <div className="flex flex-col items-center justify-center gap-4 mt-6">
              <p className="w-full text-left">Registrati con email</p>
              <input
                type="text"
                className="border-[1px] border-gray-300 h-[40px] rounded w-full p-4"
                placeholder="Email"
              />
              <input
                type="text"
                className="border-[1px] border-gray-300 h-[40px] rounded w-full p-4"
                placeholder="Password"
              />
              <button
                onClick={() => alert("Registrazione non ancora configurata")}
                className="w-full bg-black text-white rounded p-2 hover:opacity-70 hover:cursor-pointer"
              >
                Registrati
              </button>
            </div>
            <p className="text-xs mt-6 text-gray-500">
              Continuando, confermi di avere letto e di accettare integralmente{" "}
              <u className="text-black">Termini del servizio</u> e{" "}
              <u className="text-black">Politica sulla privacy</u>.
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
