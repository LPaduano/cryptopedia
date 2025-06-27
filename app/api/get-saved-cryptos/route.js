import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route"; // Aggiungi il percorso corretto al tuo authOptions
import clientPromise from "../../../lib/mongodb"; // Modifica se necessario

export async function GET() {
  // Ottieni la sessione dell'utente
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return new Response(
      JSON.stringify({ error: "Utente non autenticato" + session }),
      {
        status: 401,
      }
    );
  }

  const userId = session.user.id; // Recupera l'ID utente dalla sessione

  const client = await clientPromise;
  const db = client.db("crypto-db");

  // Trova l'utente nel database
  const user = await db.collection("users").findOne({ _id: userId });

  if (!user) {
    return new Response(JSON.stringify({ savedCryptos: [] }), { status: 200 });
  }

  // Ritorna le crypto salvate
  return new Response(
    JSON.stringify({ savedCryptos: user.savedCryptos || [] }),
    { status: 200 }
  );
}
