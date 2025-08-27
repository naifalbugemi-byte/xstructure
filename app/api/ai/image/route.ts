import { NextResponse } from "next/server";
import { generateImage } from "@/lib/ai";
import { deductCredits } from "@/lib/credits";

export async function POST(req: Request) {
  try {
    const { userId, prompt } = await req.json();

    // خصم كريدت
    await deductCredits(userId, 1);

    const url = await generateImage(prompt);

    return NextResponse.json({ success: true, url });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
