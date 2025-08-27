import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { projectId, userId, content, platform, date } = await req.json();

  const schedule = await prisma.schedule.create({
    data: { projectId, userId, content, platform, date: new Date(date) }
  });

  return NextResponse.json(schedule);
}
