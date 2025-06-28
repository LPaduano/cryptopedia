"use client";
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaLinkedinIn,
} from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white pt-10 pb-6 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Branding */}
        <div>
          <h2 className="text-2xl font-bold mb-4">CryptoPedia</h2>
          <p className="text-gray-400 mb-4">
            Il tuo hub definitivo per analisi, predizioni e monitoraggio delle
            criptovalute.
          </p>
          <div className="flex gap-4 mt-2">
            <a href="#" className="hover:text-blue-400">
              <FaTwitter className="w-5 h-5" />
            </a>
            <a href="#" className="hover:text-pink-500">
              <FaInstagram className="w-5 h-5" />
            </a>
            <a href="#" className="hover:text-blue-600">
              <FaFacebookF className="w-5 h-5" />
            </a>
            <a href="#" className="hover:text-blue-700">
              <FaLinkedinIn className="w-5 h-5" />
            </a>
          </div>
        </div>

        {/* Link utili */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Navigazione</h3>
          <ul className="space-y-2 text-gray-300">
            <li>
              <a href="/" className="hover:text-white">
                Home
              </a>
            </li>
            <li>
              <a href="/ai-predict" className="hover:text-white">
                Predizioni AI
              </a>
            </li>
            <li>
              <a href="/wallet" className="hover:text-white">
                Wallet
              </a>
            </li>
            <li>
              <a href="/contatti" className="hover:text-white">
                Contatti
              </a>
            </li>
            <li>
              <a href="/privacy" className="hover:text-white">
                Privacy Policy
              </a>
            </li>
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Newsletter</h3>
          <p className="text-gray-400 mb-4">
            Iscriviti per ricevere le ultime notizie e analisi di mercato.
          </p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              alert("Iscrizione inviata!");
            }}
            className="flex flex-col sm:flex-row gap-2"
          >
            <input
              type="email"
              required
              placeholder="La tua email"
              className="p-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-auto flex-1"
            />
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white"
            >
              Iscriviti
            </button>
          </form>
        </div>
      </div>

      {/* Divider & Bottom */}
      <div className="border-t border-gray-700 mt-8 pt-6 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} CryptoPedia — Tutti i diritti riservati.
      </div>
    </footer>
  );
}
