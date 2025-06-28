import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/authOptions";
import clientPromise from "../../../lib/mongodb";
import { ObjectId } from "mongodb"; // IMPORTANTE

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return new Response(JSON.stringify({ error: "Utente non autenticato" }), {
      status: 401,
    });
  }

  const userId = session.user.id;

  const client = await clientPromise;
  const db = client.db("crypto-db");

  let user;
  try {
    user = await db.collection("users").findOne({
      _id: new ObjectId(userId), // ✅ Conversione corretta
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "ID utente non valido" }), {
      status: 400,
    });
  }

  return new Response(
    JSON.stringify({ savedCryptos: user?.savedCryptos || [] }),
    { status: 200 }
  );
}
