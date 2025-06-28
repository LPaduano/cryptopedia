"use client";

import useSWR from "swr";
import { useState, useEffect } from "react";
import { StarIcon as StarOutline, StarIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import {
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
} from "@heroicons/react/24/solid";
import { useSession } from "next-auth/react";

const fetcher = (url) => fetch(url).then((res) => res.json());
const CryptoPrices = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const {
    data: prices = [],
    error,
    isLoading,
  } = useSWR("/api/crypto", fetcher, {
    refreshInterval: 60000, // 🔁 ogni 60s aggiorna in background
    revalidateOnFocus: false, // 🔕 no refresh se torni alla tab
  });

  const [savedCryptos, setSavedCryptos] = useState(new Set()); // Un set per memorizzare le criptovalute salvate

  // Simuliamo l'ottenimento delle crypto salvate per un utente
  useEffect(() => {
    const fetchSavedCryptos = async () => {
      const response = await fetch("/api/get-saved-cryptos"); // Endpoint per ottenere le crypto salvate
      const data = await response.json();

      // Verifica che 'data.savedCryptos' sia un array prima di convertirlo in un Set
      if (Array.isArray(data.savedCryptos)) {
        setSavedCryptos(new Set(data.savedCryptos)); // Usa Set per mantenere la funzionalità `has`
      } else {
        console.error("savedCryptos non è un array:", data.savedCryptos);
      }
    };

    fetchSavedCryptos();
  }, []);

  const handleSaveCrypto = async (cryptoId) => {
    try {
      const userId = session?.user.id; // Assicurati che l'userId sia nella sessione
      if (!userId) {
        console.error("Utente non trovato nella sessione");
        return;
      }
      const isSaved = savedCryptos.has(cryptoId);

      const response = await fetch("/api/save-crypto", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          cryptoId,
          action: isSaved ? "remove" : "save", // Aggiungi un'azione per gestire l'aggiunta/rimozione
        }),
      });

      const result = await response.json();
      if (result.message) {
        // Aggiorna la UI dopo l'azione
        setSavedCryptos((prev) => {
          const updatedSavedCryptos = new Set(prev);
          if (isSaved) {
            // Rimuovi dalla lista se già salvata
            updatedSavedCryptos.delete(cryptoId);
          } else {
            // Aggiungi alla lista se non salvata
            updatedSavedCryptos.add(cryptoId);
          }
          return updatedSavedCryptos;
        });
      } else {
        console.error(
          "Errore durante il salvataggio della crypto",
          result.error
        );
      }
    } catch (error) {
      console.error("Errore nel salvataggio della crypto", error);
    }
  };

  if (isLoading) return <p>Caricamento...</p>;
  if (error) return <p>Errore nel caricamento</p>;

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
              <th className="p-2 text-left bg-white sticky left-0 z-10">
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
            {prices.map((crypto, index) => {
              const isSaved = savedCryptos.has(crypto.id); // Controlla se la crypto è salvata
              return (
                <tr
                  key={crypto.id}
                  className="border-t border-gray-200 hover:bg-gray-100 cursor-pointer"
                  onClick={() => router.push(`/crypto/${crypto.id}`)}
                >
                  <td
                    className="pr-2 hover:cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault(); // Evita che il click sulla stellina faccia partire il `onClick` della riga
                      handleSaveCrypto(crypto.id);
                    }}
                  >
                    {isSaved ? (
                      <StarIcon className="w-5 h-5 text-yellow-400" />
                    ) : (
                      <StarOutline className="w-5 h-5 text-gray-400" />
                    )}
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
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CryptoPrices;
