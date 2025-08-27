import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { projectId, email } = await req.json();

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    // لو مو مسجل → نرسل له رابط signup مع projectId
    return NextResponse.json({ inviteUrl: `/signup?invite=${projectId}` });
  }

  // لو مسجل → نضيفه مباشرة
  const member = await prisma.projectMember.create({
    data: { projectId, userId: user.id, role: "editor" }
  });

  return NextResponse.json({ success: true, member });
}
