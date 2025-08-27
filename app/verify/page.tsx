"use client";

import { useState } from "react";

export default function VerifyPage() {
  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const res = await fetch("/api/auth/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code }),
    });
    const data = await res.json();
    setMessage(data.message);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-lg">
        <h2 className="text-xl font-bold mb-4">Enter Verification Code</h2>
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="border p-2 w-full mb-4"
          placeholder="123456"
        />
        <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded">
          Verify
        </button>
        {message && <p className="mt-4">{message}</p>}
      </form>
    </div>
  );
}
