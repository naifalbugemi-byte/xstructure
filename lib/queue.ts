// lib/queue.ts
import { Queue } from "bullmq";
import { redis } from "./redis";

// إنشاء كيو باسم "jobs"
export const jobQueue = new Queue("jobs", {
  connection: redis,
});
