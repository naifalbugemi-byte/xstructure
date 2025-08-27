import { NextResponse } from "next/server";
import { generateVideo } from "@/lib/ai";
import { mergeVideos } from "@/lib/video-editor";
import { deductCredits } from "@/lib/credits";
import path from "path";

export async function POST(req: Request) {
  try {
    const { userId, prompts } = await req.json(); 
    // prompts = [ "مشهد1", "مشهد2", "مشهد3" ]

    // حساب الكريدتس (5 كريدت لكل مشهد)
    const totalCredits = prompts.length * 5;
    await deductCredits(userId, totalCredits);

    const videoPaths: string[] = [];

    for (let i = 0; i < prompts.length; i++) {
      const url = await generateVideo(prompts[i]);
      const localPath = path.resolve(`./tmp/video_${i}.mp4`);

      // تحميل الفيديو مؤقتاً
      const res = await fetch(url);
      const buffer = Buffer.from(await res.arrayBuffer());
      require("fs").writeFileSync(localPath, buffer);
      videoPaths.push(localPath);
    }

    const outputPath = path.resolve("./tmp/final_output.mp4");
    await mergeVideos(videoPaths, outputPath);

    return NextResponse.json({ success: true, video: "/tmp/final_output.mp4" });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
