import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { refreshToken } = await req.json();
    if (!refreshToken) {
      return NextResponse.json({ error: "Missing refresh token" }, { status: 400 });
    }

    // حذف Refresh Token من DB
    await prisma.refreshToken.deleteMany({
      where: { token: refreshToken },
    });

    return NextResponse.json({ success: true, message: "تم تسجيل الخروج" });

  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
