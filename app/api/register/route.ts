import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";

export async function POST(req: Request) {
  try {
    const { email, password, name, referralCode, hasReferral } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "❌ Email and password required" }, { status: 400 });
    }

    // تحقق من المستخدم
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ error: "❌ User already exists" }, { status: 400 });
    }

    // جيب إعداد الأدمن
    const settings = await prisma.adminSettings.findFirst();
    const allowAutoReferral = settings?.allowAutoReferral ?? true;

    let finalReferralCode = referralCode;

    // إذا قال المستخدم "ما عندي كود" و الأدمن مفعل auto referral
    if (!referralCode && hasReferral === false && allowAutoReferral) {
      const randomReferral = await prisma.referral.findFirst();
      if (randomReferral) {
        finalReferralCode = randomReferral.code;
      }
    }

    // تشفير الباسورد
    const hashedPassword = await bcrypt.hash(password, 10);

    // إنشاء مستخدم جديد
    const newUser = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        referralCode: finalReferralCode || null,
      },
    });

    return NextResponse.json({
      success: true,
      message: "✅ User registered",
      user: { id: newUser.id, email: newUser.email, referralCode: finalReferralCode },
    });
  } catch (err: any) {
    console.error("❌ Register error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
