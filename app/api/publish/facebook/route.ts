import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { accessToken, pageId, caption, imageUrl } = await req.json();

  const res = await fetch(`https://graph.facebook.com/v18.0/${pageId}/photos`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url: imageUrl, caption, access_token: accessToken }),
  });

  const data = await res.json();
  return NextResponse.json(data);
}
