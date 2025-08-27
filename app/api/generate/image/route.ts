import { NextResponse } from "next/server";
import OpenAI from "openai";
import { getUserFromToken } from "@/lib/auth";
import { deductCredits } from "@/lib/credits";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();
    const user = await getUserFromToken(req);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await deductCredits(user.id, 1, "Generate Image");

    const result = await openai.images.generate({ model: "gpt-image-1", prompt, size: "1024x1024" });
    const url = result.data[0].url;

    return NextResponse.json({ success: true, url });
  } catch (err: any) {
    console.error("OpenAI error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
