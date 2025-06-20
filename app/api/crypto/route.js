import axios from "axios";

// Variabili globali (persistono tra richieste nel dev server o in Node)
let cacheData = null;
let cacheTimestamp = null;
const CACHE_TTL = 60 * 1000; // 60 secondi

export async function GET() {
  try {
    const now = Date.now();

    // Se cache esiste e non è scaduta, restituiscila
    if (cacheData && cacheTimestamp && now - cacheTimestamp < CACHE_TTL) {
      return Response.json(cacheData);
    }

    const allPrices = [];
    const perPage = 250;
    let page = 1;
    let hasMore = true;

    while (hasMore) {
      const res = await axios.get(
        "https://api.coingecko.com/api/v3/coins/markets",
        {
          params: {
            vs_currency: "usd",
            order: "market_cap_desc",
            per_page: perPage,
            page,
            price_change_percentage: "1h,24h,7d,30d",
          },
        }
      );

      const data = res.data;
      if (data.length === 0 || page >= 3) {
        hasMore = false;
      } else {
        allPrices.push(...data);
        page++;
        await new Promise((r) => setTimeout(r, 200));
      }
    }

    // Salva in cache
    cacheData = allPrices;
    cacheTimestamp = now;

    return Response.json(allPrices);
  } catch (error) {
    console.error("Errore nel server API:", error.message);
    return new Response("Errore lato server", { status: 500 });
  }
}
