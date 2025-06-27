// scripts/fetchCryptoDescriptions.ts

import clientPromise from "@/lib/mongodb";

const coinIds = [
  "bitcoin",
  "ethereum",
  "tether",
  "ripple",
  "binancecoin",
  "solana",
  "usd-coin",
  "tron",
  "dogecoin",
  "staked-ether",
  "cardano",
  "wrapped-bitcoin",
  "hyperliquid",
  "wrapped-steth",
  "bitcoin-cash",
  "sui",
  "leo-token",
  "chainlink",
  "stellar",
  "usds",
  "avalanche-2",
  "whitebit",
  "the-open-network",
  "shiba-inu",
  "binance-bridged-usdt-bnb-smart-chain",
  "litecoin",
  "weth",
  "wrapped-eeth",
  "monero",
  "hedera-hashgraph",
  "ethena-usde",
  "polkadot",
  "bitget-token",
  "coinbase-wrapped-btc",
  "uniswap",
  "pepe",
  "pi-network",
  "dai",
  "aave",
  "ethena-staked-usde",
  "okb",
  "blackrock-usd-institutional-digital-liquidity-fund",
  "bittensor",
  "aptos",
  "susds",
  "crypto-com-chain",
  "internet-computer",
  "jito-staked-sol",
  "near",
  "ethereum-classic",
  "tokenize-xchange",
  "usd1-wlfi",
  "ondo-finance",
  "mantle",
  "gatechain-token",
  "fasttoken",
  "official-trump",
  "kaspa",
  "lombard-staked-btc",
  "cosmos",
  "vechain",
  "polygon-ecosystem-token",
  "fetch-ai",
  "sky",
  "first-digital-usd",
  "ethena",
  "render-token",
  "filecoin",
  "usdtb",
  "jupiter-perpetuals-liquidity-provider-token",
  "usdt0",
  "worldcoin-wld",
  "algorand",
  "kucoin-shares",
  "quant-network",
  "arbitrum",
  "binance-staked-sol",
  "nexo",
  "flare-networks",
  "sei-network",
  "rocket-pool-eth",
  "kelp-dao-restaked-eth",
  "jupiter-exchange-solana",
  "kaia",
  "paypal-usd",
  "celestia",
  "bonk",
  "injective-protocol",
  "spx6900",
  "xdce-crowd-sale",
  "virtual-protocol",
  "pax-gold",
  "solv-btc",
  "optimism",
  "blockstack",
  "fartcoin",
  "wbnb",
  "mantle-staked-ether",
  "tether-gold",
  "sonic-3",
];

export async function seedCryptoDescriptions() {
  const client = await clientPromise;
  const db = client.db("crypto-db");
  const collection = db.collection("cryptosDescriptions");

  for (const id of coinIds) {
    try {
      const res = await fetch(
        `https://api.coingecko.com/api/v3/coins/${id}?localization=false&tickers=false&market_data=false&community_data=false&developer_data=false`
      );
      if (!res.ok) throw new Error(`Errore con ${id}`);

      const data = await res.json();

      const crypto = {
        coinId: id,
        name: data.name,
        symbol: data.symbol,
        image: data.image?.large,
        description: {
          en: data.description?.en,
          it: data.description?.it,
        },
        homepage: data.links?.homepage?.[0],
        genesis_date: data.genesis_date,
        lastUpdated: new Date(),
      };

      await collection.updateOne(
        { coinId: id },
        { $set: crypto },
        { upsert: true }
      );

      console.log(`✅ Salvata: ${id}`);
    } catch (err) {
      console.error(`❌ Errore con ${id}:`, err);
    }
  }

  console.log("✔️  Completato");
}

seedCryptoDescriptions();
