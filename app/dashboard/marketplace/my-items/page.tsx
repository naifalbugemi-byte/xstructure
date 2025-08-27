"use client";

import { useEffect, useState } from "react";

export default function MyItemsPage() {
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/marketplace/my-items")
      .then((res) => res.json())
      .then(setItems);
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">📦 منتجاتي</h1>

      {items.length === 0 ? (
        <p className="text-gray-500">لا توجد منتجات بعد</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item, i) => (
            <div key={i} className="p-4 border rounded-lg shadow">
              <img src={item.thumbnailUrl} alt={item.title} className="w-full h-40 object-cover rounded" />
              <h2 className="font-semibold mt-2">{item.title}</h2>
              <p className="text-sm text-gray-500">{item.type}</p>
              <p className="text-green-600 font-bold">{item.priceCredits} كريدت</p>
              <p className="text-xs text-gray-400">أنشئ بتاريخ: {new Date(item.createdAt).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
