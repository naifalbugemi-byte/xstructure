export function applyBranding(template: any, branding: { logoUrl?: string, primaryColor?: string, fontFamily?: string }) {
  return {
    ...template,
    logoUrl: branding.logoUrl || template.logoUrl,
    color: branding.primaryColor || template.color,
    font: branding.fontFamily || "Arial",
  };
}
import sharp from "sharp"; // مكتبة تعديل الصور

export async function applyBrandingToImage({
  baseImage,       // الصورة الأصلية (يولدها AI أو يرفعها المستخدم)
  templateOverlay, // ملف القالب (PNG شفاف فيه النصوص أو الإطار)
  logo,            // شعار المستخدم
  color,           // لون البراند
}: {
  baseImage: Buffer;
  templateOverlay?: Buffer;
  logo?: Buffer;
  color?: string;
}) {
  let img = sharp(baseImage);

  if (templateOverlay) {
    img = await img.composite([{ input: templateOverlay, gravity: "center" }]);
  }

  if (logo) {
    img = await img.composite([{ input: logo, gravity: "southeast" }]);
  }

  if (color) {
    img = await img.tint(color);
  }

  return await img.png().toBuffer();
}
