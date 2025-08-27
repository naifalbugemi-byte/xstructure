// app/api/admin/withdrawals/update/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { id, status } = await req.json(); // id: طلب, status: approved | rejected | paid

    const updated = await prisma.withdrawalRequest.update({
      where: { id },
      data: { status },
    });

    return NextResponse.json({ success: true, updated });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
