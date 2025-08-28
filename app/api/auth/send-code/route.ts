import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { sendVerificationEmail } from "@/lib/mailer";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString(); // 6 digits

    await prisma.user.update({
      where: { email },
      data: { verificationCode: code },
    });

    await sendVerificationEmail(email, code);

    return NextResponse.json({ message: "Verification code sent" });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
