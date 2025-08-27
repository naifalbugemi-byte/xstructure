import prisma from "@/lib/prisma";

export async function deductCredits(userId: string, amount: number, action: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user || user.credits < amount) {
    throw new Error("Not enough credits");
  }

  await prisma.user.update({
    where: { id: userId },
    data: { credits: { decrement: amount } },
  });

  await prisma.creditLog.create({
    data: { userId, action, amount: -amount },
  });

  return true;
}

export async function addCredits(userId: string, amount: number, action: string) {
  await prisma.user.update({
    where: { id: userId },
    data: { credits: { increment: amount } },
  });

  await prisma.creditLog.create({
    data: { userId, action, amount },
  });

  return true;
}
