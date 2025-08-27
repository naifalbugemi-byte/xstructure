import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const { userId, type, title, message } = await req.json();

  const notif = await prisma.notification.create({
    data: { userId, type, title, message },
  });

  return NextResponse.json({ success: true, notif });
}
