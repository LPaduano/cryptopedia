"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";
import { StarIcon as StarOutline } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import {
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
} from "@heroicons/react/24/solid";
import { fetchCryptoData } from "../../lib/fetchCryptoData";
const CryptoPrices = () => {
  const [prices, setPrices] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const fetchAllCryptoPrices = async () => {
    try {
      const res = await fetch("/api/crypto");
      if (!res.ok) throw new Error("Errore nel recupero dei dati dal DB");

      const data = await res.json();
      setPrices(data);
    } catch (error) {
      console.error("Errore nel recupero delle crypto:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllCryptoPrices();
    const interval = setInterval(fetchAllCryptoPrices, 60000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return <p>Caricamento...</p>;

  const formatPrice = (value) => {
    return new Intl.NumberFormat("it-IT", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };
  return (
    <div className="mt-4 font-sans">
      <div className="flex flex-col gap-2 mb-8">
        <h1 className="text-xl font-bold font-sans">
          Informazioni Sulle Cryptovalute Live
        </h1>
        <p className="text-md text-gray-500">
          Elenco di tutte le monete listate su Cryptopedia con prezzi e
          capitalizzazione di mercato
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr>
              <th className="p-2 text-left"></th>
              <th className="p-2 text-left">#</th>
              <th className="p-2 text-left bg-white sticky left-0 z-10 sm:static">
                Crypto
              </th>
              <th className="p-2 text-right">Prezzo</th>
              <th className="p-2 text-right">1h</th>
              <th className="p-2 text-right">24h</th>
              <th className="p-2 text-right">7g</th>
              <th className="p-2 text-right">30g</th>
              <th className="p-2 text-right">Market Cap</th>
            </tr>
          </thead>
          <tbody>
            {prices.map((crypto, index) => (
              <tr
                key={crypto.id}
                className="border-t border-gray-200 hover:bg-gray-100 cursor-pointer"
                onClick={() => router.push(`/crypto/${crypto.id}`)}
              >
                <td className="pr-2 hover:cursor-pointer">
                  <StarOutline className="w-5 h-5 text-gray-400" />
                </td>
                <td> {index + 1}</td>
                <td className="p-2 flex items-center gap-2 font-sans text-right bg-white sticky left-0 z-10 sm:static sm:bg-transparent">
                  <img
                    src={crypto.image}
                    alt={crypto.name}
                    className="w-5 h-5"
                  />
                  <strong className="sm: text-left">{crypto.name}</strong>
                  <p className="py-6 text-gray-400">
                    {crypto.symbol.toUpperCase()}
                  </p>
                </td>
                <td className="p-2 font-sans text-right pr-4">
                  {formatPrice(crypto.current_price)}
                  {/* ${crypto.current_price.toFixed(6)} */}
                </td>
                {["1h", "24h", "7d", "30d"].map((period) => {
                  const key = `price_change_percentage_${period}_in_currency`;
                  const value = crypto[key];
                  const isPositive = value >= 0;
                  return (
                    <td
                      key={period}
                      className={`text-right p-2 ${
                        isPositive ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      <span className="flex items-center justify-end gap-1">
                        {isPositive ? (
                          <ArrowTrendingUpIcon className="w-4 h-4 text-green-600" />
                        ) : (
                          <ArrowTrendingDownIcon className="w-4 h-4 text-red-600" />
                        )}
                        {value?.toFixed(2)}%
                      </span>
                    </td>
                  );
                })}
                <td className="text-right p-2">
                  ${crypto.market_cap?.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CryptoPrices;
