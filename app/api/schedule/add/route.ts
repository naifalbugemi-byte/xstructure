import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { jobQueue } from "@/lib/queue";

export async function POST(req: NextRequest) {
  try {
    const { userId, content, date, platform } = await req.json();

    const schedule = await prisma.schedule.create({
      data: { userId, content, date: new Date(date), platform },
    });

    const delay = new Date(date).getTime() - Date.now();
    await jobQueue.add("publish", { scheduleId: schedule.id }, { delay });

    return NextResponse.json({ success: true, schedule });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
