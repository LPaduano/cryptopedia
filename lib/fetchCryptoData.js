// lib/fetchCrypto.ts
export async function fetchCryptoData() {
  const allPrices = [];
  const perPage = 50;
  let page = 1;
  let hasMore = true;

  while (hasMore) {
    const res = await fetch(
      `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${perPage}&page=${page}&price_change_percentage=1h,24h,7d,30d`,
      {
        // ISR con revalidate ogni 10 minuti
        next: { revalidate: 60000 },
      }
    );

    if (!res.ok) {
      throw new Error(`Errore da CoinGecko: ${res.status}`);
    }

    const data = await res.json();
    if (data.length === 0 || page >= 3) {
      hasMore = false;
    } else {
      allPrices.push(...data);
      page++;
      await new Promise((r) => setTimeout(r, 60000)); // prevenzione rate limit
    }
  }

  return allPrices;
}
