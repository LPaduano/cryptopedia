import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route"; // Percorso corretto
import { ObjectId } from "mongodb"; // Importa ObjectId
import clientPromise from "../../../lib/mongodb"; // Percorso corretto

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);

    // Verifica che l'utente sia autenticato
    if (!session || !session.user) {
      console.log("Utente non autenticato");
      return new Response(JSON.stringify({ error: "Utente non autenticato" }), {
        status: 401,
      });
    }

    const userId = session.user.id; // Ottieni l'ID utente dalla sessione
    const { cryptoId } = await req.json();

    // Verifica che cryptoId sia passato correttamente
    if (!cryptoId) {
      console.log("cryptoId non fornito");
      return new Response(JSON.stringify({ error: "cryptoId è richiesto" }), {
        status: 400,
      });
    }

    // Log per verificare userId e cryptoId
    console.log("userId ricevuto:", userId);
    console.log("cryptoId ricevuto:", cryptoId);

    const client = await clientPromise;
    const db = client.db("crypto-db");
    const usersCollection = db.collection("users");

    // Verifica se l'utente esiste nel DB
    const user = await usersCollection.findOne({ _id: new ObjectId(userId) }); // Usa ObjectId per cercare l'utente

    if (!user) {
      console.log("Utente non trovato nel DB");
      return new Response(JSON.stringify({ error: "Utente non trovato" }), {
        status: 404,
      });
    }

    // Aggiungi cryptoId all'array "saved-cryptos"
    const updateResult = await usersCollection.updateOne(
      { _id: new ObjectId(userId) }, // Assicurati che l'ID sia un ObjectId
      {
        $addToSet: { "saved-cryptos": cryptoId }, // Usa $addToSet per evitare duplicati
      }
    );

    // Log del risultato dell'aggiornamento
    console.log("updateResult:", updateResult);

    // Verifica se l'operazione è andata a buon fine
    if (updateResult.modifiedCount === 0) {
      console.log(
        "Nessuna modifica nel database. Probabilmente cryptoId è già presente."
      );
      return new Response(
        JSON.stringify({ error: "Impossibile salvare la crypto" }),
        { status: 400 }
      );
    }

    return new Response(
      JSON.stringify({ message: "Crypto salvata con successo" }),
      { status: 200 }
    );
  } catch (error) {
    // Log dell'errore completo
    console.error("Errore durante l'aggiornamento nel DB:", error);
    return new Response(JSON.stringify({ error: "Errore nel server" }), {
      status: 500,
    });
  }
}
