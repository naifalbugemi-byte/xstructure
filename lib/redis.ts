// ✅ Set
export async function set(key: string, value: string, ttlSeconds?: number) {
  const url = `${process.env.UPSTASH_REDIS_REST_URL}/set/${key}/${value}${
    ttlSeconds ? `?EX=${ttlSeconds}` : ""
  }`;

  await fetch(url, {
    headers: { Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}` },
  });
}

// ✅ Get
export async function get(key: string) {
  const url = `${process.env.UPSTASH_REDIS_REST_URL}/get/${key}`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}` },
  });
  const data = await res.json();
  return data.result;
}

// ✅ Delete
export async function del(key: string) {
  const url = `${process.env.UPSTASH_REDIS_REST_URL}/del/${key}`;
  await fetch(url, {
    headers: { Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}` },
  });
}

// ✅ Increment
export async function incr(key: string) {
  const url = `${process.env.UPSTASH_REDIS_REST_URL}/incr/${key}`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}` },
  });
  const data = await res.json();
  return parseInt(data.result, 10);
}

// ✅ Expire
export async function expire(key: string, ttlSeconds: number) {
  const url = `${process.env.UPSTASH_REDIS_REST_URL}/expire/${key}/${ttlSeconds}`;
  await fetch(url, {
    headers: { Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}` },
  });
}

// ✅ Object-style export
export const redis = {
  set,
  get,
  del,
  incr,
  expire,
};
