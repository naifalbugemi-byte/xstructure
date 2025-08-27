import { NextResponse } from "next/server";
import OpenAI from "openai";
import prisma from "@/lib/prisma";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: Request) {
  try {
    const { userId, topic, scheduleDate, requireApproval } = await req.json();

    // ✅ توليد Captions + Hashtags
    const ai = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a social media content generator." },
        { role: "user", content: `Generate a caption + hashtags for topic: ${topic}` },
      ],
    });

    const result = ai.choices[0].message?.content || "No result";

    // ✅ حفظ في جدول الـ Schedule
    const scheduled = await prisma.schedule.create({
      data: {
        userId,
        content: result,
        date: new Date(scheduleDate),
        requireApproval,
      },
    });

    return NextResponse.json({ success: true, scheduled });
  } catch (err) {
    console.error("Content Agent error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
