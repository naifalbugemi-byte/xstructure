import { exec } from "child_process";
import util from "util";
const execPromise = util.promisify(exec);

// 🟢 دمج الفيديو مع الترجمة والصوت
export async function assembleFinalVideo(video: string, captions: string, voice: string, output: string) {
  const cmd = `ffmpeg -i ${video} -i ${voice} -vf subtitles=${captions} -c:v libx264 -c:a aac ${output}`;
  await execPromise(cmd);
  return output;
}
