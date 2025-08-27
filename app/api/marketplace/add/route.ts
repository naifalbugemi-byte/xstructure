import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getUserFromToken } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const user = await getUserFromToken(req);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { title, description, previewUrl, fileUrl, price } = body;

    const item = await prisma.marketplaceItem.create({
      data: { title, description, previewUrl, fileUrl, price, ownerId: user.id },
    });

    return NextResponse.json(item);
  } catch (e) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
