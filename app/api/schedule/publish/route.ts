// app/api/schedule/publish/route.ts
import { NextResponse } from "next/server";
import { jobQueue } from "@/lib/queue";

export async function POST(req: Request) {
  try {
    const { scheduleId } = await req.json();

    if (!scheduleId) {
      return NextResponse.json({ error: "scheduleId required" }, { status: 400 });
    }

    await jobQueue.add("publish", { scheduleId });

    return NextResponse.json({ success: true, message: "تمت إضافة الجدولة للكيو 🚀" });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
