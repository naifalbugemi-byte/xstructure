import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const region = searchParams.get("region") || "WORLD";

  const settings = await prisma.adminSettings.findFirst();
  if (!settings) return NextResponse.json({ error: "Settings not found" }, { status: 404 });

  let price;
  if (region === "SA") price = settings.creditValueSAR;
  else if (["AE", "KW", "QA", "OM", "BH"].includes(region)) price = settings.creditValueGCC;
  else price = settings.creditValueWorld;

  return NextResponse.json({ region, price });
}
