"use client";

import { useState } from "react";

export default function ContactModal() {
  const [tab, setTab] = useState<"sales" | "support">("sales");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setStatus("");

    const form = e.currentTarget;
    const formData = {
      name: (form.elements.namedItem("name") as HTMLInputElement).value,
      email: (form.elements.namedItem("email") as HTMLInputElement).value,
      message: (form.elements.namedItem("message") as HTMLInputElement).value,
      type: tab,
    };

    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      setStatus("✅ Your message has been sent!");
      form.reset();
    } else {
      setStatus("❌ Something went wrong. Try again.");
    }
    setLoading(false);
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-50">
      <div className="bg-slate-900 rounded-2xl p-6 w-full max-w-lg border border-slate-700">
        {/* Tabs */}
        <div className="flex mb-6 border-b border-slate-700">
          <button
            className={`flex-1 py-2 font-semibold ${
              tab === "sales" ? "text-blue-400 border-b-2 border-blue-400" : "text-slate-400"
            }`}
            onClick={() => setTab("sales")}
          >
            Contact Sales
          </button>
          <button
            className={`flex-1 py-2 font-semibold ${
              tab === "support" ? "text-blue-400 border-b-2 border-blue-400" : "text-slate-400"
            }`}
            onClick={() => setTab("support")}
          >
            Support
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Your name"
            required
            className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white outline-none"
          />
          <input
            type="email"
            name="email"
            placeholder="Your email"
            required
            className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white outline-none"
          />
          <textarea
            name="message"
            rows={4}
            placeholder="Your message..."
            required
            className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white outline-none"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold hover:shadow-lg hover:shadow-blue-500/25 transition-all"
          >
            {loading ? "Sending..." : "Send Message"}
          </button>
        </form>

        {status && <p className="mt-4 text-center text-slate-300">{status}</p>}
      </div>
    </div>
  );
}
