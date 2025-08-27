import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const totalUsers = await prisma.user.count();
    const totalEarnings = await prisma.user.aggregate({
      _sum: { earnings: true },
    });
    const totalWithdrawals = await prisma.withdrawalRequest.count();
    const totalCredits = await prisma.user.aggregate({
      _sum: { credits: true },
    });

    return NextResponse.json({
      totalUsers,
      totalEarnings: totalEarnings._sum.earnings || 0,
      totalWithdrawals,
      totalCredits: totalCredits._sum.credits || 0,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
