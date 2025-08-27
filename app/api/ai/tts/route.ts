import { NextResponse } from "next/server";
import { generateSpeech } from "@/lib/tts";
import { deductCredits } from "@/lib/credits";

export async function POST(req: Request) {
  try {
    const { userId, text, voice } = await req.json();

    // خصم 2 كريدت لكل دقيقة صوتية
    await deductCredits(userId, 2);

    const audioPath = await generateSpeech(text, voice || "male");

    return NextResponse.json({ success: true, audio: audioPath });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
