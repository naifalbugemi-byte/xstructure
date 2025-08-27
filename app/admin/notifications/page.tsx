"use client";
import { useEffect, useState } from "react";

export default function AdminNotifications() {
  const [notifs, setNotifs] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/notifications/list")
      .then(r => r.json())
      .then(setNotifs);
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">كل الإشعارات 📢</h1>
      <table className="w-full bg-white rounded-xl shadow">
        <thead>
          <tr>
            <th className="p-2">المستخدم</th>
            <th className="p-2">النوع</th>
            <th className="p-2">العنوان</th>
            <th className="p-2">الرسالة</th>
            <th className="p-2">التاريخ</th>
          </tr>
        </thead>
        <tbody>
          {notifs.map((n, i) => (
            <tr key={i} className="border-b">
              <td className="p-2">{n.userId || "عام"}</td>
              <td className="p-2">{n.type}</td>
              <td className="p-2">{n.title}</td>
              <td className="p-2">{n.message}</td>
              <td className="p-2">{new Date(n.createdAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
