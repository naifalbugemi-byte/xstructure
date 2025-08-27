import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getUserFromToken } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const user = await getUserFromToken(req);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { method, details, amount } = body;

    if (!method || !details || !amount) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    // تأكد أن عنده أرباح كافية
    if (user.earnings < amount) {
      return NextResponse.json({ error: "Insufficient earnings" }, { status: 400 });
    }

    // تحقق من آخر سحب (14 يوم)
    const lastWithdraw = await prisma.withdrawalRequest.findFirst({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    });

    if (lastWithdraw) {
      const diffDays = (Date.now() - new Date(lastWithdraw.createdAt).getTime()) / (1000 * 60 * 60 * 24);
      if (diffDays < 14) {
        return NextResponse.json({ error: "You can only withdraw once every 14 days" }, { status: 400 });
      }
    }

    // إنشاء طلب جديد
    await prisma.withdrawalRequest.create({
      data: {
        userId: user.id,
        method,
        details,
        amount,
      },
    });

    // خصم من أرباحه
    await prisma.user.update({
      where: { id: user.id },
      data: { earnings: { decrement: amount } },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
