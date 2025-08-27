import { NextResponse } from "next/server";
import { generateCaptions } from "@/lib/captions";

export async function POST(req: Request) {
  try {
    const { audioPath } = await req.json();
    const srt = await generateCaptions(audioPath);
    return NextResponse.json({ success: true, captions: srt });
  } catch (err: any) {
    console.error("Captions error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
