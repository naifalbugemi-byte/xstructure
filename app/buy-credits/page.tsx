"use client";

import { useState } from "react";

export default function BuyCreditsPage() {
  const [credits, setCredits] = useState(10);

  const handlePurchase = async () => {
    alert(`Pretend to buy ${credits} credits. (Payment not integrated yet)`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-2xl shadow p-8">
        <h2 className="text-2xl font-bold mb-6 text-center">Buy Credits</h2>

        <div className="space-y-4">
          <select
            value={credits}
            onChange={(e) => setCredits(Number(e.target.value))}
            className="w-full p-3 border rounded-xl"
          >
            <option value={10}>10 Credits – $5</option>
            <option value={50}>50 Credits – $20</option>
            <option value={150}>150 Credits – $50</option>
          </select>

          <button
            onClick={handlePurchase}
            className="w-full bg-green-600 hover:bg-green-700 text-white p-3 rounded-xl"
          >
            Purchase
          </button>
        </div>
      </div>
    </div>
  );
}
