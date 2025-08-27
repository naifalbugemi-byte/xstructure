// app/api/schedule/create/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId, content, platform, date, requireApproval } = body;

    if (!userId || !content || !platform || !date) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const schedule = await prisma.schedule.create({
      data: {
        userId,
        content,
        platform, // youtube | instagram | facebook | threads
        date: new Date(date),
        requireApproval: requireApproval ?? false,
        status: "scheduled",
      },
    });

    return NextResponse.json({ success: true, schedule });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
