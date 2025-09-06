"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function PayoutSetupPage() {
  const [method, setMethod] = useState<"iban" | "payoneer" | "">("");
  const [form, setForm] = useState({
    bankName: "",
    iban: "",
    swift: "",
    country: "",
    payoneerEmail: "",
    payoneerPhone: "",
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/auth/payout-setup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ method, ...form }),
      });

      if (res.ok) {
        router.push("/dashboard");
      } else {
        const err = await res.json();
        alert(err.error || "Failed to save payout info");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 px-4">
      <div className="bg-slate-900/60 backdrop-blur-xl p-8 rounded-2xl shadow-xl w-full max-w-lg">
        <h1 className="text-2xl font-bold text-white text-center mb-6">
          Setup Your Payout Method
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* اختيار الوسيلة */}
          <div className="flex space-x-4 justify-center">
            <button
              type="button"
              onClick={() => setMethod("iban")}
              className={`px-4 py-2 rounded-lg ${
                method === "iban" ? "bg-blue-600 text-white" : "bg-slate-800 text-slate-300"
              }`}
            >
              Bank Transfer (IBAN)
            </button>
            <button
              type="button"
              onClick={() => setMethod("payoneer")}
              className={`px-4 py-2 rounded-lg ${
                method === "payoneer" ? "bg-blue-600 text-white" : "bg-slate-800 text-slate-300"
              }`}
            >
              Payoneer
            </button>
          </div>

          {/* IBAN Form */}
          {method === "iban" && (
            <>
              <input
                name="bankName"
                value={form.bankName}
                onChange={handleChange}
                placeholder="Bank Name"
                required
                className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white"
              />
              <input
                name="iban"
                value={form.iban}
                onChange={handleChange}
                placeholder="IBAN"
                required
                className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white"
              />
              <input
                name="swift"
                value={form.swift}
                onChange={handleChange}
                placeholder="SWIFT/BIC"
                className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white"
              />
              <input
                name="country"
                value={form.country}
                onChange={handleChange}
                placeholder="Bank Country"
                required
                className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white"
              />
            </>
          )}

          {/* Payoneer Form */}
          {method === "payoneer" && (
            <>
              <input
                name="payoneerEmail"
                type="email"
                value={form.payoneerEmail}
                onChange={handleChange}
                placeholder="Payoneer Account Email"
                required
                className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white"
              />
              <input
                name="payoneerPhone"
                value={form.payoneerPhone}
                onChange={handleChange}
                placeholder="Phone Number (as registered in Payoneer)"
                className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white"
              />
            </>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading || !method}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save & Continue"}
          </button>
        </form>
      </div>
    </div>
  );
}
