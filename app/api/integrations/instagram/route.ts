import { NextRequest, NextResponse } from "next/server";
import { saveIntegration, removeIntegration } from "@/lib/integration";
import { getUserFromAuth } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const { token, refresh, expiresAt } = await req.json();
  const user = await getUserFromAuth(req);

  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const saved = await saveIntegration(user.id, "instagram", token, refresh, expiresAt ? new Date(expiresAt) : undefined);
  return NextResponse.json(saved);
}

export async function DELETE(req: NextRequest) {
  const user = await getUserFromAuth(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await removeIntegration(user.id, "instagram");
  return NextResponse.json({ success: true });
}
