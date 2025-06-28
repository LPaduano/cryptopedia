// app/api/wallet/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/authOptions";
import clientPromise from "../../../lib/mongodb";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const client = await clientPromise;
    const db = client.db("crypto-db"); // usa il nome di default se non specificato

    const user = await db
      .collection("users")
      .findOne({ email: session.user.email });

    return NextResponse.json({
      walletTransactions: user?.walletTransactions || [],
    });
  } catch (error) {
    console.error("Errore GET:", error);
    return NextResponse.json({ error: "Errore nel recupero" }, { status: 500 });
  }
}

export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { id, quantity, price } = body;

    if (!id || !quantity || !price) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("crypto-db");

    const userEmail = session.user.email.trim();
    const debugUser = await db
      .collection("users")
      .findOne({ email: userEmail });
    console.log("DEBUG USER:", debugUser);
    const updateResult = await db.collection("users").updateOne(
      { email: userEmail },
      {
        $push: {
          walletTransactions: {
            id,
            quantity,
            price,
            date: new Date(),
          },
        },
      }
    );

    // Check se è stato aggiornato almeno un documento
    if (updateResult.matchedCount === 0) {
      console.warn("⚠️ Nessun utente trovato con email:", userEmail);
      return NextResponse.json(
        { error: "Utente non trovato" },
        { status: 404 }
      );
    }

    // Recupera il documento aggiornato
    const updatedUser = await db
      .collection("users")
      .findOne({ email: userEmail });

    return NextResponse.json({
      success: true,
      walletTransactions: updatedUser.walletTransactions,
    });
  } catch (error) {
    console.error("Errore POST:", error);
    return NextResponse.json(
      { error: "Errore nel salvataggio" },
      { status: 500 }
    );
  }
}
