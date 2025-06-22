import "./globals.css";
import { Inter } from "next/font/google";
import Navbar from "./components/Navbar";
import SessionWrapper from "./components/SessionWrapper";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata = {
  title: "Cryptopedia",
  description: "Crypto live data & insights",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`sm:px-2 lg:px-26 ${inter.variable}`}>
      <body className="font-sans bg-white text-black">
        <SessionWrapper>
          <Navbar />
          {children}
        </SessionWrapper>
      </body>
    </html>
  );
}
