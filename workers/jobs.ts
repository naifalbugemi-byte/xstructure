// workers/jobs.ts
import { Worker } from "bullmq";
import { redis } from "@/lib/redis";
import { prisma } from "@/lib/prisma";

const worker = new Worker("jobs", async (job) => {
  console.log(`🚀 Running job: ${job.name}`);

  if (job.name === "publish") {
    const { scheduleId } = job.data;
    const schedule = await prisma.schedule.findUnique({ where: { id: scheduleId } });

    if (!schedule) throw new Error("Schedule not found");

    // تحديث الحالة لـ pending
    await prisma.schedule.update({
      where: { id: scheduleId },
      data: { status: "pending" },
    });

    try {
      // 👇 هنا تحدد المنصة
      switch (schedule.platform) {
        case "youtube":
          console.log("📺 نشر على YouTube:", schedule.content);
          break;
        case "instagram":
          console.log("📸 نشر على Instagram:", schedule.content);
          break;
        case "facebook":
          console.log("📘 نشر على Facebook:", schedule.content);
          break;
        case "threads":
          console.log("🧵 نشر على Threads:", schedule.content);
          break;
      }

      // ✅ نجاح
      await prisma.schedule.update({
        where: { id: scheduleId },
        data: { status: "published", publishedAt: new Date() },
      });

      await prisma.notification.create({
        data: {
          userId: schedule.userId,
          type: "schedule",
          message: `✅ تم نشر المحتوى على ${schedule.platform}`,
        },
      });

    } catch (err) {
      // ❌ فشل
      await prisma.schedule.update({
        where: { id: scheduleId },
        data: { status: "failed" },
      });

      await prisma.notification.create({
        data: {
          userId: schedule.userId,
          type: "schedule",
          message: `❌ فشل نشر المحتوى على ${schedule.platform}`,
        },
      });
    }
  }
}, { connection: redis });

worker.on("failed", (job, err) => {
  console.error(`❌ Job failed ${job?.id}`, err);
});
