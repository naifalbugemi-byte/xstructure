// app/api/socials/instagram/publish/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getUserFromAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { caption, mediaUrl } = await req.json();
    const user = await getUserFromAuth(req);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const integration = await prisma.userIntegration.findUnique({
      where: { userId_platform: { userId: user.id, platform: "instagram" } },
    });
    if (!integration) return NextResponse.json({ error: "Instagram not linked" }, { status: 403 });

    const res = await fetch(`https://graph.facebook.com/v17.0/me/media`, {
      method: "POST",
      headers: { Authorization: `Bearer ${integration.token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ caption, video_url: mediaUrl }),
    });

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
