"use client";

import { useEffect, useState } from "react";

export default function VideoEditor({ searchParams }: { searchParams: { id: string } }) {
  const [project, setProject] = useState<any>(null);
  const [clips, setClips] = useState<any[]>([]);
  const [logo, setLogo] = useState<File | null>(null);
  const [text, setText] = useState("");
  const [color, setColor] = useState("#ffffff");

  useEffect(() => {
    fetch(`/api/videos/list?id=${searchParams.id}`)
      .then((res) => res.json())
      .then((data) => {
        setProject(data.project);
        setClips(data.clips);
        setText(data.project?.text || "");
        setColor(data.project?.color || "#ffffff");
      });
  }, [searchParams.id]);

  const handleSave = async () => {
    const logoUrl = logo ? URL.createObjectURL(logo) : project.logoUrl;

    await fetch("/api/videos/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: project.id,
        title: project.title,
        logoUrl,
        text,
        color,
      }),
    });

    alert("✅ تم الحفظ");
  };

  const addClip = async (file: File) => {
    const clipUrl = URL.createObjectURL(file);

    const res = await fetch("/api/videos/add-clip", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        projectId: project.id,
        videoUrl: clipUrl,
        order: clips.length + 1,
      }),
    });

    const newClip = await res.json();
    setClips([...clips, newClip]);
  };

  if (!project) return <div className="p-6">جاري التحميل...</div>;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-bold mb-4">محرر الفيديو 🎬</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* المعاينة */}
        <div className="bg-black relative rounded-xl overflow-hidden h-[400px] flex justify-center items-center">
          {clips.length > 0 ? (
            <video
              src={clips[0].videoUrl}
              controls
              className="w-full h-full object-cover"
            />
          ) : (
            <p className="text-white">🚀 لا يوجد مقاطع بعد</p>
          )}

          {logo && (
            <img
              src={URL.createObjectURL(logo)}
              alt="Logo"
              className="absolute top-4 left-4 w-20 h-20 object-contain"
            />
          )}
          {text && (
            <span
              style={{ color }}
              className="absolute bottom-4 text-2xl font-bold drop-shadow-lg"
            >
              {text}
            </span>
          )}
        </div>

        {/* الإعدادات */}
        <div className="space-y-4 bg-white p-6 rounded-xl shadow">
          <div>
            <label className="block font-medium">العنوان</label>
            <input
              type="text"
              value={project.title}
              onChange={(e) => setProject({ ...project, title: e.target.value })}
              className="w-full border rounded-lg p-2"
            />
          </div>

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
              className="w-16 h-10 border rounded-lg"
            />
          </div>

          <div>
            <label className="block font-medium">إضافة مقطع فيديو</label>
            <input type="file" accept="video/*" onChange={(e) => e.target.files && addClip(e.target.files[0])} />
          </div>

          <button
            onClick={handleSave}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg"
          >
            حفظ التعديلات
          </button>
        </div>
      </div>

      {/* التايملاين */}
      <div className="mt-8 bg-white p-6 rounded-xl shadow">
        <h3 className="font-semibold mb-4">المقاطع 🎞️</h3>
        {clips.length === 0 ? (
          <p className="text-gray-500">لا يوجد مقاطع بعد</p>
        ) : (
          <ul className="space-y-2">
            {clips.map((c, i) => (
              <li key={i} className="p-3 border rounded-lg flex justify-between items-center">
                <span>🎬 Clip {i + 1}</span>
                <video src={c.videoUrl} className="w-32 h-20 object-cover rounded" controls />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
<button
  onClick={async () => {
    const res = await fetch("/api/videos/export", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ projectId: project.id }),
    });

    const data = await res.json();
    if (res.ok) {
      alert("✅ تم تصدير الفيديو!");
      window.open(data.url, "_blank");
    } else {
      alert("❌ فشل التصدير: " + data.error);
    }
  }}
  className="mt-6 px-6 py-3 bg-green-600 text-white rounded-lg"
>
  ⬇️ تصدير الفيديو النهائي
</button>
