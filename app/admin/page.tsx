"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [withdrawals, setWithdrawals] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch("/api/admin/stats", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then(setStats);

    fetch("/api/admin/withdrawals", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then(setWithdrawals);

    fetch("/api/admin/users", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then(setUsers);
  }, []);

  if (!stats) return <div className="p-6">جاري التحميل...</div>;

  return (
    <div className="p-6 space-y-6 bg-gray-100 min-h-screen">
      {/* ✨ العنوان */}
      <h1 className="text-3xl font-bold text-gray-800">
        لوحة تحكم الأدمن – Xstructure
      </h1>

      {/* 📊 الإحصائيات */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard title="إجمالي المستخدمين" value={stats.totalUsers} color="from-purple-500 to-pink-500" />
        <StatCard title="إجمالي الأرباح" value={`${stats.totalEarnings} SAR`} color="from-green-500 to-emerald-600" />
        <StatCard title="إجمالي السحوبات" value={`${stats.totalWithdrawals} طلب`} color="from-blue-500 to-indigo-600" />
        <StatCard title="إجمالي الكريدت" value={stats.totalCredits} color="from-orange-500 to-red-500" />
      </div>

      {/* 💰 طلبات السحب */}
      <div className="bg-white p-6 rounded-2xl shadow">
        <h2 className="text-xl font-bold mb-4">طلبات السحب 💰</h2>
        {withdrawals.length === 0 ? (
          <p className="text-gray-500">لا توجد طلبات سحب حالياً</p>
        ) : (
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b">
                <th className="p-2">المستخدم</th>
                <th className="p-2">المبلغ</th>
                <th className="p-2">الطريقة</th>
                <th className="p-2">التفاصيل</th>
                <th className="p-2">الحالة</th>
                <th className="p-2">إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {withdrawals.map((w, i) => (
                <tr key={i} className="border-b hover:bg-gray-50">
                  <td className="p-2">{w.user.email}</td>
                  <td className="p-2">{w.amount} ريال</td>
                  <td className="p-2">{w.method}</td>
                  <td className="p-2">{w.details}</td>
                  <td className="p-2">{w.status}</td>
                  <td className="p-2 space-x-2">
                    <button className="px-3 py-1 bg-green-500 text-white rounded-lg text-sm">
                      موافقة
                    </button>
                    <button className="px-3 py-1 bg-red-500 text-white rounded-lg text-sm">
                      رفض
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <a
          href="/api/withdraw/export"
          className="mt-4 inline-block px-4 py-2 bg-indigo-600 text-white rounded-lg"
        >
          تصدير إلى Excel
        </a>
      </div>

      {/* 👥 المستخدمين */}
      <div className="bg-white p-6 rounded-2xl shadow">
        <h2 className="text-xl font-bold mb-4">إدارة المستخدمين 👥</h2>
        {users.length === 0 ? (
          <p className="text-gray-500">لا يوجد مستخدمين</p>
        ) : (
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b">
                <th className="p-2">البريد</th>
                <th className="p-2">الكود</th>
                <th className="p-2">الأرباح</th>
                <th className="p-2">الكريدت</th>
                <th className="p-2">الدولة</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u, i) => (
                <tr key={i} className="border-b hover:bg-gray-50">
                  <td className="p-2">{u.email}</td>
                  <td className="p-2">{u.referralCode || "-"}</td>
                  <td className="p-2">{u.earnings} ريال</td>
                  <td className="p-2">{u.credits}</td>
                  <td className="p-2">{u.country || "N/A"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

function StatCard({ title, value, color }: { title: string; value: any; color: string }) {
  return (
    <div className={`p-6 rounded-2xl shadow text-white bg-gradient-to-r ${color}`}>
      <h3 className="text-sm opacity-80 mb-2">{title}</h3>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}
