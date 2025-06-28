import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../lib/authOptions"; // importa da dove definisci NextAuth
import clientPromise from "../../../lib/mongodb";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });
  }

  try {
    const client = await clientPromise;
    const db = client.db("crypto-db");
    const users = db.collection("users");

    const user = await users.findOne({ email: session.user.email });

    if (!user) {
      return NextResponse.json(
        { error: "Utente non trovato" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      name: user.name,
      email: user.email,
      image: user.image,
      createdAt: user.createdAt,
      savedCryptos: user["savedCryptos"] || [],
      status: user.status || "free",
    });
  } catch (error) {
    console.error("Errore recupero utente:", error);
    return NextResponse.json({ error: "Errore server" }, { status: 500 });
  }
}
