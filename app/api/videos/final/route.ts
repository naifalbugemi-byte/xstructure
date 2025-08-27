import { NextResponse } from "next/server";
import { mergeVideosWithTransition } from "@/lib/video-editor";
import { generateCaptions } from "@/lib/captions";
import { textToSpeech } from "@/lib/voice";
import { exec } from "child_process";
import util from "util";
const execPromise = util.promisify(exec);

export async function POST(req: Request) {
  try {
    const { clips, script } = await req.json(); 
    const outputPath = "/tmp/final.mp4";

    // 🟢 1. دمج الفيديوهات مع ترانزيشن
    const mergedPath = await mergeVideosWithTransition(clips, "/tmp/merged.mp4");

    // 🟢 2. توليد VoiceOver
    const voicePath = await textToSpeech(script, "/tmp/voice.mp3");

    // 🟢 3. استخراج Captions (من النص أو الصوت)
    const captionsPath = "/tmp/captions.srt";
    const captions = await generateCaptions(voicePath);
    await Bun.write(captionsPath, captions);

    // 🟢 4. دمج الكل مع ffmpeg
    const cmd = `ffmpeg -i ${mergedPath} -i ${voicePath} -vf subtitles=${captionsPath} -c:v libx264 -c:a aac ${outputPath}`;
    await execPromise(cmd);

    return NextResponse.json({ success: true, url: outputPath });
  } catch (err: any) {
    console.error("Final video error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
