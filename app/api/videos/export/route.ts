import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getUserFromToken } from "@/lib/auth";
import { spawn } from "child_process";
import path from "path";
import fs from "fs";

export async function POST(req: Request) {
  try {
    const user = await getUserFromToken(req);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { projectId } = body;

    const project = await prisma.videoProject.findUnique({
      where: { id: projectId },
      include: { clips: { orderBy: { order: "asc" } } },
    });

    if (!project || project.ownerId !== user.id) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    if (project.clips.length === 0) {
      return NextResponse.json({ error: "No clips found" }, { status: 400 });
    }

    // مسارات المقاطع
    const clipPaths = project.clips.map((c) => c.videoUrl);

    // ملف تجميعي
    const fileListPath = path.join("/tmp", `clips_${project.id}.txt`);
    fs.writeFileSync(
      fileListPath,
      clipPaths.map((clip) => `file '${clip}'`).join("\n")
    );

    const outputPath = path.join("/tmp", `export_${project.id}.mp4`);

    // ⚡️ أوفرلاي: نصوص + لوغو
    const filters: string[] = [];

    if (project.logoUrl) {
      filters.push(`movie=${project.logoUrl}[logo];[0:v][logo]overlay=10:10`);
    }
    if (project.text) {
      filters.push(
        `drawtext=text='${project.text}':fontcolor=${project.color || "white"}:fontsize=36:x=(w-text_w)/2:y=h-80`
      );
    }

    const filterComplex = filters.length > 0 ? ["-vf", filters.join(",")] : [];

    // FFmpeg command
    await new Promise((resolve, reject) => {
      const ffmpeg = spawn("ffmpeg", [
        "-f", "concat",
        "-safe", "0",
        "-i", fileListPath,
        ...filterComplex,
        "-c:a", "copy",
        outputPath,
      ]);

      ffmpeg.stdout.on("data", (d) => console.log(d.toString()));
      ffmpeg.stderr.on("data", (d) => console.error(d.toString()));

      ffmpeg.on("close", (code) => {
        if (code === 0) resolve(true);
        else reject(new Error("FFmpeg failed"));
      });
    });

    // 🔮 مستقبلاً نرفعه لـ Google Cloud Storage
    const finalUrl = `/tmp/export_${project.id}.mp4`;

    return NextResponse.json({ success: true, url: finalUrl });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
