"use client";

import { useEffect, useState } from "react";

export default function PlansPage() {
  const [plans, setPlans] = useState<any[]>([]);
  const [region, setRegion] = useState("WORLD");
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/region")
      .then((res) => res.json())
      .then((data) => {
        setRegion(data.region);
        return fetch(`/api/plans/list?region=${data.region}`);
      })
      .then((res) => res.json())
      .then(setPlans);
  }, []);

  const sendRequest = async (planId: string) => {
    const details = prompt("أدخل تفاصيل إضافية عن طلبك:");
    const res = await fetch("/api/plans/request", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ planId, details }),
    });
    const data = await res.json();
    if (res.ok) {
      setMessage("✅ تم إرسال طلبك بنجاح");
    } else {
      setMessage("❌ " + data.error);
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">💳 خطط الاشتراك</h1>

      {message && <div className="mb-4 text-green-600">{message}</div>}

      <div className="grid md:grid-cols-3 gap-6">
        {plans.map((p, i) => (
          <div key={i} className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
            <h2 className="font-bold text-xl mb-2">{p.name}</h2>
            <p className="text-gray-600 mb-4">{p.credits} كريدت</p>
            <p className="text-indigo-600 text-2xl font-bold mb-4">
              {p.price} {p.currency}
            </p>
            {p.isRequestOnly ? (
              <button
                onClick={() => sendRequest(p.id)}
                className="w-full bg-orange-600 text-white py-2 rounded-lg hover:bg-orange-700"
              >
                📩 أرسل طلبك
              </button>
            ) : (
              <button className="w-full bg-purple-600 text-white py-2 rounded-lg">
                اشتر الآن
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
