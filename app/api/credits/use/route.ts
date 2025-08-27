// app/api/credits/use/route.ts
import { NextResponse } from "next/server";
import { deductCredits } from "@/lib/credits";

export async function POST(req: Request) {
  try {
    const { userId, type } = await req.json(); 
    // type = "image" (1 credit) or "video" (5 credits)
    const cost = type === "video" ? 5 : 1;

    await deductCredits(userId, cost);

    return NextResponse.json({ success: true, message: "✅ Credits deducted", cost });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
