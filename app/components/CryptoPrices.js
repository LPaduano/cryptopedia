"use client";
import { useState, useEffect } from "react";
import axios from "axios";

const CryptoPrices = () => {
  const [prices, setPrices] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAllCryptoPrices = async () => {
    try {
      const res = await axios.get("/api/crypto");
      setPrices(res.data);
      setLoading(false);
    } catch (error) {
      console.error("Errore nel recupero dati:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllCryptoPrices();
    const interval = setInterval(fetchAllCryptoPrices, 60000); // ogni 60 sec
    return () => clearInterval(interval);
  }, []);

  if (loading) return <p>Caricamento...</p>;

  return (
    <div className="mt-4">
      <h1 className="text-lg font-bold mb-2">Live Cryptocurrency Prices</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr>
              <th className="p-2 text-left">Crypto</th>
              <th className="p-2 text-left">Prezzo</th>
              <th className="p-2 text-left">1h</th>
              <th className="p-2 text-left">24h</th>
              <th className="p-2 text-left">7g</th>
              <th className="p-2 text-left">30g</th>
              <th className="p-2 text-left">Market Cap</th>
            </tr>
          </thead>
          <tbody>
            {prices.map((crypto) => (
              <tr key={crypto.id} className="border-t border-gray-200">
                <td className="p-6 flex items-center gap-2">
                  <img
                    src={crypto.image}
                    alt={crypto.name}
                    className="w-5 h-5"
                  />
                  {crypto.name}
                </td>
                <td className="p-2">${crypto.current_price.toFixed(6)}</td>
                {["1h", "24h", "7d", "30d"].map((period) => {
                  const key = `price_change_percentage_${period}_in_currency`;
                  const value = crypto[key];
                  const isPositive = value >= 0;
                  return (
                    <td
                      key={period}
                      className={`p-2 ${
                        isPositive ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {isPositive ? "🔼" : "🔽"} {value?.toFixed(2)}%
                    </td>
                  );
                })}
                <td className="p-2">${crypto.market_cap?.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CryptoPrices;
