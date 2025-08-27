"use client";

import { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import {
  PieChart, Pie, Cell,
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  BarChart, Bar
} from "recharts";

export default function AdminDashboard() {
  const [users, setUsers] = useState<any[]>([]);
  const [withdrawals, setWithdrawals] = useState<any[]>([]);
  const [referrals, setReferrals] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);

  // 🟢 فلترة
  const [country, setCountry] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  useEffect(() => {
    fetch("/api/admin/users").then(r => r.json()).then(setUsers);
    fetch("/api/admin/withdrawals").then(r => r.json()).then(setWithdrawals);
    fetch("/api/admin/referrals").then(r => r.json()).then(setReferrals);
    fetch("/api/admin/products").then(r => r.json()).then(setProducts);
  }, []);

  // ✅ فلترة المستخدمين
  const filteredUsers = users.filter((u) => {
    const matchCountry = country ? u.country === country : true;
    const matchDate =
      (!dateFrom || new Date(u.createdAt) >= new Date(dateFrom)) &&
      (!dateTo || new Date(u.createdAt) <= new Date(dateTo));
    return matchCountry && matchDate;
  });

  // 📤 تصدير البيانات لإكسل
  const exportToExcel = (data: any[], filename: string) => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    XLSX.writeFile(workbook, `${filename}.xlsx`);
  };

  // 📊 بيانات الشارتات
  const usersByCountry = Object.values(
    users.reduce((acc: any, u: any) => {
      acc[u.country] = acc[u.country] || { name: u.country || "غير معروف", value: 0 };
      acc[u.country].value++;
      return acc;
    }, {})
  );

  const usersGrowth = users.map(u => ({
    month: new Date(u.createdAt).toLocaleDateString("ar-EG", { month: "short" }),
    users: 1
  }));

  const referralEarnings = referrals.map(r => ({
    code: r.code,
    earnings: r.earnings || 0
  }));

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  // 🛠️ إجراءات الأدمن
  const toggleBanUser = async (userId: string, ban: boolean) => {
    await fetch("/api/admin/ban-user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, ban })
    });
    location.reload();
  };

  const deleteUser = async (userId: string) => {
    await fetch("/api/admin/delete-user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId })
    });
    location.reload();
  };

  const toggleHideProduct = async (productId: string, hide: boolean) => {
    await fetch("/api/admin/hide-product", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId, hide })
    });
    location.reload();
  };

  const deleteProduct = async (productId: string) => {
    await fetch("/api/admin/delete-product", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId })
    });
    location.reload();
  };

  return (
    <div className="p-6 space-y-8 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold">لوحة تحكم الأدمن 👨‍💻</h1>

      {/* 🔥 الشارتات */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-lg font-semibold mb-4">المستخدمين حسب الدولة</h2>
          <PieChart width={250} height={250}>
            <Pie data={usersByCountry} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label>
              {usersByCountry.map((_, i) => (
                <Cell key={`cell-${i}`} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
          </PieChart>
        </div>

        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-lg font-semibold mb-4">نمو المستخدمين</h2>
          <LineChart width={300} height={250} data={usersGrowth}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="users" stroke="#8884d8" />
          </LineChart>
        </div>

        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-lg font-semibold mb-4">أرباح الأكواد</h2>
          <BarChart width={300} height={250} data={referralEarnings}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="code" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="earnings" fill="#82ca9d" />
          </BarChart>
        </div>
      </div>

      {/* ⚙️ أدوات الفلترة */}
      <div className="bg-white rounded-2xl shadow p-6 flex gap-4 items-end">
        <div>
          <label className="block text-sm font-medium">الدولة</label>
          <input
            type="text"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            placeholder="مثال: السعودية"
            className="border rounded-lg p-2 w-48"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">من تاريخ</label>
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className="border rounded-lg p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">إلى تاريخ</label>
          <input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            className="border rounded-lg p-2"
          />
        </div>
      </div>

      {/* 📊 جدول المستخدمين */}
      <div className="bg-white rounded-2xl shadow p-6">
        <h2 className="text-xl font-semibold mb-4">المستخدمين</h2>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b">
              <th className="p-2">الإيميل</th>
              <th className="p-2">الرصيد</th>
              <th className="p-2">الدولة</th>
              <th className="p-2">تاريخ التسجيل</th>
              <th className="p-2">إجراءات</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((u, i) => (
              <tr key={i} className="border-b hover:bg-gray-50">
                <td className="p-2">{u.email}</td>
                <td className="p-2">{u.credits}</td>
                <td className="p-2">{u.country || "غير محدد"}</td>
                <td className="p-2">{new Date(u.createdAt).toLocaleDateString()}</td>
                <td className="p-2 space-x-2">
                  <button
                    className="bg-yellow-500 text-white px-2 py-1 rounded"
                    onClick={() => toggleBanUser(u.id, !u.isBanned)}
                  >
                    {u.isBanned ? "إلغاء الحجب" : "حجب"}
                  </button>
                  <button
                    className="bg-red-600 text-white px-2 py-1 rounded"
                    onClick={() => deleteUser(u.id)}
                  >
                    حذف
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 📦 القوالب */}
      <div className="bg-white rounded-2xl shadow p-6">
        <h2 className="text-xl font-semibold mb-4">القوالب</h2>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b">
              <th className="p-2">العنوان</th>
              <th className="p-2">المصمم</th>
              <th className="p-2">السعر</th>
              <th className="p-2">الحالة</th>
              <th className="p-2">إجراءات</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p, i) => (
              <tr key={i} className="border-b hover:bg-gray-50">
                <td className="p-2">{p.title}</td>
                <td className="p-2">{p.owner?.email}</td>
                <td className="p-2">{p.priceCredits} كريدت</td>
                <td className="p-2">{p.isActive ? "فعال" : "مخفي"}</td>
                <td className="p-2 space-x-2">
                  <button
                    className="bg-yellow-500 text-white px-2 py-1 rounded"
                    onClick={() => toggleHideProduct(p.id, p.isActive)}
                  >
                    {p.isActive ? "إخفاء" : "إظهار"}
                  </button>
                  <button
                    className="bg-red-600 text-white px-2 py-1 rounded"
                    onClick={() => deleteProduct(p.id)}
                  >
                    حذف
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
