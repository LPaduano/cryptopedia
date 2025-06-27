import clientPromise from "../../../lib/mongodb";
import CryptoChart from "../../components/CryptoCharts";
export default async function CryptoDetailPage({ params }) {
  const { id } = params;

  try {
    console.log(id);
    const client = await clientPromise;
    const db = client.db("crypto-db");
    const cryptosCollection = db.collection("cryptos");
    const cryptosDescription = db.collection("cryptosDescriptions");
    const cryptoDesc = await cryptosDescription.findOne({ coinId: id });
    const crypto = await cryptosCollection.findOne({ id }); // oppure { _id: new ObjectId(id) } se usi Mongo _id
    if (!cryptoDesc) {
      return (
        <div className="p-6 text-red-600">
          <h1 className="text-2xl font-bold">Crypto non trovata nel DB</h1>
          <p>
            ID: <strong>{id}</strong>
          </p>
        </div>
      );
    }
    const serializedCrypto = {
      ...crypto,
      _id: crypto._id.toString(),
      last_updated: crypto.last_updated?.toISOString?.() || null,
    };
    return (
      <div className="p-10 max-w-6xl mx-auto mt-24 font-sans text-gray-800">
        {/* Header */}
        <div className="flex items-center gap-4 mb-10">
          <img src={crypto.image} alt={crypto.name} className="w-14 h-14" />
          <div>
            <h1 className="text-3xl font-bold">
              {crypto.name} ({crypto.symbol.toUpperCase()})
            </h1>
            <p className="text-sm text-gray-500">
              Rank #{crypto.market_cap_rank}
            </p>
          </div>
        </div>

        {/* Prezzo + variazioni */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          <div className="p-4 bg-white shadow rounded-xl">
            <p className="text-sm text-gray-500">Prezzo attuale</p>
            <p className="text-xl font-bold">${crypto.current_price}</p>
          </div>
          <div className="p-4 bg-white shadow rounded-xl">
            <p className="text-sm text-gray-500">Variazione 24h</p>
            <p
              className={`font-bold ${
                crypto.price_change_percentage_24h > 0
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {crypto.price_change_percentage_24h?.toFixed(2)}%
            </p>
          </div>
          <div className="p-4 bg-white shadow rounded-xl">
            <p className="text-sm text-gray-500">Variazione 7 giorni</p>
            <p
              className={`font-bold ${
                crypto.price_change_percentage_7d_in_currency > 0
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {crypto.price_change_percentage_7d_in_currency?.toFixed(2)}%
            </p>
          </div>
          <div className="p-4 bg-white shadow rounded-xl">
            <p className="text-sm text-gray-500">Variazione 30 giorni</p>
            <p
              className={`font-bold ${
                crypto.price_change_percentage_30d_in_currency > 0
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {crypto.price_change_percentage_30d_in_currency?.toFixed(2)}%
            </p>
          </div>
          <div className="p-4 bg-white shadow rounded-xl">
            <p className="text-sm text-gray-500">Market Cap</p>
            <p className="font-bold">${crypto.market_cap.toLocaleString()}</p>
          </div>
          <div className="p-4 bg-white shadow rounded-xl">
            <p className="text-sm text-gray-500">Volume 24h</p>
            <p className="font-bold">${crypto.total_volume.toLocaleString()}</p>
          </div>
        </div>
        {/* Descrizione */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold mb-2">Cos'è {crypto.name}?</h2>
          <div
            className="prose max-w-none text-gray-700"
            dangerouslySetInnerHTML={{
              __html:
                cryptoDesc.description?.it ||
                cryptoDesc.description?.en ||
                "<p>Nessuna descrizione disponibile.</p>",
            }}
          />
        </div>
        <div className="mb-20">
          <CryptoChart crypto={serializedCrypto} />
        </div>
        {/* Links */}
        <div className="bg-white p-6 rounded-xl shadow mb-10">
          <h3 className="text-lg font-semibold mb-2">Link Ufficiali</h3>
          <ul className="list-disc list-inside text-blue-600 space-y-1">
            {cryptoDesc.homepage && (
              <li>
                <a
                  href={cryptoDesc.homepage}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {cryptoDesc.homepage}
                </a>
              </li>
            )}
            {cryptoDesc.links?.blockchain_site?.[0] && (
              <li>
                <a
                  href={cryptoDesc.links.blockchain_site[0]}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Blockchain Explorer
                </a>
              </li>
            )}
            {cryptoDesc.links?.subreddit_url && (
              <li>
                <a
                  href={cryptoDesc.links.subreddit_url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Subreddit
                </a>
              </li>
            )}
            {cryptoDesc.links?.twitter_screen_name && (
              <li>
                <a
                  href={`https://twitter.com/${cryptoDesc.links.twitter_screen_name}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Twitter
                </a>
              </li>
            )}
          </ul>
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
