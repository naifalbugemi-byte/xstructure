import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { productId } = await req.json();

  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) return NextResponse.json({ error: "Product not found" }, { status: 404 });

  if (user.credits < product.priceCredits) {
    return NextResponse.json({ error: "Insufficient credits" }, { status: 400 });
  }

  // خصم نسبة المنصة
  const platformFee = Math.floor(product.priceCredits * 0.2); // 20%
  const sellerEarn = product.priceCredits - platformFee;

  // تحديث أرصدة
  await prisma.user.update({
    where: { id: user.id },
    data: { credits: { decrement: product.priceCredits } },
  });

  await prisma.user.update({
    where: { id: product.ownerId },
    data: { cashableCredits: { increment: sellerEarn } },
  });

  // إنشاء طلب شراء
  const order = await prisma.order.create({
    data: {
      productId: product.id,
      buyerId: user.id,
      creditsPaid: product.priceCredits,
      platformFee,
      sellerEarn,
    },
  });

  return NextResponse.json({ success: true, order });
}
