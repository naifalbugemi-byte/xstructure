import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    { message: "🚧 الدفع غير مفعّل حالياً. سيتم التفعيل قريباً." },
    { status: 200 }
  );
}

export async function POST() {
  return NextResponse.json(
    { error: "❌ الدفع غير متاح بعد. الرجاء المحاولة لاحقاً." },
    { status: 503 }
  );
}
