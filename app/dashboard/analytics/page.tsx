"use client";
import { useEffect, useState } from "react";

export default function AnalyticsPage() {
  const [recs, setRecs] = useState<string[]>([]);

  useEffect(() => {
    fetch("/api/analytics/recommend").then(r => r.json()).then(setRecs);
  }, []);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">🤖 توصيات الذكاء الصناعي</h1>
      <ul className="space-y-4">
        {recs.map((r, i) => (
          <li key={i} className="bg-white p-4 rounded-xl shadow">{r}</li>
        ))}
      </ul>
    </div>
  );
}
