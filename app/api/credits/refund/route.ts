import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function POST() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // ???? ?? ??????? ????????
    const usage = await prisma.creditsUsage.findFirst({
      where: { userId: user.id },
    });

    if (usage) {
      return NextResponse.json(
        { error: "??? ??????? ??????? ?? ????? ??? ?????????" },
        { status: 400 }
      );
    }

    // ??????? ???????? ????? ???????
    const updated = await prisma.user.update({
      where: { id: user.id },
      data: { credits: 0 },
    });

    return NextResponse.json({ success: true, refunded: updated.credits });
  } catch (err) {
    return NextResponse.json(
      { error: "Server error: " + (err as Error).message },
      { status: 500 }
    );
  }
}
