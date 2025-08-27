import { NextRequest, NextResponse } from "next/server";
import { google } from "googleapis";

export async function POST(req: NextRequest) {
  const { accessToken, title, description, filePath } = await req.json();

  const youtube = google.youtube({ version: "v3", auth: accessToken });

  const res = await youtube.videos.insert({
    part: ["snippet", "status"],
    requestBody: {
      snippet: { title, description },
      status: { privacyStatus: "public" },
    },
    media: {
      body: require("fs").createReadStream(filePath),
    },
  });

  return NextResponse.json(res.data);
}
