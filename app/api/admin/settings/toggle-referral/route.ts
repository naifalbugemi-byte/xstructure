// app/api/admin/settings/toggle-referral/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST() {
  try {
    const current = await prisma.adminSettings.findFirst();
    if (!current) {
      const created = await prisma.adminSettings.create({
        data: { allowAutoReferral: false },
      });
      return NextResponse.json(created);
    }

    const updated = await prisma.adminSettings.update({
      where: { id: current.id },
      data: { allowAutoReferral: !current.allowAutoReferral },
    });

    return NextResponse.json(updated);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
