// Review what visitors ask the portfolio assistant.
//
//   npm run chat:review                  last 30 days, unanswered questions first
//   npm run chat:review -- --days 7
//   npm run chat:review -- --csv chats.csv   also export every exchange to CSV
//   npm run chat:dashboard               open a visual dashboard (chat-review.html) in the browser
//   npm run chat:dashboard -- --days 90
//
// Read-only. Needs UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN in .env.
import { writeFileSync } from "node:fs";
import { Redis } from "@upstash/redis";
import { quotaDate } from "../netlify/functions/chat.mjs";

const args = process.argv.slice(2);
const opt = (name, fallback) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 && args[i + 1] ? args[i + 1] : fallback;
};
const days = Math.min(Math.max(parseInt(opt("days", "30"), 10) || 30, 1), 90);
const csvPath = opt("csv", null);
const prefix = opt("prefix", "portfolio-chat"); // for testing against throwaway keys

if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
  console.error("Missing UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN (run via `npm run chat:review`).");
  process.exit(1);
}
const redis = Redis.fromEnv();

const dates = Array.from({ length: days }, (_, i) => quotaDate(new Date(Date.now() - i * 86_400_000)));
const pipe = redis.pipeline();
for (const d of dates) pipe.lrange(`${prefix}:log:${d}`, 0, -1);
const lists = await pipe.exec();

const parse = (raw) => {
  if (raw && typeof raw === "object") return raw; // client may auto-deserialize JSON
  try { return JSON.parse(raw); } catch { return null; }
};
const entries = lists.flat().map(parse).filter(Boolean).sort((a, b) => a.t.localeCompare(b.t));

if (args.includes("--html")) {
  const { renderDashboard } = await import("./chat-dashboard.mjs");
  const out = opt("out", "chat-review.html");
  writeFileSync(out, renderDashboard({ entries, dates, generatedAt: new Date().toISOString() }));
  console.log(`Dashboard: ${entries.length} question(s) over ${days} day(s) → ${out}`);
  if (!args.includes("--no-open")) {
    const { execFile } = await import("node:child_process");
    const cmd = process.platform === "darwin" ? "open" : process.platform === "win32" ? "explorer" : "xdg-open";
    execFile(cmd, [out], () => {});
  }
  process.exit(0);
}

const ist = (iso) =>
  new Date(iso).toLocaleString("en-IN", { timeZone: "Asia/Kolkata", dateStyle: "medium", timeStyle: "short" });
const short = (s, n) => (s.length > n ? `${s.slice(0, n - 1)}…` : s);
const line = (s = "") => console.log(s);

const conversations = new Set(entries.map((e) => e.c).filter(Boolean));
const unanswered = entries.filter((e) => e.u);

line(`Portfolio assistant — last ${days} day(s)`);
line(`${entries.length} questions · ${conversations.size} conversations · ${unanswered.length} unanswered`);

if (!entries.length) {
  line("\nNo logged conversations yet.");
  process.exit(0);
}

line("\n=== Unanswered — consider adding this information to the portfolio ===");
if (!unanswered.length) line("(none)");
for (const e of unanswered.slice().reverse()) line(`- [${ist(e.t)}] ${e.q}`);

line("\n=== Questions per day ===");
const perDay = new Map();
for (const e of entries) {
  const d = quotaDate(new Date(e.t));
  perDay.set(d, (perDay.get(d) || 0) + 1);
}
for (const [d, n] of [...perDay].sort().reverse()) line(`${d}  ${"█".repeat(Math.min(n, 50))} ${n}`);

line("\n=== Recent conversations (newest first) ===");
const byConversation = new Map();
for (const e of entries) {
  const id = e.c || `single-${e.t}`;
  if (!byConversation.has(id)) byConversation.set(id, []);
  byConversation.get(id).push(e);
}
const recent = [...byConversation.values()].sort((a, b) => b[0].t.localeCompare(a[0].t)).slice(0, 15);
for (const convo of recent) {
  line(`\n— ${ist(convo[0].t)} (${convo.length} question${convo.length > 1 ? "s" : ""})`);
  for (const e of convo) {
    line(`  Q: ${e.q}${e.u ? "   [unanswered]" : ""}`);
    line(`  A: ${short(e.a.replace(/\s+/g, " "), 160)}`);
  }
}
if (byConversation.size > recent.length) {
  line(`\n…${byConversation.size - recent.length} older conversation(s). Use --csv to export everything.`);
}

if (csvPath) {
  const esc = (v) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  const rows = [["time_ist", "conversation", "turn", "unanswered", "question", "answer"]];
  for (const e of entries) rows.push([ist(e.t), e.c, e.n, e.u ? "yes" : "no", e.q, e.a]);
  writeFileSync(csvPath, rows.map((r) => r.map(esc).join(",")).join("\n") + "\n");
  line(`\nExported ${entries.length} rows to ${csvPath}`);
}
