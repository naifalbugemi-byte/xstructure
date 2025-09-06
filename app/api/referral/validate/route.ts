import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");

  if (!code) {
    return NextResponse.json({ valid: false }, { status: 400 });
  }

  try {
    // 🔎 تحقق من وجود الكود في جدول referral
    const referral = await prisma.referral.findUnique({
      where: { code }, // تأكد أن عندك عمود اسمه "code" في جدول referral
    });

    if (!referral) {
      return NextResponse.json({ valid: false });
    }

    // ✅ الكود صحيح
    return NextResponse.json({
      valid: true,
      owner: referral.userId, // ممكن ترجع معلومات إضافية لو حاب
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ valid: false }, { status: 500 });
  }
}
