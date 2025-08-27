import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { userId, type } = await req.json(); 
    // type = "image" | "video"
    const cost = type === "video" ? 5 : 1;

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (user.credits < cost) {
      return NextResponse.json({ error: "Not enough credits" }, { status: 400 });
    }

    const updated = await prisma.user.update({
      where: { id: userId },
      data: { credits: { decrement: cost } },
    });

    return NextResponse.json({ success: true, credits: updated.credits });
  } catch (err) {
    console.error("Credits error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
