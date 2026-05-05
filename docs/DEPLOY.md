# Shadow AI Cloudflare Demo

Shadow AI is a Qwik frontend backed by a separate Cloudflare Worker API. The frontend runs on Cloudflare Pages, while the Worker owns auth, sessions, D1 persistence, OpenRouter calls, and memory storage.

## Architecture

- Frontend: Qwik City + Vite, statically generated for Cloudflare Pages.
- Backend: Cloudflare Worker in `worker/`, exposed as `/api/*`.
- Auth: Google and GitHub OAuth with HttpOnly session cookies.
- Storage: D1 for users, sessions, conversations, messages, summaries, memory records, tool events, and usage events.
- Memory: D1 summary/fact/preference rows with optional Cloudflare Vectorize recall through the `MEMORY_INDEX` binding.
- AI: OpenRouter streaming chat completions and structured mode artifacts through `OPENROUTER_API_KEY`.
- Artifacts: content/code/email/video/SEO/image/voice/resume/bot modes write structured JSON artifacts to D1.
- Resume export: the Worker renders Unicode-capable PDF files with ATS professional and modern visual templates.
- Bot personas: bot mode saves reusable system-prompt personas that can be selected in chat mode.

## Local Development

Install dependencies from this directory, then run the frontend and Worker in separate terminals:

```shell
npm install
npm run dev
npm run worker:dev
```

For cross-port local development, start Qwik with:

```shell
VITE_API_BASE_URL=http://127.0.0.1:8787 npm run dev
```

Apply D1 migrations locally before testing auth/chat:

```shell
npm run db:migrate:local
```

The second migration adds the structured artifact and saved bot persona tables. Run migrations again after pulling changes.

## API Surface

- `GET /api/me`: current session user.
- `GET|POST /api/conversations`: list or create conversations.
- `GET /api/conversations/:id/messages`: load persisted messages, including artifact metadata.
- `POST /api/chat/stream`: streaming chat, optionally with `botId`.
- `POST /api/modes/run`: run a non-chat mode and persist a structured artifact.
- `GET|POST /api/bots`: list or create saved bot personas.
- `PATCH|DELETE /api/bots/:id`: update or soft-delete a saved bot persona.
- `POST /api/resume/pdf`: render a resume artifact as `application/pdf`.

## Required Cloudflare Setup

These Cloudflare resources are bound in `worker/wrangler.toml`:

- D1 database: `DB` / `nexus_ai`
- KV namespace: `RATE_LIMIT`
- Vectorize index: `MEMORY_INDEX` / `nexus-ai-memory`, 384 dimensions, cosine metric
- Workers AI binding: `AI`

Set these Worker secrets:

```shell
npx wrangler secret put OPENROUTER_API_KEY --config worker/wrangler.toml
npx wrangler secret put GOOGLE_CLIENT_SECRET --config worker/wrangler.toml
npx wrangler secret put GITHUB_CLIENT_SECRET --config worker/wrangler.toml
```

For local development, copy `worker/.dev.vars.example` to `worker/.dev.vars` and fill the same values there.

Set these Worker vars either in `worker/wrangler.toml` or Cloudflare dashboard:

- `PUBLIC_ORIGIN`: Pages/custom frontend origin, currently `https://nexus.lavescar.com.tr`
- `API_PUBLIC_ORIGIN`: Worker API origin, currently `https://nexus.lavescar.com.tr` because Worker is intended to route at `/api/*`
- `ALLOWED_ORIGIN`: comma-separated frontend origins allowed for credentialed CORS; use the same frontend origin in production
- `GOOGLE_CLIENT_ID`
- `GITHUB_CLIENT_ID`
- `OPENROUTER_DEFAULT_MODEL`, currently `openai/gpt-oss-120b:free`
- Per-mode free model overrides: `OPENROUTER_MODEL_CHAT`, `OPENROUTER_MODEL_CONTENT`, `OPENROUTER_MODEL_CODE`, `OPENROUTER_MODEL_EMAIL`, `OPENROUTER_MODEL_VIDEO`, `OPENROUTER_MODEL_SEO`, `OPENROUTER_MODEL_IMAGE`, `OPENROUTER_MODEL_VOICE`, `OPENROUTER_MODEL_RESUME`, `OPENROUTER_MODEL_BOT`
- Optional `PDF_FONT_REGULAR_URL` and `PDF_FONT_BOLD_URL`; defaults load `/fonts/Inter-400.ttf` and `/fonts/Inter-700.ttf` from `PUBLIC_ORIGIN`

The default mode model map uses OpenRouter `:free` models:

- chat/resume: `openai/gpt-oss-120b:free`
- content: `qwen/qwen3-next-80b-a3b-instruct:free`
- code: `qwen/qwen3-coder:free`
- email: `google/gemma-4-31b-it:free`
- video: `minimax/minimax-m2.5:free`
- SEO: `z-ai/glm-4.5-air:free`
- image prompt mode: `google/gemma-4-26b-a4b-it:free`
- voice text mode: `google/gemma-3-27b-it:free`
- bot builder: `nvidia/nemotron-3-super-120b-a12b:free`

## Deploy

Target production URL:

- `https://nexus.lavescar.com.tr`

Current staging fallback URLs:

- Pages: `https://nexus-ai-h1u.pages.dev`
- Worker API: `https://nexus-ai-api.efe-aras.workers.dev`

For production, add `nexus.lavescar.com.tr` as a Cloudflare Pages custom domain for the `nexus-ai` Pages project, then deploy the Worker route `nexus.lavescar.com.tr/api/*` from `worker/wrangler.toml`. Production builds should not set `VITE_API_BASE_URL`, so the frontend calls same-origin `/api/*`.

`wrangler pages project list` currently shows `nexus-ai` attached only to `nexus-ai-h1u.pages.dev`. Wrangler 4.80.0 does not expose a Pages custom-domain command, so add the custom domain from Cloudflare Dashboard > Workers & Pages > `nexus-ai` > Custom domains before the production Worker deploy.

Until the custom domain is live, use the explicit fallback build/deploy path so the pages.dev frontend keeps calling the workers.dev API:

```shell
npm run pages:build:fallback
npm run pages:deploy:fallback
```

Configure OAuth callback URLs before the final smoke test:

- Google: `https://nexus.lavescar.com.tr/api/auth/google/callback`
- GitHub: `https://nexus.lavescar.com.tr/api/auth/github/callback`

For the current staging Worker, use:

- Google: `https://nexus-ai-api.efe-aras.workers.dev/api/auth/google/callback`
- GitHub: `https://nexus-ai-api.efe-aras.workers.dev/api/auth/github/callback`

Google OAuth setup:

1. Open Google Cloud Console, create or select a project, then go to APIs & Services > OAuth consent screen.
2. Configure app name/support email and add the test or production users needed for launch.
3. Go to APIs & Services > Credentials > Create credentials > OAuth client ID.
4. Choose Web application.
5. Add the authorized JavaScript origin `https://nexus.lavescar.com.tr`.
6. Add the authorized redirect URI `https://nexus.lavescar.com.tr/api/auth/google/callback`.
7. Copy the client ID into `GOOGLE_CLIENT_ID` in `worker/wrangler.toml`.
8. Set the client secret with `npx wrangler secret put GOOGLE_CLIENT_SECRET --config worker/wrangler.toml`, then redeploy the Worker.

GitHub OAuth setup:

1. Open GitHub > Settings > Developer settings > OAuth Apps > New OAuth App.
2. Set Homepage URL to `https://nexus.lavescar.com.tr`.
3. Set Authorization callback URL to `https://nexus.lavescar.com.tr/api/auth/github/callback`.
4. Copy the client ID into `GITHUB_CLIENT_ID` in `worker/wrangler.toml`.
5. Generate a client secret and set it with `npx wrangler secret put GITHUB_CLIENT_SECRET --config worker/wrangler.toml`, then redeploy the Worker.

Deploy everything with:

```shell
npm run deploy:all
```

Or run the pieces manually:

```shell
npm run validate
npm run pages:build:production
npm run db:migrate:remote
npm run worker:deploy
npm run pages:deploy
```

## Verification

```shell
npm run validate
npm run worker:deploy:dry
```

Remote smoke checklist:

- `https://APP_DOMAIN/api/health` returns `{ "ok": true }`
- Google and GitHub sign-in redirects return to `/chat` and set the session cookie
- Chat streaming, `/api/modes/run`, saved bot persona selection, and `/api/resume/pdf` work with the same session cookie
- A Turkish CV sample such as `Çağrı Şahin, İstanbul, çözüm, öğrenim` renders correctly in both PDF templates

The Worker returns clear `503` JSON errors when OAuth, OpenRouter, font assets, or Cloudflare bindings are not configured yet.
