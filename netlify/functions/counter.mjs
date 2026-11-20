import { Redis } from "@upstash/redis";

const KEY = "counter";
let redis;

export default async function counter(req) {
  if (req.method !== "GET" && req.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405, headers: { Allow: "GET, POST" } });
  }

  try {
    // Created lazily so a missing env var returns a clear 500 instead of crashing at import.
    redis ??= Redis.fromEnv();

    // POST = count a new visit; GET = just read the current total.
    const count = req.method === "POST"
      ? await redis.incr(KEY)
      : Number((await redis.get(KEY)) ?? 0);

    return Response.json({ count }, { headers: { "Cache-Control": "no-store" } });
  } catch (err) {
    console.error("counter failed:", err);
    return Response.json({ error: "Counter unavailable" }, { status: 500 });
  }
}

export const config = {
  path: "/api/counter",
};
