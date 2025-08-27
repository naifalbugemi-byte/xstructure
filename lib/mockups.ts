import sharp from "sharp";

export async function generateMockup(productImage: Buffer, mockupTemplate: Buffer) {
  // دمج صورة المنتج مع mockup جاهز (مثلاً كوب، تيشيرت)
  return await sharp(mockupTemplate)
    .composite([{ input: productImage, gravity: "center" }])
    .png()
    .toBuffer();
}
