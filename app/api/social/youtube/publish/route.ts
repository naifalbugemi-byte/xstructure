// app/api/socials/youtube/publish/route.ts
import { NextRequest, NextResponse } from "next/server";
import { google } from "googleapis";
import fs from "fs";
import { getUserFromAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const { title, description, filePath } = await req.json();
    const user = await getUserFromAuth(req);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const integration = await prisma.userIntegration.findUnique({
      where: { userId_platform: { userId: user.id, platform: "youtube" } },
    });
    if (!integration) return NextResponse.json({ error: "YouTube not linked" }, { status: 403 });

    const youtube = google.youtube({ version: "v3", auth: integration.token });
    const res = await youtube.videos.insert({
      part: ["snippet", "status"],
      requestBody: { snippet: { title, description }, status: { privacyStatus: "public" } },
      media: { body: fs.createReadStream(filePath) },
    });

    return NextResponse.json({ success: true, video: res.data });
  } catch (err: any) {
    await prisma.integrationErrorLog.create({ data: { platform: "youtube", errorMsg: err.message, payload: {} } });
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
