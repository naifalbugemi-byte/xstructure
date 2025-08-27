"use client";

import { useEffect, useState } from "react";

export default function MarketplacePage() {
  const [items, setItems] = useState<any[]>([]);
  const [settings, setSettings] = useState<any>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/admin/settings").then(r => r.json()).then(setSettings);
    fetch("/api/marketplace/list").then(r => r.json()).then(setItems);
  }, []);

  const buyItem = async (id: string) => {
    const res = await fetch("/api/marketplace/buy", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ itemId: id }),
    });
    const data = await res.json();
    if (res.ok) {
      setMessage("✅ تم الشراء! الملف جاهز للتحميل");
      window.open(data.fileUrl, "_blank");
    } else {
      setMessage("❌ " + data.error);
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">🛒 Marketplace</h1>
      {settings && (
        <p className="mb-4 text-gray-600">
          {`1 كريدت = ${settings.creditValueSAR} ريال سعودي (~${settings.creditValueUSD}$)`}
        </p>
      )}
      {message && <div className="mb-4 text-green-600">{message}</div>}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {items.map((item, i) => (
          <div key={i} className="bg-white p-4 rounded-xl shadow hover:shadow-lg transition">
            <img src={item.previewUrl} alt="preview" className="rounded-lg mb-3" />
            <h2 className="font-bold text-lg">{item.title}</h2>
            <p className="text-sm text-gray-500 mb-2">{item.description}</p>
            <p className="text-indigo-600 font-semibold mb-3">
              {item.price} كريدت
            </p>
            <button
              onClick={() => buyItem(item.id)}
              className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700"
            >
              شراء الآن
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
