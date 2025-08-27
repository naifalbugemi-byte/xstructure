"use client";

import { useEffect, useState } from "react";

export default function PlansAdminPage() {
  const [plans, setPlans] = useState<any[]>([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/plans/list?region=SA")
      .then((res) => res.json())
      .then(setPlans);
  }, []);

  const savePlan = async (plan: any) => {
    const res = await fetch("/api/plans/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(plan),
    });
    const data = await res.json();
    if (res.ok) {
      setMessage("✅ تم حفظ الباقة بنجاح");
    } else {
      setMessage("❌ فشل الحفظ: " + data.error);
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">📦 إدارة الباقات</h1>
      {message && <p className="mb-4 text-green-600">{message}</p>}

      <div className="grid gap-6">
        {plans.map((p, i) => (
          <div key={i} className="bg-white p-6 rounded-xl shadow space-y-4">
            <h2 className="font-bold text-lg">{p.name}</h2>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="text-sm">السعر (السعودية)</label>
                <input type="number" defaultValue={p.priceSAR} className="border rounded p-2 w-full"
                  onBlur={(e) => savePlan({ ...p, priceSAR: Number(e.target.value) })} />
              </div>
              <div>
                <label className="text-sm">السعر (الخليج)</label>
                <input type="number" defaultValue={p.priceGCC} className="border rounded p-2 w-full"
                  onBlur={(e) => savePlan({ ...p, priceGCC: Number(e.target.value) })} />
              </div>
              <div>
                <label className="text-sm">السعر (العالم بالدولار)</label>
                <input type="number" defaultValue={p.priceUSD} className="border rounded p-2 w-full"
                  onBlur={(e) => savePlan({ ...p, priceUSD: Number(e.target.value) })} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
