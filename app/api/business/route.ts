import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { sendBusinessEmail } from "@/lib/mailer";

export async function POST(req: Request) {
  try {
    const { email, company, message } = await req.json();

    await prisma.businessRequest.create({
      data: { email, company, message },
    });

    await sendBusinessEmail(email, company);

    return NextResponse.json({ success: true, message: "Request received" });
  } catch (err: any) {
    return NextResponse.json({ error: "Request failed", details: err.message }, { status: 500 });
  }
}
