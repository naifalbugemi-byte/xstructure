import { NextResponse } from "next/server";
import { getUserFromToken } from "@/lib/auth";
import { deductCredits } from "@/lib/credits";

export async function POST(req: Request) {
  try {
    const user = await getUserFromToken(req);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // خصم 2 كريدت
    await deductCredits(user.id, 2, "Create Template");

    // 🔥 كود إنشاء القالب
    return NextResponse.json({ success: true, templateId: "123" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
