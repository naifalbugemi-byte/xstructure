"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import Button from "@/components/ui/Button";

export default function AIPlayground() {
  const [prompt, setPrompt] = useState("");
  const [type, setType] = useState<"image" | "video" | "brand" | "copy">(
    "image"
  );
  const [result, setResult] = useState("");

  const generate = async () => {
    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, prompt }),
      });
      const data = await res.json();
      setResult(data.result);
    } catch (err) {
      console.error("AI generation failed", err);
      setResult("❌ حدث خطأ أثناء التنفيذ");
    }
  };

  return (
    <section className="relative z-10 py-20 bg-gray-900">
      <motion.h2
        className="text-3xl font-bold text-center mb-10 text-indigo-400"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
      >
        ✨ جرّب قوة Xstructure AI الآن
      </motion.h2>

      <div className="max-w-3xl mx-auto bg-gray-800 p-8 rounded-2xl shadow-xl space-y-6">
        {/* مربع الإدخال */}
        <textarea
          placeholder="اكتب فكرتك هنا…"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="w-full p-4 rounded-xl bg-gray-700 text-white border border-gray-600"
        />

        {/* تبويبات لاختيار نوع النتيجة */}
        <div className="flex gap-4 justify-center flex-wrap">
          {["image", "video", "brand", "copy"].map((t) => (
            <Button
              key={t}
              onClick={() => setType(t as any)}
              className={`px-4 py-2 ${
                type === t ? "bg-indigo-600" : "bg-gray-600"
              }`}
            >
              {t === "image" && "🖼️ صورة"}
              {t === "video" && "🎬 فيديو"}
              {t === "brand" && "🎨 لوجو/هوية"}
              {t === "copy" && "✍️ إعلان"}
            </Button>
          ))}
        </div>

        {/* زر التنفيذ */}
        <Button
          onClick={generate}
          className="w-full py-3 text-lg bg-cyan-500 hover:bg-cyan-600"
        >
          🚀 أنشئ الآن
        </Button>

        {/* النتيجة */}
        <div className="mt-6 bg-gray-700 p-4 rounded-xl text-center">
          {result ? (
            type === "image" ? (
              <img
                src={result}
                alt="AI Result"
                className="rounded-xl mx-auto max-h-[400px] object-contain"
              />
            ) : (
              <p className="text-white whitespace-pre-line">{result}</p>
            )
          ) : (
            <p className="text-gray-400">✨ النتيجة ستظهر هنا...</p>
          )}
        </div>
      </div>
    </section>
  );
}
