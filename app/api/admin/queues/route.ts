import { NextRequest, NextResponse } from "next/server";
import { jobQueue } from "@/lib/queue";

export async function GET(req: NextRequest) {
  const jobs = await jobQueue.getJobs(["waiting", "active", "completed", "failed"]);
  return NextResponse.json(jobs);
}
