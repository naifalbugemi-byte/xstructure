"use client";

import { useState } from "react";

export default function SupportPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("Sending...");

    try {
      const res = await fetch("/api/support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setStatus("✅ Message sent successfully!");
        setForm({ name: "", email: "", subject: "", message: "" });
      } else {
        setStatus("❌ Failed to send message.");
      }
    } catch (error) {
      setStatus("⚠️ Something went wrong.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 flex items-center justify-center px-6">
      <div className="glass-morphism rounded-2xl p-10 w-full max-w-2xl">
        <h1 className="text-3xl font-bold text-white text-center mb-6">Support & Care</h1>
        <p className="text-slate-300 text-center mb-8">
          Need help or have questions? Fill the form below and our Care team will get back to you shortly.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            value={form.name}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl bg-slate-900/50 border border-slate-700 focus:border-blue-400 focus:ring-1 focus:ring-blue-400 outline-none text-white placeholder-slate-400"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Your Email"
            value={form.email}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl bg-slate-900/50 border border-slate-700 focus:border-blue-400 focus:ring-1 focus:ring-blue-400 outline-none text-white placeholder-slate-400"
            required
          />
          <input
            type="text"
            name="subject"
            placeholder="Subject"
            value={form.subject}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl bg-slate-900/50 border border-slate-700 focus:border-blue-400 focus:ring-1 focus:ring-blue-400 outline-none text-white placeholder-slate-400"
            required
          />
          <textarea
            name="message"
            placeholder="Your Message"
            value={form.message}
            onChange={handleChange}
            className="w-full px-4 py-3 h-32 rounded-xl bg-slate-900/50 border border-slate-700 focus:border-blue-400 focus:ring-1 focus:ring-blue-400 outline-none text-white placeholder-slate-400"
            required
          ></textarea>

          <button
            type="submit"
            className="w-full px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold hover:shadow-lg hover:shadow-blue-500/25 transition-all"
          >
            Send Message
          </button>
        </form>

        {status && <p className="text-center text-slate-300 mt-4">{status}</p>}
      </div>
    </div>
  );
}
