// Integration check of the atomic quota against the real Upstash database.
// Uses a throwaway key prefix (never the production "portfolio-chat:*" keys),
// fakes Gemini (no AI calls), and deletes its keys at the end.
// Run: node --env-file=.env netlify/tests/quota-concurrency.mjs
import assert from "node:assert/strict";
import { Redis } from "@upstash/redis";
import { createChatHandler } from "../functions/chat.mjs";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});
const prefix = `portfolio-chat-test:${Date.now()}`;
let geminiCalls = 0;
let clock = new Date("2026-11-20T06:00:00Z"); // 11:30 IST

const handler = createChatHandler({
  keyPrefix: prefix,
  now: () => clock,
  fetchImpl: async () => {
    geminiCalls++;
    return Response.json({ candidates: [{ content: { parts: [{ text: "ok" }] }, finishReason: "STOP" }] });
  },
});
console.error = () => {};

const ask = (ip) => handler(
  new Request("http://localhost/api/chat", {
    method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ message: "hi" }),
  }),
  { ip },
);
const tally = (responses) => responses.reduce((acc, r) => ({ ...acc, [r.status]: (acc[r.status] || 0) + 1 }), {});

try {
  // 1) Per-IP cap: 11 sequential requests from one IP -> 10 admitted, 11th is 429.
  const sameIp = [];
  for (let i = 0; i < 11; i++) sameIp.push(await ask("198.51.100.10"));
  assert.deepEqual(tally(sameIp), { 200: 10, 429: 1 });
  console.log("✔ per-IP cap: 10 admitted, 11th rejected with 429");

  // 2) Concurrency at the global boundary: 60 simultaneous requests from distinct IPs.
  //    10 already used above, so exactly 40 more may be admitted (50 total).
  const burst = await Promise.all(Array.from({ length: 60 }, (_, i) => ask(`203.0.113.${i + 1}`)));
  assert.deepEqual(tally(burst), { 200: 40, 429: 20 });
  console.log("✔ 60 concurrent requests: 40 admitted, 20 rejected (global total exactly 50)");

  const globalKey = `${prefix}:global:2026-11-20`;
  assert.equal(Number(await redis.get(globalKey)), 50);
  const ttl = await redis.ttl(globalKey);
  assert.ok(ttl > 0 && ttl <= 172800, `ttl=${ttl}`);
  console.log(`✔ Redis global counter = 50, expiry set (${ttl}s)`);

  // 3) The 51st request (new IP, no client IP) is still rejected.
  assert.equal((await ask("192.0.2.99")).status, 429);
  assert.equal((await ask(undefined)).status, 429);
  console.log("✔ 51st request (with and without client IP) returns 429");
  assert.equal(geminiCalls, 50);
  console.log("✔ Gemini called exactly 50 times");

  // 4) Reset at the next Asia/Kolkata calendar day (00:00 IST = 18:30 UTC).
  clock = new Date("2026-11-20T18:29:59Z");
  assert.equal((await ask("192.0.2.50")).status, 429);
  clock = new Date("2026-11-20T18:30:00Z");
  assert.equal((await ask("192.0.2.50")).status, 200);
  assert.equal((await ask("198.51.100.10")).status, 200); // per-IP also reset
  console.log("✔ quota resets at 00:00 IST (23:59:59 rejected, 00:00 admitted)");

  // 5) No message content stored: only counter keys exist.
  const keys = await redis.keys(`${prefix}:*`);
  for (const k of keys) assert.match(k, /:(global|ip):\d{4}-\d{2}-\d{2}(:[0-9a-f]{32})?$/);
  console.log(`✔ only counter keys stored (${keys.length} keys, no transcripts, no raw IPs)`);
} finally {
  const keys = await redis.keys(`${prefix}:*`);
  if (keys.length) await redis.del(...keys);
  console.log(`cleanup: deleted ${keys.length} test keys`);
}
