"use client";
import { useEffect, useState } from "react";

export default function SchedulePage() {
  const [schedules, setSchedules] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/schedule/list").then(r => r.json()).then(setSchedules);
    fetch("/api/notifications", { headers: { "x-user-id": "USER_ID" } })
      .then(r => r.json())
      .then(setNotifications);
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">جدولة المحتوى 📅</h1>
      <table className="w-full bg-white rounded-xl shadow mb-8">
        <thead>
          <tr className="border-b">
            <th className="p-2">المحتوى</th>
            <th className="p-2">المنصة</th>
            <th className="p-2">التاريخ</th>
            <th className="p-2">الحالة</th>
          </tr>
        </thead>
        <tbody>
          {schedules.map((s, i) => (
            <tr key={i} className="border-b">
              <td className="p-2">{s.content.slice(0,40)}...</td>
              <td className="p-2">{s.platform}</td>
              <td className="p-2">{new Date(s.date).toLocaleString()}</td>
              <td className="p-2">
                {s.status === "scheduled" && "⏳ مجدول"}
                {s.status === "pending" && "📡 بانتظار"}
                {s.status === "published" && "✅ تم النشر"}
                {s.status === "failed" && "❌ فشل"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2 className="text-xl font-bold mb-4">الإشعارات 🔔</h2>
      <ul className="bg-white rounded-xl shadow divide-y">
        {notifications.map((n, i) => (
          <li key={i} className="p-3">
            {n.message} <span className="text-gray-500 text-sm">({new Date(n.createdAt).toLocaleString()})</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
