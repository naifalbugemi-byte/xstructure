import { redis } from "./redis";

export async function rateLimit(ip: string, limit = 100, windowSec = 60) {
  const key = `ratelimit:${ip}`;
  const current = await redis.incr(key);

  if (current === 1) {
    await redis.expire(key, windowSec);
  }

  if (current > limit) {
    return false; // تعدى الحد
  }

  return true; // مسموح
}
