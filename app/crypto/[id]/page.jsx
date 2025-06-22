import clientPromise from "../../../lib/mongodb";

export default async function CryptoDetailPage({ params }) {
  const { id } = params;

  try {
    console.log(id);
    const client = await clientPromise;
    const db = client.db("crypto-db");
    const cryptosCollection = db.collection("cryptos");

    const crypto = await cryptosCollection.findOne({ id }); // oppure { _id: new ObjectId(id) } se usi Mongo _id

    if (!crypto) {
      return (
        <div className="p-6 text-red-600">
          <h1 className="text-2xl font-bold">Crypto non trovata nel DB</h1>
          <p>
            ID: <strong>{id}</strong>
          </p>
        </div>
      );
    }

    return (
      <div className="p-26 mt-32 font-sans">
        <div className="flex">
          <div className="flex flex-col flex-1">
            <div className="flex items-center gap-4 mb-6">
              <img src={crypto.image} alt={crypto.name} className="w-12 h-12" />
              <h1 className="text-3xl font-bold">
                {crypto.name} ({crypto.symbol.toUpperCase()})
              </h1>
            </div>

            <p className="text-lg mb-4">
              Prezzo attuale:
              <strong>${crypto?.current_price} USD</strong>
            </p>

            <div className="flex flex-col gap-4 text-sm">
              <p>
                Market Cap:
                <strong className="ml-3.5">
                  ${crypto.market_cap.toLocaleString()}
                </strong>
              </p>

              <p>
                Variazione 24h:
                <strong className="ml-3.5">
                  {crypto.price_change_percentage_24h?.toFixed(2)}%
                </strong>
              </p>

              <p>
                Variazione 7 giorni:
                <strong className="ml-3.5">
                  {crypto.price_change_percentage_7d_in_currency?.toFixed(2)}%
                </strong>
              </p>
              <p>
                Variazione 30 giorni:
                <strong className="ml-3.5">
                  {crypto.price_change_percentage_30d_in_currency?.toFixed(2)}%
                </strong>
              </p>
            </div>
          </div>
          <div className="flex flex-1 flex-col">
            <h2>Descrizione</h2>
            <div
              dangerouslySetInnerHTML={{
                __html: crypto.description?.it || crypto.description?.en || "",
              }}
            />
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Errore nel caricamento della crypto:", error);
    return (
      <div className="p-6 text-red-600">
        <h1 className="text-2xl font-bold">Errore nel caricamento</h1>
        <p>Controlla i log del server.</p>
      </div>
    );
  }
}
