import { NextResponse } from "next/server";
import { generateImage, editImage, generateVideo } from "@/lib/ai";

export async function POST(req: Request) {
  try {
    const { type, prompt, imageUrl } = await req.json();

    let result;
    if (type === "image") {
      result = await generateImage(prompt);
    } else if (type === "edit") {
      if (!imageUrl) throw new Error("imageUrl is required for edit");
      result = await editImage(imageUrl, prompt);
    } else if (type === "video") {
      result = await generateVideo(prompt);
    } else {
      throw new Error("Invalid type, must be 'image' | 'edit' | 'video'");
    }

    return NextResponse.json({ success: true, result });
  } catch (err: any) {
    console.error("AI API Error:", err.message);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
