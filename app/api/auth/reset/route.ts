import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { sendResetEmail } from "../../../../lib/email";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const resetLink = `https://xstructure.ai/reset?token=${user.id}`;
    await sendResetEmail(email, user.name, resetLink);

    return NextResponse.json({ success: true, message: "Reset link sent" });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
