# Thesis — Paper-Trading Brokerage Prototype

Thesis turns any “I think…” into an investable simulation. Users describe a belief, receive AI-generated implications, optionally save the output, and paper-trade suggested positions backed by live market data.

## Feature Highlights

- **Natural-language thesis intake** with structured OpenAI prompts returning JSON-aligned trade suggestions.
- **AI alignment view** summarising sectors, long/short baskets, rationale, confidence notes, and macro signals.
- **Research brief on demand** (pros/cons, counter-theses, historical analogues) generated after you save or reuse the summary.
- **Paper trading simulator** to size positions, record entries, and monitor simulated P/L per thesis.
- **Community feed** showcasing trending theses, aggregate performance, and creator attribution.
- **Postgres-backed storage** with a lean SQL schema and no auth for rapid iteration.

## Stack

| Layer        | Tech                                                      |
| ------------ | --------------------------------------------------------- |
| Frontend     | Next.js App Router, React 18, Tailwind (custom UI kit)    |
| AI           | OpenAI Responses API (`gpt-4.1` JSON schema mode)         |
| Data         | Postgres (self-hosted or local)                           |
| Market Data  | Polygon.io or Finnhub (pluggable)                         |
| Analytics    | (stub) ready for PostHog/Plausible integration            |

## Getting Started

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Copy environment variables**

   ```bash
   cp .env.example .env.local
   ```

   Fill in:

   - `DATABASE_URL` (Postgres connection string)
   - `OPENAI_API_KEY`
   - `POLYGON_API_KEY` or `FINNHUB_API_KEY`
   - `MARKET_DATA_PROVIDER` (`polygon` | `finnhub`, defaults to `polygon`)

3. **Database setup**

   ```bash
   psql "$DATABASE_URL" -f db/schema.sql
   ```

   The schema file lives in `db/schema.sql`. It creates tables for `users`, `theses`, `paper_trades`, and supporting enums.

4. **Run the dev server**

   ```bash
   npm run dev
   ```

   App boots on [http://localhost:3000](http://localhost:3000).

## Key Directories

- `src/app/api/*` — Route handlers for AI alignment, thesis review, community feed, and paper-trading CRUD.
- `src/components/thesis/thesis-workbench.tsx` — Core UX flow: intake, results, save gating, paper trades.
- `src/lib/*` — OpenAI prompts, database helper, market data fetchers.
- `db/schema.sql` — Postgres schema for theses and paper trades.
- `docs/` — PRD (`agents.md`) and future architecture/prompt documentation.

## Prompt Spec

Structured prompt schemas live in `src/lib/prompts.ts`:

- **Alignment Prompt** → `THESIS_ALIGNMENT_SCHEMA` returns thesis summary, sectors, long/short baskets, rationale, and confidence notes.
- **Review Prompt** → `THESIS_REVIEW_SCHEMA` returns pros/cons, related themes, counter theses, and a confidence level.

Both prompts run with `gpt-4.1` using medium reasoning effort and JSON schema enforcement for deterministic parsing.

## Paper Trading Model

- `POST /api/paper-trades` writes trades against a thesis (no auth / ownership checks yet).
- `GET /api/paper-trades?thesis_id=...` pulls trades for a thesis. Client-side refresh hits the API endpoint.
- Trades default to static P/L; plug in live price refreshes by updating `current_price`/`pnl` via cron or Edge function.

## Operational Notes

- **Auth**: Disabled for now. Tables are wide open so the app runs locally without JWTs. Swap in BetterAuth (or any provider) and tighten policies when you’re ready.
- **Market data**: When API keys are missing, the UI gracefully informs the user (quotes list stays empty).
- **Community feed**: Aggregates directly from Postgres; seed sample theses if you want data on first load.
- **Analytics**: Instrumentation surfaces are marked but disabled by default; integrate PostHog/Plausible when ready.

## Scripts

| Command          | Purpose                           |
| ---------------- | --------------------------------- |
| `npm run dev`    | Start local dev server            |
| `npm run build`  | Build for production              |
| `npm run lint`   | ESLint (Next config)              |
| `npm run start`  | Run production build locally      |

## Roadmap

- Live brokerage integration (Alpaca/DriveWealth adapters)
- Confidence visualization and alerting
- AI-generated contrarian theses & macro dashboards
- Expanded community social features (follow, comment, share)

---

Built for thesis-driven investors who want to validate ideas safely before ever risking capital. Paper trading only — **not financial advice**.
