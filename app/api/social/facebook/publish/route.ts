// app/api/socials/facebook/publish/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getUserFromAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { pageId, message, link } = await req.json();
    const user = await getUserFromAuth(req);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const integration = await prisma.userIntegration.findUnique({
      where: { userId_platform: { userId: user.id, platform: "facebook" } },
    });
    if (!integration) return NextResponse.json({ error: "Facebook not linked" }, { status: 403 });

    const res = await fetch(`https://graph.facebook.com/${pageId}/feed`, {
      method: "POST",
      headers: { Authorization: `Bearer ${integration.token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ message, link }),
    });

    return NextResponse.json(await res.json());
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
