import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  const { userId, content, date, requireApproval } = await req.json();

  const schedule = await prisma.schedule.create({
    data: { userId, content, date: new Date(date), requireApproval },
  });

  return NextResponse.json({ success: true, schedule });
}
