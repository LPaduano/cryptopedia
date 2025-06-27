"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

type Crypto = {
  name: string;
  current_price: number;
  price_change_percentage_1h_in_currency: number;
  price_change_percentage_24h_in_currency: number;
  price_change_percentage_7d_in_currency: number;
  price_change_percentage_30d_in_currency: number;
};

type Props = {
  crypto: Crypto;
};

export default function CryptoChart({ crypto }: Props) {
  const {
    current_price,
    price_change_percentage_30d_in_currency,
    price_change_percentage_7d_in_currency,
    price_change_percentage_24h_in_currency,
  } = crypto;

  // Funzione per stimare il prezzo passato dato il prezzo attuale e la % di variazione
  const estimatePrice = (now: number, change: number) =>
    now / (1 + change / 100);

  const data = [
    {
      name: "30d fa",
      price: estimatePrice(
        current_price,
        price_change_percentage_30d_in_currency
      ),
    },
    {
      name: "7d fa",
      price: estimatePrice(
        current_price,
        price_change_percentage_7d_in_currency
      ),
    },
    {
      name: "1d fa",
      price: estimatePrice(
        current_price,
        price_change_percentage_24h_in_currency
      ),
    },
    {
      name: "Oggi",
      price: current_price,
    },
  ];

  return (
    <div style={{ width: "100%", height: 300 }}>
      <h2 className="text-xl font-semibold mb-2">
        Andamento stimato {crypto.name}
      </h2>
      <ResponsiveContainer>
        <LineChart data={data}>
          <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
          <XAxis dataKey="name" />
          <YAxis dataKey="price" />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="price"
            stroke="#8884d8"
            strokeWidth={2}
            dot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
