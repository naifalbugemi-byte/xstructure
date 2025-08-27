import { exec } from "child_process";
import util from "util";
const execPromise = util.promisify(exec);

// 🟢 دمج فيديوهات مع ترانزيشن Fade
export async function mergeVideosWithTransition(videos: string[], output: string) {
  // نصنع ملف نصي لـ ffmpeg
  const fileList = videos.map(v => `file '${v}'\ninpoint 0\noutpoint 5`).join("\n");
  const listPath = path.join(process.cwd(), "list.txt");
  await Bun.write(listPath, fileList);

  const cmd = `ffmpeg -f concat -safe 0 -i ${listPath} -filter_complex \
  "[0:v]fade=t=out:st=4:d=1[v0];[1:v]fade=t=in:st=0:d=1[v1]; \
  [v0][0:a][v1][1:a]concat=n=2:v=1:a=1[outv][outa]" \
  -map "[outv]" -map "[outa]" ${output}`;

  await execPromise(cmd);
  return output;
}
