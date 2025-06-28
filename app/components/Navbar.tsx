"use client";
import { useState } from "react";
import { useSession, signIn } from "next-auth/react";
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
      <div className="border-b-2 border-gray-100 glass fixed top-0 left-0 w-full p-4 z-30 bg-white lg:px-26">
        <div className="flex items-center justify-between w-full flex-row-reverse lg:flex-row">
          {/* Logo */}
          <div className="flex items-center justify-center w-full sm:w-auto gap-12">
            <Link
              href="/"
              className="font-bold text-2xl text-center block w-full sm:w-auto"
            >
              CryptoPedia
            </Link>
            {/* Menu desktop */}
            <ul className="hidden lg:flex space-x-6 items-center">
              <li>
                <Link href="/ai-predict" className="hover:text-gray-700">
                  Predizione
                </Link>
              </li>
              <li>
                <Link href="/wallet" className="hover:text-gray-700">
                  Wallet
                </Link>
              </li>
              <li>
                <Link href="/news" className="hover:text-gray-700">
                  News
                </Link>
              </li>
            </ul>
          </div>

          {/* Login/Register o Avatar */}
          <div className="hidden sm:flex items-center gap-4">
            {status === "loading" ? (
              <p>Loading...</p>
            ) : session?.user ? (
              <>
                <Link href="/utente">
                  <Image
                    src={session.user.image || "/default-avatar.png"}
                    alt="User avatar"
                    width={32}
                    height={32}
                    className="rounded-full cursor-pointer"
                  />
                </Link>
              </>
            ) : (
              <>
                <button
                  onClick={() => setModalType("login")}
                  className="px-3 py-1 bg-black text-white rounded hover:opacity-70"
                >
                  Accedi
                </button>
                <button
                  onClick={() => setModalType("register")}
                  className="px-3 py-1 border border-black text-black rounded hover:opacity-70"
                >
                  Registrati
                </button>
              </>
            )}
          </div>
          {/* Avatar mobile */}
          <div className="flex absolute right-3 lg:hidden">
            {status === "loading" ? (
              <p>Loading...</p>
            ) : (
              <>
                <Link href="/utente">
                  <Image
                    src={
                      session?.user.image
                        ? session?.user.image
                        : "/default-avatar.png"
                    }
                    alt="User avatar"
                    width={32}
                    height={32}
                    className="rounded-full cursor-pointer"
                  />
                </Link>
              </>
            )}
          </div>
          {/* Burger menu */}
          <button className="lg:hidden block mt-2 sm:mt-0" onClick={toggleMenu}>
            <svg
              className="w-6 h-6 text-black"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu (centrato e ordinato) */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-white bg-opacity-95 z-40 flex flex-col items-center justify-center space-y-6">
          <button
            className="absolute top-4 right-4 text-black"
            onClick={toggleMenu}
          >
            ✕
          </button>
          <Link href="/" className="text-xl" onClick={toggleMenu}>
            Home
          </Link>
          <Link href="/ai-predict" className="text-xl" onClick={toggleMenu}>
            Predizione
          </Link>
          <Link href="/wallet" className="text-xl" onClick={toggleMenu}>
            Wallet
          </Link>
          {status !== "loading" && !session?.user && (
            <div className="flex flex-col items-center space-y-2">
              <button
                onClick={() => {
                  setModalType("login");
                  toggleMenu();
                }}
                className="w-32 px-4 py-2 bg-black text-white rounded"
              >
                Accedi
              </button>
              <button
                onClick={() => {
                  setModalType("register");
                  toggleMenu();
                }}
                className="w-32 px-4 py-2 border border-black rounded"
              >
                Registrati
              </button>
            </div>
          )}
        </div>
      )}
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
                stroke-Width="1.5"
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
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
