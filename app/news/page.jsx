"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function NewsPage() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await fetch("/api/news");
        const data = await res.json();
        setNews(data);
      } catch (error) {
        console.error("Errore nel recupero delle news:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500 text-lg">Caricamento notizie...</p>
      </div>
    );
  }

  return (
    <main className="max-w-5xl mx-auto px-4 py-20">
      <div className="grid gap-8 md:grid-cols-2">
        {news.map((item) => (
          <div
            key={item._id}
            className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-200"
          >
            <img
              src={item.image}
              alt={item.title}
              className="w-[600px] h-[300px] object-cover"
            />
            <div className="p-5">
              <h2 className="text-xl font-semibold mb-2">{item.title}</h2>
              <p className="text-gray-600 mb-4">{item.description}</p>
              {item.url ? (
                <Link
                  href={item.url}
                  target="_blank"
                  className="text-blue-600 hover:underline"
                >
                  Leggi di più →
                </Link>
              ) : (
                <p className="text-sm text-gray-400 italic">
                  Fonte non disponibile
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
