// app/api/crypto/route.ts
import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";

export async function GET() {
  const uri = process.env.MONGODB_URI!;
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db("crypto-db");
    const collection = db.collection("cryptos");

    // Recupera le ultime crypto (puoi ordinare per data o prendere solo le più recenti)
    const cryptoList = await collection.find({}).toArray();
    console.log("crypto recuperate correttamente da db");
    return NextResponse.json(cryptoList);
  } catch (error) {
    console.error("Errore nel recupero delle crypto dal DB:", error);
    return new NextResponse("Errore server", { status: 500 });
  } finally {
    await client.close();
  }
}
