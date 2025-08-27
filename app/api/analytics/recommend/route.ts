import { NextResponse } from "next/server";

export async function GET() {
  // 🔥 هنا ممكن تربطها مع GPT-5 أو LLM يحلل أداء المستخدم
  const recommendations = [
    "✂️ قصّر النصوص الطويلة في الفيديوهات لزيادة التفاعل",
    "⏰ جرب نشر المحتوى الساعة 7 مساءً - وقت الذروة",
    "🎨 استخدم لون أحمر/برتقالي في الإعلانات لزيادة الانتباه",
  ];
  return NextResponse.json(recommendations);
}
