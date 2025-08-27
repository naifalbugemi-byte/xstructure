import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    // 🔝 أكثر المستخدمين صرفًا
    const topUsers = await prisma.creditLog.groupBy({
      by: ["userId"],
      _sum: { amount: true },
      orderBy: { _sum: { amount: "asc" } }, // asc لأن الخصومات بالسالب
      take: 10,
    });

    const usersWithEmails = await Promise.all(
      topUsers.map(async (u) => {
        const user = await prisma.user.findUnique({ where: { id: u.userId } });
        return { email: user?.email, totalSpent: Math.abs(u._sum.amount || 0) };
      })
    );

    // 📊 أكثر الخدمات استهلاكًا
    const topServices = await prisma.creditLog.groupBy({
      by: ["action"],
      _sum: { amount: true },
      orderBy: { _sum: { amount: "asc" } },
      take: 10,
    });

    const servicesFormatted = topServices.map((s) => ({
      action: s.action,
      totalSpent: Math.abs(s._sum.amount || 0),
    }));

    // 📆 إجمالي الكريدت المصروف شهريًا
    const monthly = await prisma.$queryRaw<
      { month: string; total: number }[]
    >`
      SELECT 
        TO_CHAR("createdAt", 'YYYY-MM') as month,
        SUM(amount) as total
      FROM "CreditLog"
      WHERE amount < 0
      GROUP BY 1
      ORDER BY 1 DESC
      LIMIT 12;
    `;

    return NextResponse.json({
      topUsers: usersWithEmails,
      topServices: servicesFormatted,
      monthly: monthly.map((m) => ({
        month: m.month,
        total: Math.abs(Number(m.total)),
      })),
    });
  } catch (error) {
    console.error("Credit analytics error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
