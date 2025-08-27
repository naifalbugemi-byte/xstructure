import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") || "";
  const type = searchParams.get("type") || "";

  const products = await prisma.product.findMany({
    where: {
      title: { contains: q, mode: "insensitive" },
      type: type ? type : undefined,
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(products);
}
