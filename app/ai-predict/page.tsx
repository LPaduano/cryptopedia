"use client";

import { useState } from "react";

export default function AIPredictPage() {
  const [symbol, setSymbol] = useState("");
  const [prediction, setPrediction] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handlePredict = async () => {
    setLoading(true);
    setError("");
    setPrediction(null);

    if (!symbol.trim()) {
      setError("Inserisci un simbolo crypto valido");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("http://127.0.0.1:8000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ symbol: symbol.trim().toLowerCase() }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Errore nella richiesta");

      setPrediction(data.predicted_price);
    } catch (err: any) {
      setError(err.message || "Errore imprevisto");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-xl mx-auto p-6 mt-14 pt-14">
      <h1 className="text-2xl font-bold mb-4">Previsione AI Prezzo Crypto</h1>

      <input
        type="text"
        placeholder="Es. btc, eth"
        className="border p-2 rounded w-full mb-4"
        value={symbol}
        onChange={(e) => setSymbol(e.target.value)}
      />

      <button
        onClick={handlePredict}
        className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
        disabled={loading}
      >
        {loading ? "Calcolo..." : "Prevedi"}
      </button>

      {prediction !== null && (
        <p className="mt-4 text-green-600 text-lg font-semibold">
          Nostra previsione per domani {symbol.toUpperCase()}: ${prediction}
        </p>
      )}

      {error && <p className="mt-4 text-red-500">{error}</p>}
    </main>
  );
}
