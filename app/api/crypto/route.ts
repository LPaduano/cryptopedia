import { NextRequest, NextResponse } from "next/server";
import clientPromise from "../../../lib/mongodb";

type PostBody = {
  ids: string[];
};

// GET tutte le crypto
export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("crypto-db");
    const collection = db.collection("cryptos");

    const cryptoList = await collection.find({}).toArray();
    console.log("✅ Crypto recuperate dal DB");

    return NextResponse.json(cryptoList, {
      status: 200,
      headers: {
        "Cache-Control": "public, max-age=180, stale-while-revalidate=30",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  } catch (error) {
    console.error("❌ Errore GET:", error);
    return new NextResponse("Errore server", { status: 500 });
  }
}

// POST con lista di ID
export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as PostBody;
    const { ids } = body;

    if (!Array.isArray(ids) || ids.some((id) => typeof id !== "string")) {
      return NextResponse.json(
        { error: "Formato ID non valido" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("crypto-db");

    const cryptos = await db
      .collection("cryptos")
      .find({ id: { $in: ids } })
      .toArray();

    return NextResponse.json(cryptos);
  } catch (error) {
    console.error("❌ Errore POST:", error);
    return NextResponse.json({ error: "Errore server" }, { status: 500 });
  }
}

// (opzionale) Risposta preflight CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
