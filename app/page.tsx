import Image from "next/image";
import Link from "next/link";
import CryptoPrices from "./components/CryptoPrices";

export default function Home() {
  return (
    <div className="mt-12 pt-12 p-3">
      <div>
        <CryptoPrices />
      </div>
    </div>
  );
}
