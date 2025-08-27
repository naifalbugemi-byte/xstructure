"use client";

import { useState } from "react";

export default function WithdrawPage() {
  const [method, setMethod] = useState("iban");
  const [details, setDetails] = useState("");
  const [amount, setAmount] = useState(0);
  const [message, setMessage] = useState("");

  const handleWithdraw = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/withdraw/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ method, details, amount }),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage("Withdrawal request submitted successfully!");
      } else {
        setMessage(data.error || "Failed to submit request");
      }
    } catch (err) {
      setMessage("Something went wrong");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-2xl shadow p-8">
        <h2 className="text-2xl font-bold mb-6 text-center">Withdraw Earnings</h2>

        <select
          value={method}
          onChange={(e) => setMethod(e.target.value)}
          className="w-full p-3 border rounded-xl mb-4"
        >
          <option value="iban">Bank Transfer (IBAN)</option>
          <option value="payoneer">Payoneer</option>
        </select>

        <input
          type="text"
          placeholder={method === "iban" ? "Enter IBAN" : "Enter Payoneer Email"}
          value={details}
          onChange={(e) => setDetails(e.target.value)}
          className="w-full p-3 border rounded-xl mb-4"
        />

        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          className="w-full p-3 border rounded-xl mb-4"
        />

        <button
          onClick={handleWithdraw}
          className="w-full bg-green-600 hover:bg-green-700 text-white p-3 rounded-xl"
        >
          Submit Request
        </button>

        {message && <p className="mt-4 text-center text-sm">{message}</p>}
      </div>
    </div>
  );
}
