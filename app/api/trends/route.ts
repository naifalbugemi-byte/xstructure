import { NextResponse } from "next/server";

export async function GET() {
  // 🔥 هنا مستقبلاً تربط مع TikTok API أو Twitter API
  const mockTrends = [
    { hashtag: "#BackToSchool", description: "محتوى العودة للمدارس", platform: "TikTok" },
    { hashtag: "#AIContent", description: "المحتوى بالذكاء الصناعي", platform: "Instagram" },
    { hashtag: "#SaudiVision2030", description: "رؤية السعودية 2030", platform: "X" },
  ];

  return NextResponse.json(mockTrends);
}
