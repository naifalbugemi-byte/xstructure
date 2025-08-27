import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const referrals = await prisma.referral.findMany({
      include: {
        owner: { select: { email: true, country: true, region: true } }, // ✅ نجيب الدولة/المنطقة
        usages: true,
      },
      orderBy: { createdAt: "desc" },
    });

    const mapped = referrals.map(r => {
      // ✅ افتراض السعودية
      let rewardPerUser = 15;

      // ✅ GCC
      if (r.owner?.region === "GCC") rewardPerUser = 18;

      // ✅ World
      if (r.owner?.region === "World") rewardPerUser = 4;

      return {
        id: r.id,
        code: r.code,
        owner: r.owner?.email,
        region: r.owner?.region || "KSA",
        usersCount: r.usages.length,
        earnings: r.usages.length * rewardPerUser,
        createdAt: r.createdAt,
      };
    });

    return NextResponse.json(mapped);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
