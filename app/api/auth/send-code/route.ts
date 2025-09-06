import { NextRequest, NextResponse } from "next/server";
import { set } from "@/lib/redis";
import crypto from "crypto";
import { sendVerificationEmail } from "@/app/email";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // ✅ توليد كود 6 أرقام
    const code = crypto.randomInt(100000, 999999).toString();

    // ✅ تحديد مفتاح ثابت (case-insensitive)
    const key = `verify:${email.toLowerCase()}`;

    // ✅ حفظ الكود في Redis مع مدة صلاحية 5 دقائق
    await set(key, code, 300);

    // ✅ إرسال الكود بالإيميل
    await sendVerificationEmail(email, code);

    return NextResponse.json({
      success: true,
      message: "Verification code sent to your email",
    });
  } catch (err: any) {
    console.error("Send-code error:", err);
    return NextResponse.json({ error: "Failed to send verification code" }, { status: 500 });
  }
}
