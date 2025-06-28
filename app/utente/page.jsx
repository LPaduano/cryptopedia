"use client";
import { useSession, signOut } from "next-auth/react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowPathIcon } from "@heroicons/react/24/outline";
import LogoutButton from "../components/LogoutButton";
import {
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
} from "@heroicons/react/24/solid";
import { SparklesIcon } from "@heroicons/react/24/solid";

export default function PaginaUtente() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [userData, setUserData] = useState(null);
  const [savedCryptoDetails, setSavedCryptoDetails] = useState([]);

  useEffect(() => {
    if (session?.user?.email) {
      fetch("/api/user")
        .then((res) => res.json())
        .then((data) => {
          setUserData(data);
          // Seconda fetch per i dettagli delle crypto salvate
          if (data.savedCryptos?.length) {
            fetch("/api/crypto", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ ids: data.savedCryptos }),
            })
              .then((res) => res.json())
              .then((cryptoDetails) => setSavedCryptoDetails(cryptoDetails))
              .catch(console.error);
          }
        })
        .catch(console.error);
    }
  }, [session]);

  if (status === "loading" || !userData) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
        <ArrowPathIcon className="w-8 h-8 text-gray-600 animate-spin" />
        <span className="ml-3 text-gray-600">Caricamento...</span>
      </div>
    );
  }
  if (!session) {
    router.push("/");
    return null;
  }

  const formatPrice = (value) => {
    return new Intl.NumberFormat("it-IT", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  return (
    <div className="min-h-screen p-6 bg-gray-50 text-black mt-16">
      <div className="flex flex-col gap-6 max-w-7xl mx-auto w-full">
        {/* User Info Section */}
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="bg-white p-6 rounded-xl shadow-md w-full lg:w-1/3 text-center">
            <Image
              src={userData.image || "/default-avatar.png"}
              alt="Avatar utente"
              width={80}
              height={80}
              className="rounded-full mx-auto"
            />
            <h1 className="text-2xl font-semibold mt-4">{userData.name}</h1>
            <p className="text-gray-600">{userData.email}</p>

            <div className="mt-4 text-left text-sm">
              <p>
                <strong>Creato il:</strong>{" "}
                {new Date(userData.createdAt).toLocaleDateString()}
              </p>
              <p>
                <strong>Status:</strong> {userData.status}
              </p>
              <p>
                <strong>Criptovalute salvate:</strong>{" "}
                {userData.savedCryptos?.length || 0}
              </p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md w-full lg:w-2/3 text-center flex items-center justify-evenly">
            <LogoutButton />
            <button
              className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold rounded-lg shadow-md transition duration-200"
              onClick={() => alert("Upgrade coming soon!")}
            >
              <SparklesIcon className="w-5 h-5" />
              Upgrade to Premium
            </button>
          </div>
        </div>
        {/* Watchlist Section */}
        <div className="bg-white p-6 rounded-xl shadow-md w-full  overflow-x-auto">
          <h2 className="text-xl font-semibold mb-4">📈 Watchlist</h2>

          {savedCryptoDetails?.length > 0 ? (
            <table className="min-w-full table-auto text-sm text-left">
              <thead className="text-gray-700">
                <tr>
                  <th className="px-4 py-2 text-left sticky -left-7 z-10 bg-white">
                    Crypto
                  </th>
                  <th className="px-4 py-2 text-right">Prezzo</th>
                  <th className="px-4 py-2 text-right">1h</th>
                  <th className="px-4 py-2 text-right">24h</th>
                  <th className="px-4 py-2 text-right">7d</th>
                  <th className="px-4 py-2 text-right">30d</th>
                </tr>
              </thead>
              <tbody>
                {savedCryptoDetails.map((crypto) => {
                  const percentChanges = {
                    "1h": crypto.price_change_percentage_1h_in_currency,
                    "24h": crypto.price_change_percentage_24h_in_currency,
                    "7d": crypto.price_change_percentage_7d_in_currency,
                    "30d": crypto.price_change_percentage_30d_in_currency,
                  };

                  return (
                    <tr key={crypto.id} className="border-b border-gray-300">
                      {/* Crypto info */}
                      <td className="px-4 py-3 flex items-center gap-2 bg-white sticky -left-7 z-10 sm:static sm:bg-transparent">
                        <div className="flex items-center gap-2">
                          <Image
                            src={crypto.image}
                            alt={crypto.name}
                            width={24}
                            height={24}
                            className="rounded-full"
                          />
                          <div>
                            <p className="font-medium">{crypto.name}</p>
                            <p className="text-xs text-gray-500">
                              {crypto.symbol.toUpperCase()}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Prezzo */}
                      <td className="px-4 py-3 font-semibold text-gray-800 text-right">
                        {formatPrice(crypto.current_price)}
                      </td>

                      {/* Percentuali */}
                      {Object.entries(percentChanges).map(([period, value]) => {
                        const isPositive = value >= 0;
                        return (
                          <td
                            key={period}
                            className={`px-4 py-3 font-medium text-right ${
                              isPositive ? "text-green-600" : "text-red-600"
                            }`}
                          >
                            <div className="flex items-center justify-end gap-1 text-right">
                              {isPositive ? (
                                <ArrowTrendingUpIcon className="w-4 h-4" />
                              ) : (
                                <ArrowTrendingDownIcon className="w-4 h-4" />
                              )}
                              {value?.toFixed(2)}%
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <p className="text-gray-500">Nessuna criptovaluta salvata.</p>
          )}
        </div>
      </div>
    </div>
  );
}
