import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getUserFromToken } from "@/lib/auth";
import { sendEmail } from "@/lib/mailer"; // نفس اللي تستخدمه لإشعارات الريفرال

export async function POST(req: Request) {
  try {
    const user = await getUserFromToken(req);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { planId, details } = body;

    const plan = await prisma.plan.findUnique({ where: { id: planId } });
    if (!plan) {
      return NextResponse.json({ error: "Plan not found" }, { status: 404 });
    }

    // إنشاء الطلب
    const request = await prisma.planRequest.create({
      data: {
        planId,
        userId: user.id,
        details,
      },
      include: { user: true, plan: true },
    });

    // إرسال إيميل رسمي للأدمن
    await sendEmail({
      to: "care@xstructure.ai", // 📩 إيميل الدعم
      subject: `📩 طلب باقة جديد: ${request.plan.name}`,
      html: `
        <h2>طلب باقة جديد</h2>
        <p><b>المستخدم:</b> ${request.user.email}</p>
        <p><b>الباقة:</b> ${request.plan.name}</p>
        <p><b>التفاصيل:</b> ${details || "لا يوجد"}</p>
        <p><b>التاريخ:</b> ${new Date(request.createdAt).toLocaleString("ar-SA")}</p>
      `,
    });

    return NextResponse.json({ success: true, request });
  } catch (err) {
    console.error("Plan request error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
