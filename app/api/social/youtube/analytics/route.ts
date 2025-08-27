// app/api/socials/youtube/analytics/route.ts
import { NextRequest, NextResponse } from "next/server";
import { google } from "googleapis";
import { getUserFromAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const user = await getUserFromAuth(req);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const integration = await prisma.userIntegration.findUnique({
      where: { userId_platform: { userId: user.id, platform: "youtube" } },
    });
    if (!integration) return NextResponse.json({ error: "YouTube not linked" }, { status: 403 });

    const youtube = google.youtube({ version: "v3", auth: integration.token });
    const res = await youtube.channels.list({
      part: ["statistics"],
      mine: true,
    });

    return NextResponse.json(res.data);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
