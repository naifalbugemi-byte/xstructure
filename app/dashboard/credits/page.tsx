"use client";

import { useEffect, useState } from "react";

export default function CreditLogsPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/user/credits/logs")
      .then((res) => res.json())
      .then((data) => {
        setLogs(data);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="p-6">جاري التحميل...</div>;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">📊 سجل الاستهلاك</h1>

      {logs.length === 0 ? (
        <p className="text-gray-600">🚀 لا يوجد استهلاك بعد</p>
      ) : (
        <table className="w-full bg-white rounded-xl shadow">
          <thead>
            <tr className="border-b bg-gray-50">
              <th className="p-3 text-left">العملية</th>
              <th className="p-3 text-left">الكريدت</th>
              <th className="p-3 text-left">التاريخ</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log, i) => (
              <tr key={i} className="border-b hover:bg-gray-50">
                <td className="p-3">{log.action}</td>
                <td
                  className={`p-3 font-semibold ${
                    log.amount < 0 ? "text-red-600" : "text-green-600"
                  }`}
                >
                  {log.amount}
                </td>
                <td className="p-3">
                  {new Date(log.createdAt).toLocaleString("ar-SA")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
