import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET!;

export interface AuthUser {
  id: string;
  role: string;
}

// الدوال الأصلية
export function getUserFromRequest(req: NextRequest): AuthUser | null {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader) return null;

    const token = authHeader.split(" ")[1];
    if (!token) return null;

    const decoded = jwt.verify(token, ACCESS_SECRET) as AuthUser;
    return decoded;
  } catch (err) {
    return null;
  }
}

export async function getUserFromAuth(token: string): Promise<AuthUser | null> {
  try {
    const decoded = jwt.verify(token, ACCESS_SECRET) as AuthUser;
    return decoded;
  } catch {
    return null;
  }
}

// alias للدوال الناقصة
export const getUserFromToken = getUserFromRequest;
export const getCurrentUser = getUserFromAuth;

export function signToken(payload: any) {
  return jwt.sign(payload, ACCESS_SECRET, { expiresIn: "1h" });
}
