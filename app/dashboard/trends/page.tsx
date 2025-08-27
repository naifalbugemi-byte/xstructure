"use client";
import { useEffect, useState } from "react";

export default function TrendsPage() {
  const [trends, setTrends] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/trends").then(r => r.json()).then(setTrends);
  }, []);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">🔥 الترندات الحالية</h1>
      <div className="grid gap-4">
        {trends.map((t, i) => (
          <div key={i} className="bg-white p-4 rounded-xl shadow flex justify-between items-center">
            <div>
              <h2 className="font-bold text-lg">{t.hashtag}</h2>
              <p className="text-gray-600">{t.description}</p>
            </div>
            <span className="text-sm bg-indigo-100 text-indigo-600 px-3 py-1 rounded-full">
              {t.platform}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
