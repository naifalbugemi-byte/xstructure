// app/api/withdrawals/request/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { userId, method, details, amount } = await req.json();

    const request = await prisma.withdrawalRequest.create({
      data: { userId, method, details, amount },
    });

    return NextResponse.json({ success: true, request });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
