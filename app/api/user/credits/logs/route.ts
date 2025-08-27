import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getUserFromToken } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const user = await getUserFromToken(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const logs = await prisma.creditLog.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      take: 50, // نعرض آخر 50 عملية
    });

    return NextResponse.json(logs);
  } catch (error) {
    console.error("Credit logs error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
