import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getUserFromToken } from "@/lib/auth";
import { applyBranding } from "@/lib/branding";

export async function POST(req: Request) {
  try {
    const user = await getUserFromToken(req);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { templateId } = await req.json();
    const template = await prisma.template.findUnique({ where: { id: templateId } });
    if (!template) return NextResponse.json({ error: "Template not found" }, { status: 404 });

    const branded = applyBranding(template, {
      logoUrl: user.logoUrl,
      primaryColor: user.brandColor,
      fontFamily: user.fontFamily,
    });

    return NextResponse.json({ success: true, template: branded });
  } catch (err) {
    console.error("Branding error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
