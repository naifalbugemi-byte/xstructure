"use client";

import { useEffect, useState } from "react";

export default function AdminCreditAnalytics() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch("/api/admin/credits/analytics")
      .then((res) => res.json())
      .then(setData);
  }, []);

  if (!data) return <div className="p-6">جاري التحميل...</div>;

  return (
    <div className="p-6 bg-gray-100 min-h-screen space-y-8">
      <h1 className="text-2xl font-bold">📊 تحليلات الكريدت</h1>

      {/* 🔝 المستخدمين */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-lg font-semibold mb-4">🔝 أكثر المستخدمين صرفًا</h2>
        <ul className="space-y-2">
          {data.topUsers.map((u: any, i: number) => (
            <li key={i} className="flex justify-between">
              <span>{u.email}</span>
              <span className="text-red-600">-{u.totalSpent} كريدت</span>
            </li>
          ))}
        </ul>
      </div>

      {/* 📊 الخدمات */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-lg font-semibold mb-4">📊 أكثر الخدمات استهلاكًا</h2>
        <ul className="space-y-2">
          {data.topServices.map((s: any, i: number) => (
            <li key={i} className="flex justify-between">
              <span>{s.action}</span>
              <span className="text-red-600">-{s.totalSpent} كريدت</span>
            </li>
          ))}
        </ul>
      </div>

      {/* 📆 الاستهلاك الشهري */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-lg font-semibold mb-4">📆 الاستهلاك الشهري</h2>
        <ul className="space-y-2">
          {data.monthly.map((m: any, i: number) => (
            <li key={i} className="flex justify-between">
              <span>{m.month}</span>
              <span className="text-red-600">-{m.total} كريدت</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
