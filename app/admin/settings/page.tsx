"use client";

import { useEffect, useState } from "react";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((res) => res.json())
      .then(setSettings);
  }, []);

  async function updateSettings(e: any) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const body = Object.fromEntries(formData.entries());

    await fetch("/api/admin/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    alert("✅ تم تحديث الإعدادات");
  }

  if (!settings) return <div className="p-6">جاري التحميل...</div>;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">⚙️ إعدادات المنصة</h1>

      <form onSubmit={updateSettings} className="space-y-4">
        <label className="block">
          <span className="text-sm font-medium">قيمة الكريدت (السعودية)</span>
          <input
            name="creditValueSAR"
            defaultValue={settings.creditValueSAR}
            type="number"
            step="0.01"
            className="w-full border p-2 rounded"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium">قيمة الكريدت (الخليج)</span>
          <input
            name="creditValueGCC"
            defaultValue={settings.creditValueGCC}
            type="number"
            step="0.01"
            className="w-full border p-2 rounded"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium">قيمة الكريدت (باقي العالم)</span>
          <input
            name="creditValueWorld"
            defaultValue={settings.creditValueWorld}
            type="number"
            step="0.01"
            className="w-full border p-2 rounded"
          />
        </label>

        <button className="px-4 py-2 bg-purple-600 text-white rounded-lg">💾 حفظ</button>
      </form>
    </div>
  );
}
