// app/api/save-crypto/route.ts
import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/authOptions";
import { ObjectId } from "mongodb";
import clientPromise from "../../../lib/mongodb";

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return new Response(JSON.stringify({ error: "Utente non autenticato" }), {
        status: 401,
      });
    }

    const userId = session.user.id;
    const { cryptoId, action } = await req.json();

    if (!cryptoId) {
      return new Response(JSON.stringify({ error: "cryptoId è richiesto" }), {
        status: 400,
      });
    }

    const client = await clientPromise;
    const db = client.db("crypto-db");
    const usersCollection = db.collection("users");

    const user = await usersCollection.findOne({ _id: new ObjectId(userId) });

    if (!user) {
      return new Response(JSON.stringify({ error: "Utente non trovato" }), {
        status: 404,
      });
    }

    let updateResult;

    if (action === "remove") {
      updateResult = await usersCollection.updateOne(
        { _id: new ObjectId(userId) },
        { $pull: { savedCryptos: cryptoId } }
      );
    } else {
      // Default: aggiunta
      updateResult = await usersCollection.updateOne(
        { _id: new ObjectId(userId) },
        { $addToSet: { savedCryptos: cryptoId } }
      );
    }

    if (updateResult.modifiedCount === 0) {
      return new Response(
        JSON.stringify({
          error:
            action === "remove"
              ? "Crypto non trovata tra i preferiti"
              : "Crypto già presente",
        }),
        { status: 400 }
      );
    }

    return new Response(
      JSON.stringify({
        message:
          action === "remove"
            ? "Crypto rimossa con successo"
            : "Crypto salvata con successo",
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Errore durante l'aggiornamento nel DB:", error);
    return new Response(JSON.stringify({ error: "Errore nel server" }), {
      status: 500,
    });
  }
}
