// scripts/fetchCryptoDescriptions.ts

import clientPromise from "@/lib/mongodb";

const coinIds = [
  "bitcoin",
  "ethereum",
  "solana",
  "cardano",
  "ripple",
  "dogecoin",
  "litecoin",
  // aggiungine altri fino a 100 o più
];

export async function seedCryptoDescriptions() {
  const client = await clientPromise;
  const db = client.db("crypto-db");
  const collection = db.collection("cryptosDescriptions");

  for (const id of coinIds) {
    try {
      const res = await fetch(
        `https://api.coingecko.com/api/v3/coins/${id}?localization=false&tickers=false&market_data=false&community_data=false&developer_data=false`
      );
      if (!res.ok) throw new Error(`Errore con ${id}`);

      const data = await res.json();

      const crypto = {
        coinId: id,
        name: data.name,
        symbol: data.symbol,
        image: data.image?.large,
        description: {
          en: data.description?.en,
          it: data.description?.it,
        },
        homepage: data.links?.homepage?.[0],
        genesis_date: data.genesis_date,
        lastUpdated: new Date(),
      };

      await collection.updateOne(
        { coinId: id },
        { $set: crypto },
        { upsert: true }
      );

      console.log(`✅ Salvata: ${id}`);
    } catch (err) {
      console.error(`❌ Errore con ${id}:`, err);
    }
  }

  console.log("✔️  Completato");
}

seedCryptoDescriptions();
