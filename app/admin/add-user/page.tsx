"use client";

import { useState } from "react";

export default function AddUserPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [referralCode, setReferralCode] = useState("");
  const [role, setRole] = useState("USER");
  const [loading, setLoading] = useState(false);

  const createUser = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/create-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName, email, password, referralCode, role }),
      });
      const data = await res.json();
      if (res.ok) {
        alert("✅ تم إنشاء المستخدم بنجاح");
        setFullName("");
        setEmail("");
        setPassword("");
        setReferralCode("");
      } else {
        alert("❌ خطأ: " + data.error);
      }
    } catch (err) {
      alert("❌ Server error");
    }
    setLoading(false);
  };

  return (
    <div className="p-10 text-white">
      <h1 className="text-3xl font-bold mb-6">إضافة مستخدم جديد</h1>
      <div className="space-y-4 max-w-md">
        <input
          type="text"
          placeholder="الاسم الكامل"
          className="w-full p-2 rounded bg-slate-800"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        />
        <input
          type="email"
          placeholder="البريد الإلكتروني"
          className="w-full p-2 rounded bg-slate-800"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="كلمة المرور"
          className="w-full p-2 rounded bg-slate-800"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          type="text"
          placeholder="Referral Code"
          className="w-full p-2 rounded bg-slate-800"
          value={referralCode}
          onChange={(e) => setReferralCode(e.target.value)}
        />
        <select
          className="w-full p-2 rounded bg-slate-800"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="USER">User</option>
          <option value="ADMIN">Admin</option>
        </select>
        <button
          onClick={createUser}
          disabled={loading}
          className="bg-gradient-to-r from-blue-600 to-cyan-600 px-4 py-2 rounded-lg w-full"
        >
          {loading ? "جاري الإنشاء..." : "إنشاء المستخدم"}
        </button>
      </div>
    </div>
  );
}
