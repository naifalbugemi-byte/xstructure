import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "Missing userId" }, { status: 400 });
  }

  // جلب بيانات المستخدم
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      referralCode: true,
      earnings: true,
    },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  // حساب عدد الأشخاص اللي استخدموا الكود
  let totalReferrals = 0;
  if (user.referralCode) {
    totalReferrals = await prisma.referralUsage.count({
      where: { referrerId: userId },
    });
  }

  return NextResponse.json({
    referralCode: user.referralCode,
    earnings: user.earnings,
    totalReferrals,
  });
}
