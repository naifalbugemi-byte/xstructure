"use client";

import { useEffect, useState } from "react";

export default function ReferralCard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId"); // خزن userId وقت تسجيل الدخول
    if (!token || !userId) return;

    fetch(`/api/referral/summary?userId=${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((res) => {
        setData(res);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="p-6 bg-gradient-to-r from-gray-800 to-gray-900 rounded-2xl shadow-lg animate-pulse text-white">
        <p>Loading referral stats...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-6 bg-red-600 rounded-2xl shadow-lg text-white">
        <p>Error loading referral data</p>
      </div>
    );
  }

  return (
    <div className="p-6 rounded-2xl shadow-2xl bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-700 text-white relative overflow-hidden">
      {/* زخرفة خلفية */}
      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top_left,_var(--tw-gradient-stops))] from-pink-500 via-purple-500 to-blue-600"></div>

      {/* المحتوى */}
      <div className="relative z-10">
        <h2 className="text-2xl font-bold mb-2">Referral Program</h2>
        <p className="text-sm opacity-80 mb-4">
          شارك كودك الخاص واربح مع Xstructure
        </p>

        {/* الكود */}
        <div className="bg-black/30 border border-white/20 p-4 rounded-xl mb-4 flex justify-between items-center">
          <span className="font-mono text-lg">{data.referralCode || "N/A"}</span>
          <button
            onClick={() => navigator.clipboard.writeText(data.referralCode)}
            className="bg-white/20 hover:bg-white/30 px-3 py-1 rounded-lg text-sm"
          >
            Copy
          </button>
        </div>

        {/* الأرقام */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl text-center">
            <p className="text-lg font-bold">{data.earnings} SAR</p>
            <p className="text-xs opacity-70">Earnings</p>
          </div>

          <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl text-center">
            <p className="text-lg font-bold">{data.totalReferrals}</p>
            <p className="text-xs opacity-70">Referrals</p>
          </div>
        </div>
      </div>
    </div>
  );
}
