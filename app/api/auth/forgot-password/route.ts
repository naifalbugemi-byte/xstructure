import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";
import nodemailer from "nodemailer";

function wrapTemplate(title: string, body: string) {
  return `
    <div style="background:#0f172a;padding:40px 20px;font-family:Inter,Arial,sans-serif;color:#f1f5f9;">
      <div style="max-width:600px;margin:auto;background:#1e293b;border-radius:16px;overflow:hidden;border:1px solid rgba(59,130,246,0.3);">
        <div style="background:linear-gradient(to right,#3b82f6,#06b6d4);padding:20px;text-align:center;">
          <h1 style="margin:0;color:#fff;font-size:24px;font-weight:700;letter-spacing:1px;">Xstructure.ai</h1>
        </div>
        <div style="padding:30px;">
          <h2 style="color:#fff;font-size:22px;margin-bottom:20px;">${title}</h2>
          ${body}
        </div>
        <div style="background:#0f172a;padding:15px;text-align:center;font-size:12px;color:#94a3b8;">
          © ${new Date().getFullYear()} Xstructure.ai. All rights reserved.
        </div>
      </div>
    </div>
  `;
}

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    // ✅ تحقق من وجود المستخدم
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // ✅ أنشئ توكن عشوائي
    const token = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 1000 * 60 * 15); // 15 دقيقة

    // ✅ خزّنه في DB
    await prisma.passwordResetToken.create({
      data: { email, token, expiresAt: expires },
    });

    // ✅ رابط إعادة التعيين
    const resetLink = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}`;

    // ✅ إعداد SMTP عبر Office365
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_SERVER,
      port: Number(process.env.EMAIL_PORT) || 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // ✅ محتوى البريد (بالديزاين)
    const body = `
      <p>Hi <strong>${user.name || "there"}</strong>,</p>
      <p>We received a request to reset your password. Click the button below:</p>
      <p style="margin:30px 0;text-align:center;">
        <a href="${resetLink}"
           style="background:#dc2626;color:#fff;padding:12px 28px;
                  text-decoration:none;border-radius:8px;font-weight:600;">
          Reset Password
        </a>
      </p>
      <p style="color:#cbd5e1;">This link is valid for 15 minutes. If you didn’t request this, you can ignore this email.</p>
    `;

    // ✅ أرسل الإيميل
    const info = await transporter.sendMail({
      from: `"Xstructure.ai Care" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "🔒 Reset Your Xstructure.ai Password",
      html: wrapTemplate("Reset Your Password", body),
    });

    console.log("📩 Reset email sent:", info.messageId);

    return NextResponse.json({
      success: true,
      message: "Reset link sent to your email. Please check your inbox.",
    });
  } catch (err) {
    console.error("Forgot-password error:", err);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
