import { NextResponse } from "next/server";
import { getUserFromToken } from "@/lib/auth";
import { deductCredits } from "@/lib/credits";

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();
    const user = await getUserFromToken(req);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await deductCredits(user.id, 5, "Generate Video");

    const res = await fetch("https://api.runwayml.com/v1/generations", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RUNWAY_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt,
        model: "gen2", // Runway Gen-2
        duration: 5,   // مدة الفيديو بالثواني
      }),
    });

    const data = await res.json();
    return NextResponse.json({ success: true, url: data.output_url });
  } catch (err: any) {
    console.error("Runway error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
