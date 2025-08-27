import ffmpeg from "fluent-ffmpeg";
import ffmpegPath from "ffmpeg-static";
import path from "path";

// نحدد مكان ffmpeg من المكتبة الجاهزة
ffmpeg.setFfmpegPath(ffmpegPath as string);

/**
 * دمج مجموعة فيديوهات في فيديو واحد
 */
export async function mergeVideos(videoPaths: string[], outputPath: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const command = ffmpeg();

    // نضيف كل الفيديوهات للإدخال
    videoPaths.forEach((video) => command.input(video));

    // نشغل ffmpeg
    command
      .on("end", () => resolve(outputPath))
      .on("error", (err) => reject(err))
      .mergeToFile(outputPath, path.dirname(outputPath));
  });
}

/**
 * نسخة بنفس الاسم القديم (للتوافقية)
 */
export async function mergeVideosWithTransition(videoPaths: string[], outputPath: string): Promise<string> {
  return mergeVideos(videoPaths, outputPath);
}
