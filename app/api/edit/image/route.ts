import { NextResponse } from "next/server";
import { getUserFromToken } from "@/lib/auth";
import { deductCredits } from "@/lib/credits";

export async function POST(req: Request) {
  try {
    const { prompt, imageUrl, maskUrl } = await req.json();
    const user = await getUserFromToken(req);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await deductCredits(user.id, 2, "Edit Image");

    const res = await fetch("https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/image-to-image", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.STABILITY_API_KEY}`,
        Accept: "application/json",
      },
      body: JSON.stringify({
        image: imageUrl,
        mask: maskUrl,
        prompt,
        output_format: "png",
      }),
    });

    const data = await res.json();
    return NextResponse.json({ success: true, url: data.output[0].url });
  } catch (err: any) {
    console.error("Stable Diffusion error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
