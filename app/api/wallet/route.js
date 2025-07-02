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
    const db = client.db("crypto-db");

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
    const { id, name, quantity, price, date, symbol } = body;

    if (!id || !quantity || !price) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("crypto-db");

    const userEmail = session.user.email.trim();
    await db.collection("users").updateOne(
      { email: userEmail },
      {
        $push: {
          walletTransactions: {
            id,
            name,
            quantity,
            price,
            date: date || new Date(),
            symbol,
          },
        },
      }
    );

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

export async function PUT(req) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { id, quantity, price, date, symbol } = body;
    if (!id || !quantity || !price) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("crypto-db");
    const userEmail = session.user.email.trim();

    // Trova la transazione da aggiornare
    const user = await db.collection("users").findOne({ email: userEmail });
    const transactionIndex = user?.walletTransactions.findIndex(
      (tx) => tx.id === id
    );

    if (transactionIndex === -1) {
      return NextResponse.json(
        { error: "Transazione non trovata" },
        { status: 404 }
      );
    }

    // Modifica la transazione
    user.walletTransactions[transactionIndex] = {
      ...user.walletTransactions[transactionIndex],
      quantity,
      price,
      date,
      symbol,
    };

    // Salva le modifiche
    await db.collection("users").updateOne(
      { email: userEmail },
      {
        $set: {
          walletTransactions: user.walletTransactions,
        },
      }
    );

    return NextResponse.json({
      success: true,
      walletTransactions: user.walletTransactions,
    });
  } catch (error) {
    console.error("Errore PUT:", error);
    return NextResponse.json(
      { error: "Errore nell'aggiornamento" },
      { status: 500 }
    );
  }
}

export async function DELETE(req) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json({ error: "ID mancante" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("crypto-db");
    const userEmail = session.user.email.trim();

    // Rimuove la transazione con l'id specificato
    const result = await db.collection("users").updateOne(
      { email: userEmail },
      {
        $pull: {
          walletTransactions: { id },
        },
      }
    );

    if (result.modifiedCount === 0) {
      return NextResponse.json(
        { error: "Transazione non trovata" },
        { status: 404 }
      );
    }

    const updatedUser = await db
      .collection("users")
      .findOne({ email: userEmail });

    return NextResponse.json({
      success: true,
      walletTransactions: updatedUser.walletTransactions,
    });
  } catch (error) {
    console.error("Errore DELETE:", error);
    return NextResponse.json(
      { error: "Errore nell'eliminazione" },
      { status: 500 }
    );
  }
}
