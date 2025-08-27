import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const region = searchParams.get("region") || "WORLD";

  const plans = await prisma.plan.findMany();

  // إعادة صياغة السعر حسب المنطقة
  const formatted = plans.map((p) => {
    let price;
    if (region === "SA") price = p.priceSAR;
    else if (["AE", "KW", "QA", "OM", "BH"].includes(region)) price = p.priceGCC;
    else price = p.priceUSD;

    return {
      id: p.id,
      name: p.name,
      credits: p.credits,
      price,
      currency: region === "WORLD" ? "USD" : "SAR"
    };
  });

  return NextResponse.json(formatted);
}
