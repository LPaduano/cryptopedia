import CryptoPrices from "./components/CryptoPrices";
import NewsDisplay from "./components/NewsDisplay";

export default function Home() {
  return (
    <div className="mt-12 pt-12 p-3">
      <div>
        <CryptoPrices />
        <NewsDisplay />
      </div>
    </div>
  );
}
