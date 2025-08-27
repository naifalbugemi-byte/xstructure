import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { code } = await req.json();

  if (code === "123456") {
    return NextResponse.json({ success: true, message: "Email verified" });
  }

  return NextResponse.json({ error: "Invalid code" }, { status: 400 });
}
