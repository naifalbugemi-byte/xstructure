import { NextRequest, NextResponse } from "next/server";
import { get, del } from "@/lib/redis";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET!;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET!;

export async function POST(req: NextRequest) {
  try {
    const { email, code } = await req.json();
    if (!email || !code) {
      return NextResponse.json(
        { error: "Email and code are required" },
        { status: 400 }
      );
    }

    // ✅ جلب الكود من Redis
    const savedCode = await get(`verify:${email}`);
    if (!savedCode || savedCode !== code) {
      return NextResponse.json(
        { error: "Invalid or expired code" },
        { status: 400 }
      );
    }

    // ✅ حذف الكود بعد الاستخدام
    await del(`verify:${email}`);

    // ✅ باسورد افتراضي (لأن الحقل required في schema)
    const defaultPassword = await bcrypt.hash("x-no-pass", 10);

    // ✅ جلب أو إنشاء المستخدم
    const user = await prisma.user.upsert({
      where: { email },
      update: {},
      create: {
        email,
        role: "USER", // الافتراضي
        credits: 10,
        password: defaultPassword,
      },
    });

    // ✅ إنشاء Access Token
    const accessToken = jwt.sign(
      { id: user.id, role: user.role },
      ACCESS_SECRET,
      { expiresIn: "15m" }
    );

    // ✅ إنشاء Refresh Token
    const refreshToken = jwt.sign(
      { id: user.id, role: user.role },
      REFRESH_SECRET,
      { expiresIn: "7d" }
    );

    // ✅ تخزين Refresh Token في DB
    await prisma.refreshToken.create({
      data: {
        userId: user.id,
        token: refreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    // ✅ تجهيز الاستجابة مع Set-Cookie
    const res = NextResponse.json({
      success: true,
      role: user.role,
      user: {
        id: user.id,
        email: user.email,
      },
    });

    res.cookies.set("token", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      sameSite: "strict",
      maxAge: 60 * 15, // 15 minutes
    });

    res.cookies.set("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return res;

  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
