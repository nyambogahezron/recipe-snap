## Bite — Copilot Instructions

This repo is a pnpm monorepo with two primary apps: `api` (AI backend) and `mobile` (Expo React Native app).

Keep guidance concise and specific to this codebase. Use the examples and file references below when making changes.

Core facts
- Monorepo managed with pnpm (see root `README.md`). Use `pnpm install` at repo root. Use `pnpm dev` or workspace filters (e.g. `pnpm api:dev`, `pnpm mobile:dev`).
- API runtime commonly runs with Bun but Node/npm is supported. API scripts are in `api/package.json` (`dev`, `build`, `start`, `type-check`).
- Mobile app is an Expo app in `mobile/` (use `expo start`).

API architecture (what to know)
- Entry: `api/src/server.ts` — Express server, mounts routes at `/api` and uses centralized error and 404 middleware (`api/src/middleware`).
- AI layer: `api/src/ai/ai-instance.ts` configures `genkit` + `@genkit-ai/googleai`. Model: `googleai/gemini-2.0-flash`.
- Flows & prompts: each AI operation is implemented under `api/src/ai/flows/` using `ai.definePrompt` and `ai.defineFlow`.
  - Example flows: `identify-dish-from-image.ts`, `generate-recipe-from-image.ts` — both expect `photoDataUri` (data URI, base64) and return typed outputs (zod schemas).
- Config: environment variables consumed via `api/src/config/env.ts` — notably `GOOGLE_GENAI_API_KEY` and `PORT`.

Request shapes & integration points
- Mobile calls the API endpoints described in `api/README.md`:
  - POST `/api/ai/identify-dish` with JSON { "photoDataUri": "data:image/jpeg;base64,..." }
  - POST `/api/ai/generate-recipe` same shape
- The backend expects Data URIs that include MIME type and base64 encoding. See zod schemas in `api/src/ai/flows/*` for exact validation rules.

Conventions & patterns
- Use the zod schemas defined in flows for input/output contracts. They are authoritative — prefer updating them when changing shapes.
- Error handling is centralized. Use `api/src/utils/errors.ts` and middlewares in `api/src/middleware` to produce consistent responses.
- No DB in the API; the app is stateless. Persistence occurs on the mobile client (see `mobile/database/`).
- TypeScript-first: run `pnpm --filter api run type-check` (or `bun run type-check`) before publishing API changes.

Build & dev notes
- Root-level dev: `pnpm dev` (runs both apps in development). To target the API: `pnpm api:dev` (runs Bun or `npm run dev` depending on environment).
- API build uses Bun: `bun build src/server.ts --outdir dist --target node` (script: `pnpm --filter api run build`).
- Mobile: `expo start` (see `mobile/package.json` scripts).

When editing AI prompts/flows
- Update the zod input/output schemas in the same file and keep prompts short and deterministic.
- Keep prompts idempotent and map outputs to the declared output schema — `ai.definePrompt` and `ai.defineFlow` expect exact schemas.

Files to check for changes / quick references
- Server & routes: `api/src/server.ts`, `api/src/routes/index.ts`, `api/src/controllers/aiController.ts`
- AI: `api/src/ai/ai-instance.ts`, `api/src/ai/flows/*`
- Config: `api/src/config/env.ts`
- Middlewares: `api/src/middleware/*`
- Mobile integration: `mobile/app/api/*` and `mobile/app/recipe/[id].tsx`

Security & secrets
- Do not hardcode API keys. The Google GenAI key must be provided via `GOOGLE_GENAI_API_KEY` in env or secrets manager. See `api/README.md`.

PR & testing notes
- Prefer small, focused changes when editing prompts or schemas. Update types and run `pnpm --filter api run type-check`.
- Run the API locally and exercise endpoints with a real data URI (small base64 sample) to verify zod schemas and prompt outputs.

If anything is unclear or you need more examples (sample Data URIs, test harnesses, or common failure modes), ask and I'll add them.
