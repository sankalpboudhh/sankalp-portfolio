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
