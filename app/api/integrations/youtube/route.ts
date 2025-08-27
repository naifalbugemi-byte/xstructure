import { NextRequest, NextResponse } from "next/server";
import { saveIntegration, removeIntegration } from "@/lib/integration";
import { getUserFromAuth } from "@/lib/auth"; // دالة بسيطة تجيب userId من JWT

export async function POST(req: NextRequest) {
  try {
    const { token, refresh, expiresAt } = await req.json();
    const user = await getUserFromAuth(req);

    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const saved = await saveIntegration(user.id, "youtube", token, refresh, expiresAt ? new Date(expiresAt) : undefined);
    return NextResponse.json(saved);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const user = await getUserFromAuth(req);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await removeIntegration(user.id, "youtube");
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
