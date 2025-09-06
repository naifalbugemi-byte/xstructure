import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET!;

export async function POST(req: NextRequest) {
  try {
    // ✅ جلب الكوكي
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // ✅ تحقق من JWT
    let payload: any;
    try {
      payload = jwt.verify(token, ACCESS_SECRET);
    } catch (err) {
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 });
    }

    const userId = payload.id;
    if (!userId) {
      return NextResponse.json({ error: "Invalid user" }, { status: 400 });
    }

    // ✅ استلام البيانات
    const { method, bankName, iban, swift, country, payoneerEmail, payoneerPhone } =
      await req.json();

    if (!method || !["iban", "payoneer"].includes(method)) {
      return NextResponse.json({ error: "Invalid payment method" }, { status: 400 });
    }

    // ✅ تجهيز التفاصيل كـ JSON
    let details: Record<string, any> = {};
    if (method === "iban") {
      if (!iban || !bankName || !country) {
        return NextResponse.json(
          { error: "Bank name, IBAN, and country are required" },
          { status: 400 }
        );
      }
      details = { bankName, iban, swift, country };
    } else if (method === "payoneer") {
      if (!payoneerEmail) {
        return NextResponse.json(
          { error: "Payoneer email is required" },
          { status: 400 }
        );
      }
      details = { payoneerEmail, payoneerPhone };
    }

    // ✅ احفظ في قاعدة البيانات
    const payout = await prisma.withdrawalRequest.create({
      data: {
        userId,
        method,
        details: JSON.stringify(details),
        amount: 0, // مبدئيًا بدون مبلغ
        status: "pending",
      },
    });

    return NextResponse.json({ success: true, payout });
  } catch (err: any) {
    console.error("Payout setup error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
