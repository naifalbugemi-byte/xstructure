import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// 🟢 جلب الإعدادات
export async function GET() {
  try {
    const settings = await prisma.adminSettings.findFirst();
    return NextResponse.json(settings || {});
  } catch (err) {
    console.error("Settings GET error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// 🟢 تعديل الإعدادات
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { allowAutoReferral, creditValueSAR, creditValueUSD } = body;

    let settings = await prisma.adminSettings.findFirst();

    if (settings) {
      settings = await prisma.adminSettings.update({
        where: { id: settings.id },
        data: { allowAutoReferral, creditValueSAR, creditValueUSD },
      });
    } else {
      settings = await prisma.adminSettings.create({
        data: { allowAutoReferral, creditValueSAR, creditValueUSD },
      });
    }

    return NextResponse.json({ success: true, settings });
  } catch (err) {
    console.error("Settings POST error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
