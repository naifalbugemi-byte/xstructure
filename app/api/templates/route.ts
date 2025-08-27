import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { userId, prompt, imageUrl } = await req.json();

    const template = await prisma.template.create({
      data: { ownerId: userId, prompt, imageUrl },
    });

    return NextResponse.json({ success: true, template });
  } catch (err) {
    console.error("Template error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const templates = await prisma.template.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(templates);
  } catch (err) {
    console.error("Get templates error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
