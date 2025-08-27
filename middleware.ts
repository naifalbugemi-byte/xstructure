import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";
import { rateLimit } from "@/lib/rateLimit";

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET!;

export async function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  const { pathname } = url;

  // ✅ مسارات مفتوحة (مسموح الدخول بدون تحقق)
  if (
    pathname.startsWith("/api/auth") || // login / register / refresh
    pathname.startsWith("/_next") ||    // ملفات النظام
    pathname.startsWith("/public") ||   // الصور و الملفات العامة
    pathname === "/" ||                 // الصفحة الرئيسية
    pathname === "/contact" ||
    pathname === "/privacy" ||
    pathname === "/terms" ||
    pathname === "/pricing"             // صفحة الباقات
  ) {
    return NextResponse.next();
  }

  // ✅ جلب التوكن من الـ Header
  const authHeader = req.headers.get("authorization");
  if (!authHeader) {
    return redirectOrJson(req, "/login", { error: "Unauthorized" }, 401);
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return redirectOrJson(req, "/login", { error: "Invalid token" }, 401);
  }

  try {
    // ✅ فك التوكن
    const decoded = jwt.verify(token, ACCESS_SECRET) as { id: string; role: string };

    // ✅ تحقق من المستخدم
    const user = await prisma.user.findUnique({ where: { id: decoded.id } });
    if (!user) {
      return redirectOrJson(req, "/login", { error: "User not found" }, 404);
    }

    if (user.isBanned || user.isDeleted) {
      return redirectOrJson(req, "/banned", { error: "Account blocked" }, 403);
    }

    // ✅ تحقق من الاشتراك (لازم يكون عنده PlanRequest approved)
    const activePlan = await prisma.planRequest.findFirst({
      where: { userId: user.id, status: "approved" },
      include: { plan: true },
    });

    if (!activePlan) {
      return redirectOrJson(req, "/pricing", { error: "No active subscription" }, 403);
    }

    // ✅ Rate Limiting حسب الباقة
    const ip = req.ip ?? "unknown";
    const limit = activePlan.plan.requestLimit; // مثال: 100 أو 500
    const allowed = await rateLimit(ip, limit, 60);

    if (!allowed) {
      return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
    }

    // ✅ حماية مسارات الأدمن
    if (pathname.startsWith("/admin") && decoded.role !== "admin") {
      return redirectOrJson(req, "/dashboard", { error: "Admins only" }, 403);
    }

    // ✅ حماية مسارات اليوزر
    if (pathname.startsWith("/dashboard") && !["user", "admin"].includes(decoded.role)) {
      return redirectOrJson(req, "/login", { error: "Users only" }, 403);
    }

    // ✅ نجاح: السماح بتمرير الريكوست
    return NextResponse.next();

  } catch (err) {
    return redirectOrJson(req, "/login", { error: "Unauthorized or expired token" }, 401);
  }
}

// ✅ Helper: يقرر هل يرجع JSON (لو API) أو Redirect (لو صفحة)
function redirectOrJson(req: NextRequest, path: string, data: any, status: number) {
  if (req.nextUrl.pathname.startsWith("/api")) {
    return NextResponse.json(data, { status });
  } else {
    return NextResponse.redirect(new URL(path, req.url));
  }
}

// ✅ تحديد المسارات اللي يشملها الميدل وير
export const config = {
  matcher: [
    "/admin/:path*",
    "/dashboard/:path*",
    "/api/:path*",
  ],
};
