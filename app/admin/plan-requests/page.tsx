"use client";

import { useEffect, useState } from "react";

export default function PlanRequestsAdmin() {
  const [requests, setRequests] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/admin/plan-requests")
      .then((res) => res.json())
      .then(setRequests);
  }, []);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">
        📩 طلبات الباقات 
        {requests.length > 0 && (
          <span className="ml-2 bg-red-600 text-white text-sm px-2 py-1 rounded-full">
            {requests.length}
          </span>
        )}
      </h1>

      {requests.length === 0 ? (
        <p className="text-gray-600">لا توجد طلبات</p>
      ) : (
        <table className="w-full border-collapse bg-white shadow rounded-xl">
          <thead>
            <tr className="border-b">
              <th className="p-2">المستخدم</th>
              <th className="p-2">الباقة</th>
              <th className="p-2">التفاصيل</th>
              <th className="p-2">الحالة</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((r, i) => (
              <tr key={i} className="border-b hover:bg-gray-50">
                <td className="p-2">{r.user.email}</td>
                <td className="p-2">{r.plan.name}</td>
                <td className="p-2">{r.details || "-"}</td>
                <td className="p-2">{r.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
