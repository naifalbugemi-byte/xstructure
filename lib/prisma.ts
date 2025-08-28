import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient();
// دعم الاستدعاء كـ default
export default prisma;
