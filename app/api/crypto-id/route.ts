import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";

export async function GET() {
  const uri = process.env.MONGODB_URI!;
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db("crypto-db");
    const collection = db.collection("cryptos");

    // Recupera solo il campo "coinId" per ogni crypto
    const cryptoIds = await collection
      .find({}, { projection: { _id: 0, id: 1 } })
      .toArray();
    const coinIdsArray = cryptoIds.map((crypto) => crypto.id);

    // Ritorna la lista di solo coinIds
    return NextResponse.json(coinIdsArray);
  } catch (error) {
    console.error("Errore nel recupero delle crypto dal DB:", error);
    return new NextResponse("Errore server", { status: 500 });
  } finally {
    await client.close();
  }
}
