"use client";
import { useState } from "react";

export default function ContactPage() {
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: any) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="p-10 max-w-3xl mx-auto text-gray-200">
      <h1 className="text-4xl font-bold mb-6 text-indigo-400">تواصل معنا</h1>
      {!sent ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" placeholder="الاسم" className="w-full p-3 rounded bg-gray-900 border border-gray-700"/>
          <input type="email" placeholder="البريد الإلكتروني" className="w-full p-3 rounded bg-gray-900 border border-gray-700"/>
          <textarea placeholder="رسالتك" className="w-full p-3 rounded bg-gray-900 border border-gray-700 h-32"/>
          <button type="submit" className="px-6 py-3 bg-indigo-600 rounded hover:bg-indigo-700">إرسال</button>
        </form>
      ) : (
        <p className="text-green-400">✅ تم إرسال رسالتك بنجاح. سنتواصل معك قريبًا.</p>
      )}
    </div>
  );
}
