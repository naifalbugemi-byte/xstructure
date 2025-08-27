// app/api/socials/youtube/connect/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getUserFromAuth } from "@/lib/auth";
import { saveIntegration } from "@/lib/integration";

export async function POST(req: NextRequest) {
  try {
    const { accessToken, refreshToken, expiresAt } = await req.json();
    const user = await getUserFromAuth(req);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const saved = await saveIntegration(user.id, "youtube", accessToken, refreshToken, expiresAt ? new Date(expiresAt) : undefined);
    return NextResponse.json(saved);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
