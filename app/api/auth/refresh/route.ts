import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET!;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET!;

export async function POST(req: NextRequest) {
  try {
    // ✅ جلب الريفريش توكن من الكوكي
    const refreshToken = req.cookies.get("refreshToken")?.value;
    if (!refreshToken) {
      return NextResponse.json({ error: "Missing refresh token" }, { status: 400 });
    }

    // ✅ التحقق من صلاحية Refresh Token
    const payload = jwt.verify(refreshToken, REFRESH_SECRET) as any;

    const tokenRecord = await prisma.refreshToken.findUnique({
      where: { token: refreshToken },
    });

    if (!tokenRecord || tokenRecord.expiresAt < new Date()) {
      return NextResponse.json({ error: "Refresh token expired" }, { status: 403 });
    }

    // ✅ إنشاء Access Token جديد
    const newAccessToken = jwt.sign(
      { id: payload.id, role: payload.role },
      ACCESS_SECRET,
      { expiresIn: "15m" }
    );

    // ✅ إرساله ككوكي جديد
    const res = NextResponse.json({ success: true });
    res.cookies.set("token", newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      sameSite: "strict",
      maxAge: 60 * 15, // 15 دقيقة
    });

    return res;

  } catch (err: any) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
