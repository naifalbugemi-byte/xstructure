import { NextResponse } from "next/server";
import OpenAI from "openai";
import fs from "fs";
import path from "path";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: Request) {
  try {
    const { text, voice } = await req.json();

    const response = await openai.audio.speech.create({
      model: "gpt-4o-mini-tts",
      voice: voice || "alloy",
      input: text,
    });

    const buffer = Buffer.from(await response.arrayBuffer());
    const filePath = path.join(process.cwd(), "public", `voice_${Date.now()}.mp3`);
    fs.writeFileSync(filePath, buffer);

    return NextResponse.json({ success: true, url: `/voice_${Date.now()}.mp3` });
  } catch (err) {
    console.error("Voice AI error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
