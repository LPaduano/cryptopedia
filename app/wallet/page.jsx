"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { ArrowPathIcon } from "@heroicons/react/24/outline";
const aggregateTransactions = (transactions) => {
  // Ordina le transazioni per data
  const sortedTx = [...transactions].sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );

  const result = [];
  let cumulativeTotal = 0;

  sortedTx.forEach((tx) => {
    const date = new Date(tx.date).toISOString().split("T")[0];
    const value = tx.quantity * tx.price;

    // Se ultimo elemento è dello stesso giorno, aggiorna, altrimenti aggiungi nuovo record
    if (result.length > 0 && result[result.length - 1].date === date) {
      cumulativeTotal += value;
      result[result.length - 1].total = cumulativeTotal;
    } else {
      cumulativeTotal += value;
      result.push({ date, total: cumulativeTotal });
    }
  });

  return result;
};

const WalletChart = ({ data }) => (
  <div className="w-full h-64 mb-8">
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip
          formatter={(value, name) => {
            if (typeof value === "number") {
              return [`€${value.toFixed(2)}`, name];
            }
            return [value, name];
          }}
          labelFormatter={(label) => `Data: ${label}`}
        />
        <Line
          type="monotone"
          dataKey="total"
          stroke="#3b82f6"
          strokeWidth={2}
        />
      </LineChart>
    </ResponsiveContainer>
  </div>
);

const WalletPage = () => {
  const { data: session } = useSession();
  const [cryptoList, setCryptoList] = useState([]);
  const [selectedCrypto, setSelectedCrypto] = useState("");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const cryptoRes = await fetch("/api/crypto");
      const cryptoData = await cryptoRes.json();
      setCryptoList(cryptoData.slice(0, 50));

      if (session) {
        const walletRes = await fetch("/api/wallet");
        const walletData = await walletRes.json();
        const txs = walletData.walletTransactions || [];
        setTransactions(txs);
        setChartData(aggregateTransactions(txs));
      }

      setLoading(false);
    };

    fetchData();
  }, [session]);

  const handleAddTransaction = async () => {
    if (!selectedCrypto || !quantity || !price) return;
    const uniqueId = `${Date.now()}-${Math.random()
      .toString(36)
      .substring(2, 10)}`;

    const newTx = {
      id: uniqueId,
      name: selectedCrypto,
      quantity: parseFloat(quantity),
      price: parseFloat(price),
    };

    try {
      const res = await fetch("/api/wallet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTx),
      });

      if (!res.ok) throw new Error("Errore nel salvataggio");

      const data = await res.json();
      setTransactions(data.walletTransactions || []);
      setChartData(aggregateTransactions(data.walletTransactions || []));
      setQuantity("");
      setPrice("");
    } catch (err) {
      alert("Errore nell'aggiunta della transazione.");
    }
  };
  const handleDeleteTransaction = async (transactionId) => {
    try {
      const res = await fetch("/api/wallet", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: transactionId }),
      });

      if (!res.ok) throw new Error("Errore nell'eliminazione");

      const data = await res.json();
      setTransactions(data.walletTransactions || []);
      setChartData(aggregateTransactions(data.walletTransactions || []));
    } catch (err) {
      alert("Errore durante l'eliminazione della transazione.");
    }
  };

  if (loading || !session)
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
        <ArrowPathIcon className="w-8 h-8 text-gray-600 animate-spin" />
        <span className="ml-3 text-gray-600">Caricamento...</span>
      </div>
    );

  return (
    <div className="mt-16 max-w-2xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">{session.user.name}'s Wallet</h2>

      {/* Chart */}
      {chartData.length > 0 && <WalletChart data={chartData} />}

      {/* Form */}
      <div className="mb-6 space-y-4">
        <select
          className="w-full p-2 border rounded"
          value={selectedCrypto}
          onChange={(e) => setSelectedCrypto(e.target.value)}
        >
          <option value="">Seleziona una crypto</option>
          {cryptoList.map((crypto) => (
            <option key={crypto.id} value={crypto.id}>
              {crypto.name} ({crypto.symbol.toUpperCase()})
            </option>
          ))}
        </select>

        <input
          type="number"
          placeholder="Quantità acquistata"
          className="w-full p-2 border rounded"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
        />

        <input
          type="number"
          placeholder="Prezzo di acquisto (€)"
          className="w-full p-2 border rounded"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />

        <button
          className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
          onClick={handleAddTransaction}
        >
          Aggiungi transazione
        </button>
      </div>

      {/* Tabella delle transazioni */}
      <div className="overflow-x-auto w-full mt-8">
        <table className="min-w-[600px] table-auto border">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-2 py-1">Crypto</th>
              <th className="border px-2 py-1">Quantità</th>
              <th className="border px-2 py-1">Prezzo Acquisto</th>
              <th className="border px-2 py-1">Prezzo Attuale</th>
              <th className="border px-2 py-1">Profitto/Perdita</th>
              <th className="border px-2 py-1">Azioni</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx, index) => {
              const current =
                cryptoList.find((c) => c.id === tx.name)?.current_price ?? 0;
              const currentCrypto = cryptoList.find((c) => c.id === tx.name);
              const profit = (current - tx.price) * tx.quantity;
              const isPositive = profit >= 0;

              return (
                <tr key={index}>
                  <td className="border px-2 py-1">
                    <div className="flex items-center justify-evenly">
                      <img
                        src={currentCrypto.image}
                        alt={currentCrypto.name}
                        className="w-5 h-5 shrink-0"
                      />
                      <p className="uppercase text-xs text-gray-600">
                        {currentCrypto.symbol}
                      </p>
                    </div>
                  </td>
                  <td className="border px-2 py-1">{tx.quantity}</td>
                  <td className="border px-2 py-1">€{tx.price.toFixed(2)}</td>
                  <td className="border px-2 py-1">€{current.toFixed(2)}</td>
                  <td
                    className={`border px-2 py-1 ${
                      isPositive ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {isPositive ? "+" : "-"}€{Math.abs(profit).toFixed(2)}
                  </td>
                  <td className="border px-2 py-1 text-center">
                    <button
                      onClick={() => handleDeleteTransaction(tx.id)}
                      className="text-red-500 hover:text-red-700 text-sm"
                    >
                      Elimina
                    </button>
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

export default WalletPage;
