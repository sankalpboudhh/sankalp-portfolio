# Netlify Functions

| Route | File | Purpose |
|---|---|---|
| `GET/POST /api/counter` | `functions/counter.mjs` | Visitor counter (Upstash Redis) |
| `POST /api/chat` | `functions/chat.mjs` | Portfolio AI assistant (Gemini + Upstash quota) |

The assistant's knowledge lives in `data/chatbot-knowledge.mjs`. Edit that file to change what it knows; it is bundled into the function and never shipped to the browser.

## Environment variables

Set these in **Netlify → Site configuration → Environment variables** (scope must include Functions), and in a local `.env` (git-ignored) for development. Never prefix them with `REACT_APP_`.

- `GEMINI_API_KEY`
- `UPSTASH_REDIS_REST_URL`
- `UPSTASH_REDIS_REST_TOKEN`

Changing a variable in Netlify only takes effect on the next deploy.

## Daily quota

- **50 accepted chat requests per day, site-wide**, plus **10 per visitor** (keyed by an HMAC of the client IP; raw IPs are never stored).
- The day is the `Asia/Kolkata` calendar day; counters reset at **00:00 IST**. Keys: `portfolio-chat:global:YYYY-MM-DD`, expire after 48h.
- A request is counted when it is **admitted, before Gemini is called**. If Gemini then fails, that request still uses one of the 50.
- Enforced atomically in Redis (one Lua script), so concurrent requests can't exceed the cap.
- If Redis is unreachable the function returns 503 and does **not** call Gemini.
- Local `netlify dev` uses the same Upstash database, so local testing counts toward the live quota.

## Conversation log (for reviewing what visitors ask)

- Each successful exchange is appended to `portfolio-chat:log:YYYY-MM-DD` (IST day) and **auto-deleted after 90 days**.
- Stored: time, question, reply, a random per-conversation id, turn number, and an `unanswered` flag (reply said it lacked the info).
- **Not stored:** IP addresses, user agents, or anything identifying. Emails and phone numbers typed by visitors are masked as `[email]` / `[phone]`.
- Written after the response is sent (`context.waitUntil`); a logging failure never affects the reply. Rejected or failed requests are not logged.
- The chat panel tells visitors: "Questions are saved anonymously to help improve this portfolio."

Review it locally:

```sh
npm run chat:review                       # last 30 days, unanswered first
npm run chat:review -- --days 7
npm run chat:review -- --csv chats.csv    # export everything (keep the CSV out of git)
```

## Local development

```sh
netlify dev            # React app + functions at http://localhost:8888
```

Don't run `npm start` at the same time; `netlify dev` starts it on port 3000 itself.

## Tests

```sh
npm run test:functions                                   # backend unit tests (no network)
node --env-file=.env netlify/tests/quota-concurrency.mjs # real-Redis quota test (throwaway keys, fake Gemini)
CI=true npx react-scripts test --watchAll=false src/components/AIChat
```
