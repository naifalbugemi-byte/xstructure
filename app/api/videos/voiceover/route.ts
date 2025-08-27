import { NextResponse } from "next/server";
import { textToSpeech } from "@/lib/voice";

export async function POST(req: Request) {
  try {
    const { script, filename } = await req.json();
    const path = `/tmp/${filename || "voice.mp3"}`;
    const audioPath = await textToSpeech(script, path);
    return NextResponse.json({ success: true, audioPath });
  } catch (err: any) {
    console.error("Voiceover error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
