// app/api/referrals/create/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// دالة تتحقق أن الكود 10 خانات (حروف + أرقام)
function isValidReferral(code: string) {
  return /^[A-Za-z0-9]{10}$/.test(code);
}

export async function POST(req: NextRequest) {
  try {
    const { userId, referralCode } = await req.json();

    if (!userId || !referralCode) {
      return NextResponse.json({ error: "User ID and referral code are required" }, { status: 400 });
    }

    if (!isValidReferral(referralCode)) {
      return NextResponse.json({ error: "Referral code must be 10 characters (letters & numbers)" }, { status: 400 });
    }

    // تحقق إذا المستخدم موجود
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // تحقق إذا عنده كود من قبل
    if (user.referralCode) {
      return NextResponse.json({ error: "Referral code already exists for this user" }, { status: 400 });
    }

    // تحقق إذا الكود مستخدم من شخص ثاني
    const exists = await prisma.user.findUnique({ where: { referralCode } });
    if (exists) {
      return NextResponse.json({ error: "Referral code already taken" }, { status: 400 });
    }

    // تحديث المستخدم بالكود الجديد
    await prisma.user.update({
      where: { id: userId },
      data: { referralCode },
    });

    return NextResponse.json({
      success: true,
      message: "Referral code created successfully",
      referralCode,
    });

  } catch (err: any) {
    console.error("Referral create error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
