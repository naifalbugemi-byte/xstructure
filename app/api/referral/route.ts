// app/api/referrals/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  const referrals = await prisma.referral.findMany({
    where: { userId: userId || "" },
    include: {
      referralUsage: true,
    },
  });

  // نحسب الأرباح (مثلاً 15 ريال لكل مستخدم)
  const totalEarnings = referrals.reduce((sum, r) => sum + (r.referralUsage.length * 15), 0);

  return NextResponse.json({ referrals, totalEarnings });
}
