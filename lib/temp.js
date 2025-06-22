import clientPromise from "./mongodb";
import { fetchCryptoData } from "./fetchCryptoData";

export async function saveCryptoToDB() {
  const client = await clientPromise;
  const db = client.db("crypto-db");
  const collection = db.collection("cryptos");

  const cryptoData = await fetchCryptoData();

  const operations = cryptoData.map((crypto) => ({
    updateOne: {
      filter: { id: crypto.id }, // id univoco da CoinGecko
      update: { $set: crypto },
      upsert: true,
    },
  }));

  const result = await collection.bulkWrite(operations);

  console.log(
    `[MongoDB] Crypto salvate/aggiornate - Upserted: ${result.upsertedCount}, Modified: ${result.modifiedCount}`
  );
}
