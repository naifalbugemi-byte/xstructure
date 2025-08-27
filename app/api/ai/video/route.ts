import { NextResponse } from "next/server";
import { generateVideo } from "@/lib/ai";
import { deductCredits } from "@/lib/credits";

export async function POST(req: Request) {
  try {
    const { userId, prompt } = await req.json();

    // خصم 5 كريدت للفيديو
    await deductCredits(userId, 5);

    const url = await generateVideo(prompt);

    return NextResponse.json({ success: true, url });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
