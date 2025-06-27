// components/NewsDisplay.tsx
"use client";

import React, { useEffect, useState } from "react";

const NewsDisplay = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const fetchAllCryptoNews = async () => {
    try {
      const res = await fetch("/api/news");
      if (!res.ok) throw new Error("Errore nel recupero dei dati dal DB");

      const data = await res.json();
      setNews(data);
    } catch (error) {
      console.error("Errore nel recupero delle crypto:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchAllCryptoNews();
  }, []);
  return (
    <section className="mt-10 px-4">
      <h2 className="text-2xl font-bold mb-4">Crypto News</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {news.map((item, idx) => (
          <a
            key={idx}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="relative block h-64 overflow-hidden rounded-lg shadow-lg group"
          >
            <img
              src={item.image}
              alt={item.title}
              className="w-full h-full object-cover transform transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black via-transparent to-transparent p-4">
              <h3 className="text-white font-semibold text-lg">{item.title}</h3>
              <p className="text-gray-200 text-sm mt-1 line-clamp-3">
                {item.description}
              </p>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
};

export default NewsDisplay;
