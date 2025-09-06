import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";
import { rateLimit } from "@/lib/rateLimit";

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET!;

export async function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  const { pathname } = url;

  // ✅ مسارات مفتوحة (بدون تحقق)
  if (
    pathname.startsWith("/api/auth") || // login / register / refresh
    pathname.startsWith("/_next") ||    // system
    pathname.startsWith("/public") ||   // ملفات عامة
    pathname === "/" || 
    pathname === "/contact" ||
    pathname === "/privacy" ||
    pathname === "/terms" ||
    pathname === "/public-pricing" // صفحة التسعير العامة
  ) {
    return NextResponse.next();
  }

  // ✅ جلب التوكن من الـ Cookies
  const token = req.cookies.get("token")?.value;
  console.log("🔑 Middleware Token:", token ? token.slice(0, 20) + "..." : "No Token");
  console.log("🔐 ACCESS_SECRET in middleware:", ACCESS_SECRET);

  if (!token) {
    return redirectOrJson(req, "/login", { error: "Unauthorized - No Token" }, 401);
  }

  try {
    // ✅ فك التوكن
    const decoded = jwt.verify(token, ACCESS_SECRET) as { id: string; role: string };
    console.log("✅ Decoded Token:", decoded);

    // ✅ تحقق من المستخدم
    const user = await prisma.user.findUnique({ where: { id: decoded.id } });
    if (!user) {
      return redirectOrJson(req, "/login", { error: "User not found" }, 404);
    }

    if (user.isBanned || user.isDeleted) {
      return redirectOrJson(req, "/banned", { error: "Account blocked" }, 403);
    }

    // ✅ تحقق من الاشتراك (لكن استثناء للأدمن)
    const activePlan = await prisma.planRequest.findFirst({
      where: { userId: user.id, status: "approved" },
      include: { plan: true },
    });

    if (!activePlan && user.role !== "ADMIN") {
      return redirectOrJson(req, "/public-pricing", { error: "No active subscription" }, 403);
    }

    // ✅ تحقق من الرصيد (credits) – الأدمن يتجاوز هذا بعد
    if (user.credits <= 0 && user.role !== "ADMIN") {
      return redirectOrJson(req, "/dashboard/buy-credits", { error: "No credits available" }, 402);
    }

    // ✅ Rate Limit حسب الباقة
    if (user.role !== "ADMIN") {
      const ip = req.headers.get("x-forwarded-for") || "unknown";
      const limit = activePlan?.plan.requestLimit ?? 100;
      const allowed = await rateLimit(ip, limit, 60);

      if (!allowed) {
        return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
      }
    }

    // ✅ حماية الأدمن
    if (pathname.startsWith("/admin") && decoded.role !== "ADMIN") {
      return redirectOrJson(req, "/dashboard", { error: "Admins only" }, 403);
    }

    // ✅ حماية المستخدم العادي
    if (pathname.startsWith("/dashboard") && !["USER", "ADMIN"].includes(decoded.role)) {
      return redirectOrJson(req, "/login", { error: "Users only" }, 403);
    }

    // ✅ نجاح
    return NextResponse.next();

  } catch (err: any) {
    console.error("❌ JWT Verify Error:", err.message);
    return redirectOrJson(req, "/login", { error: "Unauthorized or expired token" }, 401);
  }
}

// Helper
function redirectOrJson(req: NextRequest, path: string, data: any, status: number) {
  if (req.nextUrl.pathname.startsWith("/api")) {
    return NextResponse.json(data, { status });
  } else {
    return NextResponse.redirect(new URL(path, req.url));
  }
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/dashboard/:path*",
    "/api/:path*",
  ],
};
