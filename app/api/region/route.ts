import { NextResponse } from "next/server";

// مكتبة خارجية ممكن تستخدمها لاحقاً (geoip-lite أو ip2location)
// هنا بنستخدم placeholder للتجربة
export async function GET(req: Request) {
  const ip = req.headers.get("x-forwarded-for") || "8.8.8.8"; // 🔥 خذ IP الحقيقي بالسيرفر
  let region = "WORLD";

  // تبسيط: إذا الـ IP يبدأ بـ نطاق السعودية
  if (ip.startsWith("5.42") || ip.startsWith("2.92")) region = "SA";
  // الخليج (مجرد مثال)
  else if (ip.startsWith("94.") || ip.startsWith("185.")) region = "GCC";

  return NextResponse.json({ ip, region });
}
