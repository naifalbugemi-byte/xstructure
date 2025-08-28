"use client";

import { useEffect, useState } from "react";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function TemplateEditorPage({ params }: PageProps) {
  const { id } = await params;

  const [template, setTemplate] = useState<any>(null);
  const [logo, setLogo] = useState<File | null>(null);
  const [text, setText] = useState("");
  const [color, setColor] = useState("#000000");

  useEffect(() => {
    if (!id) return;

    fetch(`/api/templates/list?id=${id}`)
      .then((res) => res.json())
      .then((data) => {
        const t = data.find((d: any) => d.id === id);
        setTemplate(t);
        setText(t?.text || "");
        setColor(t?.color || "#000000");
      });
  }, [id]);

  const handleSave = async () => {
    const logoUrl = logo ? URL.createObjectURL(logo) : template.logoUrl;

    const res = await fetch("/api/templates/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: template.id,
        imageUrl: template.imageUrl,
        logoUrl,
        text,
        color,
      }),
    });

    const data = await res.json();
    alert("✅ تم الحفظ بنجاح");
    setTemplate(data);
  };

  if (!template) return <div className="p-6">جاري التحميل...</div>;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-bold mb-4">محرر القالب</h2>

      <div className="bg-white p-6 rounded-2xl shadow grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* المعاينة */}
        <div className="relative border rounded-xl p-4 flex justify-center items-center">
          <img src={template.imageUrl} alt="Template" className="rounded-lg max-h-[400px]" />
          {logo && (
            <img
              src={URL.createObjectURL(logo)}
              alt="Logo"
              className="absolute top-4 left-4 w-20 h-20 object-contain"
            />
          )}
          {text && (
            <span style={{ color }} className="absolute bottom-4 text-xl font-bold">
              {text}
            </span>
          )}
        </div>

        {/* الإعدادات */}
        <div className="space-y-4">
          <div>
            <label className="block font-medium">أضف شعار</label>
            <input type="file" onChange={(e) => setLogo(e.target.files?.[0] || null)} />
          </div>

          <div>
            <label className="block font-medium">النص</label>
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full border rounded-lg p-2"
            />
          </div>

          <div>
            <label className="block font-medium">لون النص</label>
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="w-16 h-10 p-1 border rounded-lg"
            />
          </div>

          <button
            onClick={handleSave}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg"
          >
            حفظ التعديلات
          </button>
        </div>
      </div>
    </div>
  );
}
