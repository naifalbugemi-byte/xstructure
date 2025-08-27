import { prisma } from "@/lib/prisma";

export async function saveIntegration(userId: string, platform: string, token: string, refresh?: string, expiresAt?: Date) {
  return prisma.userIntegration.upsert({
    where: { userId_platform: { userId, platform } }, // Composite key لازم نضيفه بالسكيمة
    update: { token, refresh, expiresAt },
    create: { userId, platform, token, refresh, expiresAt },
  });
}

export async function removeIntegration(userId: string, platform: string) {
  return prisma.userIntegration.deleteMany({
    where: { userId, platform },
  });
}

export async function getIntegration(userId: string, platform: string) {
  return prisma.userIntegration.findUnique({
    where: { userId_platform: { userId, platform } },
  });
}
