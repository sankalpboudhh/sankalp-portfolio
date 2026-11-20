// Renders the chat review as one self-contained, offline HTML page.
// Visitor text is untrusted: it is embedded as escaped JSON and rendered with
// textContent only — never innerHTML.

const safeJson = (value) =>
  JSON.stringify(value).replace(/</g, "\\u003c").replace(/>/g, "\\u003e").replace(/&/g, "\\u0026")
    .replace(/\u2028/g, "\\u2028").replace(/\u2029/g, "\\u2029");

export function renderDashboard({ entries, dates, generatedAt }) {
  const data = { entries, dates: [...dates].reverse(), generatedAt };
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex">
<title>Chat review</title>
<style>
/* Dark by default (matches the portfolio); light only when toggled. */
:root {
  color-scheme: dark;
  --bg: #0d0d0d; --surface: #141414; --surface2: #1c1c1c; --border: rgba(255,255,255,.1);
  --text: #f0ede8; --muted: #9a9a94; --grid: rgba(255,255,255,.08);
  --bar: #6f9e22; --bar-hover: #86b934; --accent: #c8f560; --flag-bg: #3a2a12; --flag-text: #ffc98a;
  --mono: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  --sans: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
}
:root[data-theme="light"] {
  color-scheme: light;
  --bg: #f6f4ef; --surface: #ffffff; --surface2: #ecE9e2; --border: rgba(0,0,0,.1);
  --text: #1a1a18; --muted: #5f5f5a; --grid: rgba(0,0,0,.08);
  --bar: #4d7c0f; --bar-hover: #3f6a0b; --accent: #4d7c0f; --flag-bg: #fdf0e1; --flag-text: #8a4a0b;
}
* { box-sizing: border-box; }
body { margin: 0; background: var(--bg); color: var(--text); font: 14px/1.55 var(--sans); }
main { max-width: 1040px; margin: 0 auto; padding: 32px 16px 64px; }
h1 { font-size: 22px; margin: 0; }
h2 { font-size: 15px; margin: 0 0 12px; }
.sub { color: var(--muted); font-size: 13px; margin: 4px 0 24px; }
.card { background: var(--surface); border: 1px solid var(--border); border-radius: 12px; padding: 18px; margin-bottom: 20px; }
.tiles { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 12px; margin-bottom: 20px; }
.tile { background: var(--surface); border: 1px solid var(--border); border-radius: 12px; padding: 14px 16px; }
.tile .label { color: var(--muted); font-size: 12px; }
.tile .value { font: 600 26px/1.2 var(--mono); margin-top: 4px; font-variant-numeric: tabular-nums; }
.tile .note { color: var(--muted); font-size: 12px; }
.chart-wrap { position: relative; }
svg { display: block; width: 100%; height: 220px; overflow: visible; }
.axis text { fill: var(--muted); font: 11px var(--mono); }
.grid line { stroke: var(--grid); }
.baseline { stroke: var(--muted); stroke-opacity: .5; }
.bar { fill: var(--bar); }
.hit:hover + .bar, .bar.on { fill: var(--bar-hover); }
.hit { fill: transparent; cursor: default; }
.tip { position: absolute; pointer-events: none; background: var(--text); color: var(--bg); font-size: 12px;
  padding: 6px 9px; border-radius: 6px; white-space: nowrap; transform: translate(-50%, -100%); display: none; }
.tip b { font-family: var(--mono); }
details { margin-top: 10px; font-size: 13px; }
summary { cursor: pointer; color: var(--muted); }
table { border-collapse: collapse; margin-top: 8px; font-size: 12px; }
th, td { text-align: left; padding: 3px 12px 3px 0; border-bottom: 1px solid var(--border); font-variant-numeric: tabular-nums; }
.controls { display: flex; flex-wrap: wrap; gap: 10px; align-items: center; margin-bottom: 14px; }
.controls input[type=search] { flex: 1 1 220px; font: inherit; padding: 8px 12px; border-radius: 8px;
  border: 1px solid var(--border); background: var(--bg); color: var(--text); }
.controls label { display: flex; align-items: center; gap: 6px; font-size: 13px; color: var(--muted); }
.count { color: var(--muted); font-size: 12px; margin-left: auto; }
.list { display: flex; flex-direction: column; gap: 10px; }
.convo { border: 1px solid var(--border); border-radius: 10px; padding: 12px 14px; background: var(--surface); }
.convo-head { color: var(--muted); font-size: 12px; margin-bottom: 6px; }
.qa { padding: 8px 0; border-top: 1px dashed var(--border); }
.qa:first-of-type { border-top: none; padding-top: 0; }
.q { font-weight: 600; white-space: pre-wrap; overflow-wrap: anywhere; }
.a { color: var(--muted); white-space: pre-wrap; overflow-wrap: anywhere; margin-top: 2px; font-size: 13px; }
.flag { display: inline-block; font: 600 11px var(--sans); background: var(--flag-bg); color: var(--flag-text);
  padding: 1px 8px; border-radius: 999px; margin-left: 6px; vertical-align: 1px; }
.unanswered-item { padding: 8px 0; border-top: 1px solid var(--border); }
.unanswered-item:first-child { border-top: none; }
.time { color: var(--muted); font-size: 12px; }
.empty { color: var(--muted); font-style: italic; }
.toggle-theme { float: right; font: inherit; font-size: 12px; background: none; color: var(--muted);
  border: 1px solid var(--border); border-radius: 8px; padding: 4px 10px; cursor: pointer; }
:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }
</style>
</head>
<body>
<main>
  <button class="toggle-theme" id="theme" type="button">Toggle theme</button>
  <h1>Portfolio assistant — chat review</h1>
  <p class="sub" id="sub"></p>

  <section class="tiles" id="tiles" aria-label="Summary"></section>

  <section class="card">
    <h2>Questions per day</h2>
    <div class="chart-wrap" id="chart"><div class="tip" id="tip" role="status"></div></div>
    <details><summary>Show as table</summary><table id="dayTable"><thead><tr><th>Date</th><th>Questions</th><th>Unanswered</th></tr></thead><tbody></tbody></table></details>
  </section>

  <section class="card">
    <h2>Unanswered — add this to the portfolio or knowledge base</h2>
    <div id="unanswered"></div>
  </section>

  <section class="card">
    <h2>Conversations</h2>
    <div class="controls">
      <input type="search" id="search" placeholder="Search questions and answers…" aria-label="Search conversations">
      <label><input type="checkbox" id="onlyUnanswered"> Only with unanswered</label>
      <span class="count" id="count" aria-live="polite"></span>
    </div>
    <div class="list" id="convos"></div>
  </section>
</main>

<script id="data" type="application/json">${safeJson(data)}</script>
<script>
(() => {
  const { entries, dates, generatedAt } = JSON.parse(document.getElementById("data").textContent);
  const $ = (id) => document.getElementById(id);
  const el = (tag, cls, text) => { const n = document.createElement(tag); if (cls) n.className = cls; if (text != null) n.textContent = text; return n; };
  const ist = (iso, opts = { dateStyle: "medium", timeStyle: "short" }) => new Date(iso).toLocaleString("en-IN", { timeZone: "Asia/Kolkata", ...opts });
  const dayOf = (iso) => new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kolkata" }).format(new Date(iso));
  const fmtDay = (d) => new Date(d + "T12:00:00Z").toLocaleDateString("en-IN", { day: "numeric", month: "short" });

  // Theme toggle (remembered per browser)
  try { const t = localStorage.getItem("chat-review-theme"); if (t) document.documentElement.dataset.theme = t; } catch {}
  $("theme").onclick = () => {
    const next = document.documentElement.dataset.theme === "light" ? "dark" : "light";
    document.documentElement.dataset.theme = next;
    try { localStorage.setItem("chat-review-theme", next); } catch {}
  };

  $("sub").textContent = \`\${fmtDay(dates[0])} – \${fmtDay(dates[dates.length - 1])} (\${dates.length} days, IST) · generated \${ist(generatedAt)}\`;

  // ---- Tiles ----
  const convIds = new Set(entries.map((e) => e.c || e.t));
  const unanswered = entries.filter((e) => e.u);
  const pct = entries.length ? Math.round((unanswered.length / entries.length) * 100) : 0;
  const tiles = [
    ["Questions", entries.length, ""],
    ["Conversations", convIds.size, ""],
    ["Unanswered", unanswered.length, entries.length ? pct + "% of questions" : ""],
    ["Questions / conversation", convIds.size ? (entries.length / convIds.size).toFixed(1) : "0", ""],
  ];
  for (const [label, value, note] of tiles) {
    const t = el("div", "tile");
    t.append(el("div", "label", label), el("div", "value", String(value)));
    if (note) t.append(el("div", "note", note));
    $("tiles").append(t);
  }

  // ---- Chart: questions per day (single series) ----
  const perDay = new Map(dates.map((d) => [d, { q: 0, u: 0 }]));
  for (const e of entries) { const d = perDay.get(dayOf(e.t)); if (d) { d.q++; if (e.u) d.u++; } }
  const rows = dates.map((d) => ({ d, ...perDay.get(d) }));
  const max = Math.max(1, ...rows.map((r) => r.q));
  const step = max <= 5 ? 1 : max <= 10 ? 2 : max <= 25 ? 5 : 10;
  const top = Math.ceil(max / step) * step;

  const NS = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(NS, "svg");
  svg.setAttribute("role", "img");
  svg.setAttribute("aria-label", "Bar chart of questions per day; see the table below for values");
  const chart = $("chart");
  chart.prepend(svg);

  function draw() {
    svg.replaceChildren();
    const W = chart.clientWidth, H = 220, L = 32, R = 4, T = 10, B = 24;
    svg.setAttribute("viewBox", \`0 0 \${W} \${H}\`);
    const iw = W - L - R, ih = H - T - B, bw = iw / rows.length;
    const y = (v) => T + ih - (v / top) * ih;
    const mk = (tag, attrs, parent = svg) => { const n = document.createElementNS(NS, tag); for (const k in attrs) n.setAttribute(k, attrs[k]); parent.append(n); return n; };

    const grid = mk("g", { class: "grid axis" });
    for (let v = 0; v <= top; v += step) {
      if (v > 0) mk("line", { x1: L, x2: W - R, y1: y(v), y2: y(v) }, grid);
      const t = mk("text", { x: L - 6, y: y(v) + 4, "text-anchor": "end" }, grid); t.textContent = v;
    }
    const xa = mk("g", { class: "axis" });
    const every = Math.ceil(rows.length / Math.max(2, Math.floor(iw / 64)));
    rows.forEach((r, i) => {
      if ((rows.length - 1 - i) % every === 0) {
        const t = mk("text", { x: L + i * bw + bw / 2, y: H - 6, "text-anchor": "middle" }, xa); t.textContent = fmtDay(r.d);
      }
    });

    rows.forEach((r, i) => {
      const x = L + i * bw;
      const hit = mk("rect", { class: "hit", x, y: T, width: bw, height: ih });
      const gap = bw > 6 ? 2 : 0, w = Math.max(1, bw - gap), bx = x + gap / 2;
      let bar = null;
      if (r.q > 0) {
        const h = ih - (y(r.q) - T), rad = Math.min(4, w / 2, h);
        const by = y(r.q), base = T + ih;
        bar = mk("path", { class: "bar", d: \`M\${bx},\${base} V\${by + rad} Q\${bx},\${by} \${bx + rad},\${by} H\${bx + w - rad} Q\${bx + w},\${by} \${bx + w},\${by + rad} V\${base} Z\` });
      }
      const show = () => {
        const tip = $("tip");
        tip.replaceChildren();
        tip.append(fmtDay(r.d) + " · ", Object.assign(el("b"), { textContent: r.q }), r.q === 1 ? " question" : " questions");
        if (r.u) tip.append(\` · \${r.u} unanswered\`);
        tip.style.display = "block";
        tip.style.left = Math.min(Math.max(x + bw / 2, 80), W - 80) + "px";
        tip.style.top = (r.q ? y(r.q) : T + ih) - 6 + "px";
        bar?.classList.add("on");
      };
      const hide = () => { $("tip").style.display = "none"; bar?.classList.remove("on"); };
      hit.addEventListener("mouseenter", show);
      hit.addEventListener("mouseleave", hide);
    });
    mk("line", { class: "baseline", x1: L, x2: W - R, y1: T + ih, y2: T + ih });
  }
  draw();
  new ResizeObserver(draw).observe(chart);

  const tbody = $("dayTable").querySelector("tbody");
  for (const r of rows.slice().reverse()) {
    if (!r.q) continue;
    const tr = el("tr");
    tr.append(el("td", "", fmtDay(r.d)), el("td", "", String(r.q)), el("td", "", String(r.u)));
    tbody.append(tr);
  }
  if (!tbody.children.length) { const tr = el("tr"); tr.append(el("td", "empty", "No questions in this range")); tbody.append(tr); }

  // ---- Unanswered, grouped by question (most asked first) ----
  const norm = (s) => s.toLowerCase().replace(/[^a-z0-9 ]+/g, " ").replace(/\\s+/g, " ").trim();
  const ugroups = new Map();
  for (const e of unanswered) {
    const k = norm(e.q);
    const g = ugroups.get(k) || { q: e.q, a: e.a, last: e.t, n: 0 };
    g.n++;
    if (e.t >= g.last) Object.assign(g, { q: e.q, a: e.a, last: e.t });
    ugroups.set(k, g);
  }
  const ulist = [...ugroups.values()].sort((a, b) => b.n - a.n || b.last.localeCompare(a.last));
  if (!ulist.length) $("unanswered").append(el("p", "empty", "Nothing unanswered — nice."));
  for (const g of ulist) {
    const item = el("div", "unanswered-item");
    const q = el("div", "q", g.q);
    if (g.n > 1) q.append(el("span", "flag", \`asked \${g.n}×\`));
    item.append(el("div", "time", "Last asked " + ist(g.last)), q, el("div", "a", g.a));
    $("unanswered").append(item);
  }

  // ---- Conversations with search / filter ----
  const groups = new Map();
  for (const e of entries) {
    const id = e.c || "single-" + e.t;
    if (!groups.has(id)) groups.set(id, []);
    groups.get(id).push(e);
  }
  const convos = [...groups.values()].sort((a, b) => b[0].t.localeCompare(a[0].t));

  function renderConvos() {
    const term = $("search").value.trim().toLowerCase();
    const only = $("onlyUnanswered").checked;
    const shown = convos.filter((c) =>
      (!only || c.some((e) => e.u)) &&
      (!term || c.some((e) => (e.q + " " + e.a).toLowerCase().includes(term))));
    const list = $("convos");
    list.replaceChildren();
    $("count").textContent = \`\${shown.length} of \${convos.length} conversations\`;
    if (!shown.length) list.append(el("p", "empty", convos.length ? "No conversations match." : "No conversations logged yet."));
    for (const c of shown) {
      const box = el("article", "convo");
      box.append(el("div", "convo-head", \`\${ist(c[0].t)} · \${c.length} question\${c.length > 1 ? "s" : ""}\`));
      for (const e of c) {
        const qa = el("div", "qa");
        const q = el("div", "q", e.q);
        if (e.u) q.append(el("span", "flag", "Unanswered"));
        qa.append(q, el("div", "a", e.a));
        box.append(qa);
      }
      list.append(box);
    }
  }
  $("search").addEventListener("input", renderConvos);
  $("onlyUnanswered").addEventListener("change", renderConvos);
  renderConvos();
})();
</script>
</body>
</html>
`;
}
