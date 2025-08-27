import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { userId, name, desc } = await req.json();

  const project = await prisma.project.create({
    data: { userId, name, desc }
  });

  // إضافة المالك كعضو
  await prisma.projectMember.create({
    data: { projectId: project.id, userId, role: "owner" }
  });

  return NextResponse.json(project);
}
