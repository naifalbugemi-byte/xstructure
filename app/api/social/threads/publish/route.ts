// app/api/socials/threads/publish/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getUserFromAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json();
    const user = await getUserFromAuth(req);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const integration = await prisma.userIntegration.findUnique({
      where: { userId_platform: { userId: user.id, platform: "threads" } },
    });
    if (!integration) return NextResponse.json({ error: "Threads not linked" }, { status: 403 });

    const res = await fetch(`https://graph.threads.net/v1.0/me/threads`, {
      method: "POST",
      headers: { Authorization: `Bearer ${integration.token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });

    return NextResponse.json(await res.json());
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
