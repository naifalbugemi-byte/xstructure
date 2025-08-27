import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const userId = req.headers.get("x-user-id"); // من الـ token
  const type = req.nextUrl.searchParams.get("type"); // فلترة اختيارية

  const notifs = await prisma.notification.findMany({
    where: {
      OR: [{ userId }, { userId: null }], // إشعارات خاصة + عامة
      ...(type ? { type } : {}),
    },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return NextResponse.json(notifs);
}
