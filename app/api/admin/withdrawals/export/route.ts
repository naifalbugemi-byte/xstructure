// app/api/admin/withdrawals/export/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const iban = await prisma.withdrawalRequest.findMany({ where: { method: "iban" } });
    const payoneer = await prisma.withdrawalRequest.findMany({ where: { method: "payoneer" } });

    return NextResponse.json({ iban, payoneer });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
