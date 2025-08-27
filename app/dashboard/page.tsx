"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function UserDashboard() {
  const [user, setUser] = useState<any>(null);
  const [schedules, setSchedules] = useState<any[]>([]);
  const [withdrawals, setWithdrawals] = useState<any[]>([]);
  const [templates, setTemplates] = useState<any[]>([]);
  const [referral, setReferral] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    fetch("/api/user/me").then(r => r.json()).then(setUser);
    fetch("/api/user/schedules").then(r => r.json()).then(setSchedules);
    fetch("/api/user/withdrawals").then(r => r.json()).then(setWithdrawals);
    fetch("/api/user/templates").then(r => r.json()).then(setTemplates);

    if (userId) {
      fetch(`/api/referral/summary?userId=${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => setReferral(data));
    }
  }, []);

  if (!user) return <div className="p-6">جاري التحميل...</div>;

  return (
    <div className="p-6 space-y-6 bg-gray-100 min-h-screen">
      {/* 🎯 بطاقة الإحالات */}
      <div className="p-6 rounded-2xl shadow-2xl bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-700 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top_left,_var(--tw-gradient-stops))] from-pink-500 via-purple-500 to-blue-600"></div>
        <div className="relative z-10">
          <h2 className="text-2xl font-bold mb-2">Referral Program</h2>
          <p className="text-sm opacity-80 mb-4">
            شارك كودك الخاص واربح مع Xstructure
          </p>

          <div className="bg-black/30 border border-white/20 p-4 rounded-xl mb-4 flex justify-between items-center">
            <span className="font-mono text-lg">
              {referral?.referralCode || "N/A"}
            </span>
            <button
              onClick={() => navigator.clipboard.writeText(referral?.referralCode)}
              className="bg-white/20 hover:bg-white/30 px-3 py-1 rounded-lg text-sm"
            >
              Copy
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl text-center">
              <p className="text-lg font-bold">{referral?.earnings ?? 0} SAR</p>
              <p className="text-xs opacity-70">Earnings</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl text-center">
              <p className="text-lg font-bold">{referral?.totalReferrals ?? 0}</p>
              <p className="text-xs opacity-70">Referrals</p>
            </div>
          </div>
        </div>
      </div>

      {/* 💳 الكريدت */}
      <div className="bg-white p-6 rounded-2xl shadow">
        <h2 className="text-xl font-bold">رصيدك الحالي</h2>
        <p className="text-3xl font-extrabold text-green-600">
          {user.credits} كريدت
        </p>
        <button className="mt-3 px-4 py-2 bg-blue-500 text-white rounded-lg">
          اشتر المزيد
        </button>
      </div>

      {/* 🛠️ الخدمات */}
      <div className="grid grid-cols-2 gap-4">
        <ServiceCard title="توليد صور" link="/dashboard/images" />
        <ServiceCard title="توليد فيديو" link="/dashboard/videos" />
        <ServiceCard title="توليد صوت TTS" link="/dashboard/tts" />
        <ServiceCard title="القوالب الإعلانية" link="/dashboard/templates" />
      </div>

      {/* 📅 الجدولة */}
      <div className="bg-white p-6 rounded-2xl shadow">
        <h2 className="text-xl font-bold">الجدولة 📅</h2>
        {schedules.length === 0 ? (
          <p className="text-gray-500">لا توجد منشورات مجدولة</p>
        ) : (
          <ul className="space-y-2">
            {schedules.map((s, i) => (
              <li key={i} className="border-b pb-2">
                {s.content} – {new Date(s.date).toLocaleString()} –{" "}
                {s.requireApproval ? "✅ يتطلب موافقة" : "🚀 تلقائي"}
              </li>
            ))}
          </ul>
        )}
        <button className="mt-3 px-4 py-2 bg-purple-500 text-white rounded-lg">
          أضف منشور
        </button>
      </div>

      {/* 🎨 القوالب */}
      <div className="bg-white p-6 rounded-2xl shadow">
        <h2 className="text-xl font-bold">قوالبك الإعلانية 🎨</h2>
        {templates.length === 0 ? (
          <p className="text-gray-500">لا توجد قوالب محفوظة</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {templates.map((t, i) => (
              <div
                key={i}
                className="p-4 border rounded-lg shadow hover:shadow-lg"
              >
                <p className="font-medium">{t.prompt}</p>
                <img src={t.imageUrl} alt="template" className="rounded mt-2" />
              </div>
            ))}
          </div>
        )}
        <Link href="/dashboard/templates">
          <button className="mt-3 px-4 py-2 bg-indigo-500 text-white rounded-lg">
            إنشاء قالب جديد
          </button>
        </Link>
      </div>

      {/* 💰 السحب */}
      <div className="bg-white p-6 rounded-2xl shadow">
        <h2 className="text-xl font-bold">سحب الرصيد 💰</h2>
        {withdrawals.length === 0 ? (
          <p className="text-gray-500">لا توجد طلبات سحب</p>
        ) : (
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b">
                <th className="p-2">المبلغ</th>
                <th className="p-2">الطريقة</th>
                <th className="p-2">الحالة</th>
              </tr>
            </thead>
            <tbody>
              {withdrawals.map((w, i) => (
                <tr key={i} className="border-b hover:bg-gray-50">
                  <td className="p-2">{w.amount} ريال</td>
                  <td className="p-2">{w.method}</td>
                  <td className="p-2">{w.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <button className="mt-3 px-4 py-2 bg-green-500 text-white rounded-lg">
          اطلب سحب
        </button>
      </div>
    </div>
  );
}

function ServiceCard({ title, link }: { title: string; link: string }) {
  return (
    <div className="bg-gray-100 p-6 rounded-xl shadow hover:shadow-lg transition">
      <h3 className="text-lg font-semibold">{title}</h3>
      <Link href={link}>
        <button className="mt-2 px-3 py-1 bg-indigo-500 text-white rounded-lg">
          ابدأ
        </button>
      </Link>
    </div>
  );
}
