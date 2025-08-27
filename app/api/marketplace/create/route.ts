import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { title, description, type, priceCredits, fileUrl, thumbnailUrl } = await req.json();

  const product = await prisma.product.create({
    data: {
      title,
      description,
      type,
      priceCredits,
      fileUrl,
      thumbnailUrl,
      ownerId: user.id,
    },
  });

  return NextResponse.json(product);
}
