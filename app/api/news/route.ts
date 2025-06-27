// app/api/crypto/route.ts
import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";

export async function GET() {
  const uri = process.env.MONGODB_URI!;
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db("crypto-db");
    const collection = db.collection("news");

    // Recupera le ultime news (puoi ordinare per data o prendere solo le più recenti)
    const newsList = await collection.find({}).toArray();
    console.log("news recuperate correttamente da db");
    return NextResponse.json(newsList);
  } catch (error) {
    console.error("Errore nel recupero delle news dal DB:", error);
    return new NextResponse("Errore server", { status: 500 });
  } finally {
    await client.close();
  }
}
