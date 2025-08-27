"use client";
import { useEffect, useState } from "react";

export default function NotificationsPage() {
  const [notifs, setNotifs] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/notifications/list", { headers: { "x-user-id": "USER_ID" } })
      .then(r => r.json())
      .then(setNotifs);
  }, []);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-xl font-bold mb-4">الإشعارات 🔔</h1>
      <ul className="bg-white rounded-xl shadow divide-y">
        {notifs.map((n, i) => (
          <li key={i} className="p-3">
            <span className="font-semibold">{n.title}</span>
            <p>{n.message}</p>
            <small className="text-gray-500">
              {new Date(n.createdAt).toLocaleString()}
            </small>
          </li>
        ))}
      </ul>
    </div>
  );
}
