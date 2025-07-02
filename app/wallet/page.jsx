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

// Funzione per aggregare le transazioni
const aggregateTransactionsWithCurrentValue = (transactions, cryptos) => {
  const sortedTx = [...transactions].sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );

  const result = [];
  let cumulativeInvested = 0;
  let cumulativeQuantityBySymbol = {}; // Es. { btc: 0.5, eth: 2 }

  sortedTx.forEach((tx) => {
    const date = new Date(tx.date).toISOString().split("T")[0];
    const { symbol, quantity, price } = tx;
    const invested = quantity * price;

    cumulativeInvested += invested;
    cumulativeQuantityBySymbol[symbol] =
      (cumulativeQuantityBySymbol[symbol] || 0) + quantity;

    // Trova il prezzo corrente della crypto
    const crypto = cryptos.find((c) => c.symbol === symbol);
    const currentPrice = crypto?.current_price;

    // Calcola valore attuale totale del portafoglio
    let currentValue = 0;
    for (const sym in cumulativeQuantityBySymbol) {
      const c = cryptos.find((crypto) => crypto.symbol === sym);
      if (c?.current_price) {
        currentValue += c.current_price * cumulativeQuantityBySymbol[sym];
      }
    }

    result.push({
      date,
      invested: cumulativeInvested,
      currentValue: currentValue,
    });
  });

  return result;
};

// Componente per il grafico
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
              return [
                `€${value.toFixed(2)}`,
                name === "invested" ? "Investito" : "Valore Attuale",
              ];
            }
            return [value, name];
          }}
          labelFormatter={(label) => `Data: ${label}`}
        />
        <Line
          type="monotone"
          dataKey="invested"
          stroke="#3b82f6"
          strokeWidth={2}
          name="Investito"
        />
        <Line
          type="monotone"
          dataKey="currentValue"
          stroke="#10b981"
          strokeWidth={2}
          name="Valore Attuale"
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
  const [transDate, setTransDate] = useState();
  const [editTransDate, setEditTransDate] = useState();
  const [editTxId, setEditTxId] = useState(null);
  const [editTx, setEditTx] = useState(null);
  const [editQuantity, setEditQuantity] = useState("");
  const [editPrice, setEditPrice] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const cryptoRes = await fetch("/api/crypto");
      const cryptoData = await cryptoRes.json();
      setCryptoList(cryptoData.slice(0, 50));

      setLoading(false);
    };

    fetchData();
  }, [session]);
  useEffect(() => {
    if (session && cryptoList.length > 0) {
      const fetchWalletData = async () => {
        const walletRes = await fetch("/api/wallet");
        const walletData = await walletRes.json();
        const txs = walletData.walletTransactions || [];
        setTransactions(txs);
        setChartData(aggregateTransactionsWithCurrentValue(txs, cryptoList)); // Ora cryptoList è già disponibile
      };

      fetchWalletData();
    }
  }, [session, cryptoList]);

  // Aggiungere transazione
  const handleAddTransaction = async () => {
    if (!selectedCrypto || !quantity || !price) return;
    const symbol = cryptoList.find((c) => c.id === selectedCrypto).symbol;
    const uniqueId = `${Date.now()}-${Math.random()
      .toString(36)
      .substring(2, 10)}`;

    const newTx = {
      id: uniqueId,
      name: selectedCrypto,
      quantity: parseFloat(quantity),
      price: parseFloat(price),
      date: transDate,
      symbol,
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
      setChartData(
        aggregateTransactionsWithCurrentValue(
          data.walletTransactions || [],
          cryptoList
        )
      );
      setQuantity("");
      setPrice("");
    } catch (err) {
      alert("Errore nell'aggiunta della transazione.");
    }
  };

  // Modifica transazione
  const handleEditTransaction = async () => {
    if (!editQuantity || !editPrice || (!editTx && !editTxId)) return;
    const updatedTx = {
      id: editTx?.id || editTxId?.id,
      quantity: parseFloat(editQuantity) || editTx.quantity,
      price: parseFloat(editPrice) || editTx?.price,
      date: editTransDate || editTx.date,
      symbol: editTx?.symbol || editTxId?.symbol,
    };

    try {
      const res = await fetch("/api/wallet", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedTx),
      });

      if (!res.ok) throw new Error("Errore nell'aggiornamento");

      const data = await res.json();
      setTransactions(data.walletTransactions || []);
      setChartData(
        aggregateTransactionsWithCurrentValue(
          data.walletTransactions || [],
          cryptoList
        )
      );
      setEditTx(null); // Resetta il form di modifica
      setEditQuantity("");
      setEditPrice("");
    } catch (err) {
      alert("Errore nell'aggiornamento della transazione.");
    }
  };

  // Elimina transazione
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
      setChartData(
        aggregateTransactionsWithCurrentValue(
          data.walletTransactions || [],
          cryptoList
        )
      );
    } catch (err) {
      alert("Errore durante l'eliminazione della transazione.");
    }
  };

  // Caricamento
  if (loading || !session)
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
        <ArrowPathIcon className="w-8 h-8 text-gray-600 animate-spin" />
        <span className="ml-3 text-gray-600">Caricamento...</span>
      </div>
    );

  return (
    <div className="mt-16 mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">{session.user.name}'s Wallet</h2>

      {/* Grafico */}
      {chartData.length > 0 && <WalletChart data={chartData} />}

      {/* Form di aggiunta */}
      <div className="mb-6 space-y-6">
        {/* Selezione Crypto */}
        <select
          className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600 transition duration-200"
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

        {/* Quantità Acquistata */}
        <input
          type="number"
          placeholder="Quantità acquistata"
          className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600 transition duration-200"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
        />

        {/* Prezzo di Acquisto */}
        <input
          type="number"
          placeholder="Prezzo di acquisto (€)"
          className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600 transition duration-200"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />

        {/* Data Transazione */}
        <input
          type="date"
          onChange={(e) => setTransDate(e.target.value)}
          max={new Date().toISOString().split("T")[0]}
          className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600 transition duration-200"
        />

        {/* Bottone Aggiungi Transazione */}
        <button
          className="w-full md:w-3xs py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 transition duration-200"
          onClick={handleAddTransaction}
        >
          Aggiungi transazione
        </button>
      </div>

      {/* Tabella delle transazioni */}
      <div className="mt-8">
        {/* Tabella per Desktop */}
        <div className="overflow-x-auto w-full mt-8 md:block hidden">
          <table className="min-w-[600px] table-auto border w-full">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-2 py-1">Crypto</th>
                <th className="border px-2 py-1">Quantità</th>
                <th className="border px-2 py-1">Prezzo Acquisto</th>
                <th className="border px-2 py-1">Prezzo Attuale</th>
                <th className="border px-2 py-1">Profitto/Perdita</th>
                <th className="border px-2 py-1">Data</th>
                <th className="border px-2 py-1" colSpan={2}>
                  Azioni
                </th>
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
                    <td className="border px-2 py-1">
                      {new Date(tx.date).toLocaleDateString("it-IT", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="border px-2 py-1 text-center">
                      <button
                        onClick={() =>
                          setEditTx({
                            id: editTx === tx.id ? null : tx.id,
                            symbol: currentCrypto.symbol,
                          })
                        } // Toggle form visibility
                        className="hover:text-gray-600 hover:cursor-pointer text-sm"
                      >
                        Modifica
                      </button>
                    </td>
                    <td className="border px-2 py-1 text-center">
                      <button
                        onClick={() => handleDeleteTransaction(tx.id)}
                        className="text-red-500 hover:text-red-700 text-sm hover:cursor-pointer"
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

        {/* Card per Mobile */}
        <div className="md:hidden">
          {transactions.map((tx, index) => {
            const current =
              cryptoList.find((c) => c.id === tx.name)?.current_price ?? 0;
            const currentCrypto = cryptoList.find((c) => c.id === tx.name);
            const profit = (current - tx.price) * tx.quantity;
            const isPositive = profit >= 0;

            return (
              <div
                key={index}
                className="bg-white rounded-lg shadow-lg mb-4 p-4"
              >
                <div className="flex items-center mb-4">
                  <img
                    src={currentCrypto.image}
                    alt={currentCrypto.name}
                    className="w-12 h-12 mr-3"
                  />
                  <div>
                    <h3 className="text-lg font-semibold">
                      {currentCrypto.name}
                    </h3>
                    <p className="text-xs text-gray-500">
                      {currentCrypto.symbol}
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-semibold">Quantità</span>
                    <span className="text-sm">{tx.quantity}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-semibold">
                      Prezzo Acquisto
                    </span>
                    <span className="text-sm">€{tx.price.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-semibold">
                      Prezzo Attuale
                    </span>
                    <span className="text-sm">€{current.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-semibold">
                      Profitto/Perdita
                    </span>
                    <span
                      className={`text-sm ${
                        isPositive ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {isPositive ? "+" : "-"}€{Math.abs(profit).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-semibold">Data</span>
                    <span className="text-sm">
                      {new Date(tx.date).toLocaleDateString("it-IT", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                </div>

                <div className="flex justify-between mt-4">
                  <button
                    onClick={() =>
                      setEditTxId({
                        id: editTx === tx.id ? null : tx.id,
                        symbol: currentCrypto.symbol,
                      })
                    } // Toggle form visibility
                    className="text-blue-500 hover:text-blue-700 text-sm"
                  >
                    Modifica
                  </button>
                  <button
                    onClick={() => handleDeleteTransaction(tx.id)}
                    className="text-red-500 hover:text-red-700 text-sm"
                  >
                    Elimina
                  </button>
                </div>

                {/* Form di modifica mobile (visibile solo per la transazione cliccata) */}
                {editTxId?.id === tx.id && (
                  <div className="mt-4">
                    <input
                      type="number"
                      value={editQuantity}
                      onChange={(e) => setEditQuantity(e.target.value)}
                      className="w-full p-2 border rounded mb-4"
                    />
                    <input
                      type="number"
                      value={editPrice}
                      onChange={(e) => setEditPrice(e.target.value)}
                      className="w-full p-2 border rounded mb-4"
                    />
                    <input
                      type="date"
                      onChange={(e) => setEditTransDate(e.target.value)}
                      className="w-full p-2 border rounded mb-4"
                    />
                    <button
                      className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
                      onClick={handleEditTransaction}
                    >
                      Salva modifiche
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
      {editTx && (
        <div className="mt-8 md:block hidden">
          <h3 className="text-xl mb-4">Modifica Transazione</h3>
          <input
            type="number"
            value={editQuantity}
            onChange={(e) => setEditQuantity(e.target.value)}
            className="w-full p-2 border rounded mb-4"
          />
          <input
            type="number"
            value={editPrice}
            onChange={(e) => setEditPrice(e.target.value)}
            className="w-full p-2 border rounded mb-4"
          />
          <div className="mb-5">
            <input
              type="date"
              onChange={(e) => setEditTransDate(e.target.value)}
            />
          </div>
          <button
            className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
            onClick={() => handleEditTransaction}
          >
            Salva modifiche
          </button>
        </div>
      )}
    </div>
  );
};

export default WalletPage;
