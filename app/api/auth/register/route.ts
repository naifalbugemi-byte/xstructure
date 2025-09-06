// app/api/auth/register/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    const { fullName, email, password, referralCode } = await req.json();

    // أول حساب يصير Admin وما يحتاج referral
    const usersCount = await prisma.user.count();
    let role = "USER";
    if (usersCount === 0) {
      role = "ADMIN";
    } else {
      if (!referralCode) {
        return NextResponse.json({ error: "Referral code is required" }, { status: 400 });
      }

      const refOwner = await prisma.user.findUnique({
        where: { referralCode },
      });

      if (!refOwner) {
        return NextResponse.json({ error: "Invalid referral code" }, { status: 400 });
      }
    }

    // تحقق الإيميل
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ error: "Email already registered" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // إنشاء المستخدم بدون referralCode (لسه ما عنده كود خاص فيه)
    const newUser = await prisma.user.create({
      data: {
        name: fullName,
        email,
        password: hashedPassword,
        role,
      },
    });

    // إذا مو أول يوزر → نسجل العلاقة
    if (usersCount > 0 && referralCode) {
      const refOwner = await prisma.user.findUnique({ where: { referralCode } });

      if (refOwner) {
        await prisma.referralLog.create({
          data: {
            ownerId: refOwner.id,
            userId: newUser.id,
          },
        });

        // تحديث عدد الإحالات (earnings تتحدث شهريًا مع الاشتراك)
        await prisma.user.update({
          where: { id: refOwner.id },
          data: {
            referralsCount: { increment: 1 },
          },
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: "Account created successfully. Complete your subscription & payout setup.",
      user: {
        id: newUser.id,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
