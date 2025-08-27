import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET!;

export interface AuthUser {
  id: string;
  role: string;
}

// ✅ استخدام سريع: يرجع بيانات من التوكن بس
export function getUserFromRequest(req: NextRequest): AuthUser | null {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader) return null;

    const token = authHeader.split(" ")[1];
    if (!token) return null;

    const decoded = jwt.verify(token, ACCESS_SECRET) as AuthUser;
    return decoded;
  } catch {
    return null;
  }
}

// ✅ استخدام ثقيل: يرجع المستخدم من DB
export async function getUserFromAuth(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader) return null;

    const token = authHeader.split(" ")[1];
    if (!token) return null;

    const decoded = jwt.verify(token, ACCESS_SECRET) as { id: string };
    return await prisma.user.findUnique({ where: { id: decoded.id } });
  } catch {
    return null;
  }
}
