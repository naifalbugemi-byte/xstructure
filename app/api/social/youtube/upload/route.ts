import { NextRequest, NextResponse } from "next/server";
import { google } from "googleapis";
import fs from "fs";
import { getUserFromAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs"; // ✅ مهم عشان نستخدم fs

export async function POST(req: NextRequest) {
  try {
    const { title, description, filePath } = await req.json();

    // ✅ تحقق من المستخدم
    const user = await getUserFromAuth(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // ✅ جلب Integration من DB
    const integration = await prisma.userIntegration.findUnique({
      where: { userId_platform: { userId: user.id, platform: "youtube" } },
    });

    if (!integration) {
      return NextResponse.json({ error: "YouTube account not linked" }, { status: 403 });
    }

    const youtube = google.youtube({
      version: "v3",
      auth: integration.token, // ✅ نستعمل الـ token من DB
    });

    const res = await youtube.videos.insert({
      part: ["snippet", "status"],
      requestBody: {
        snippet: { title, description },
        status: { privacyStatus: "public" },
      },
      media: {
        body: fs.createReadStream(filePath),
      },
    });

    return NextResponse.json({ success: true, video: res.data });
  } catch (err: any) {
    // ✅ نسجل الخطأ في IntegrationErrorLog
    await prisma.integrationErrorLog.create({
      data: {
        platform: "youtube",
        errorMsg: err.message,
        payload: {},
      },
    });

    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
