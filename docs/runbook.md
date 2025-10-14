## Thesis Runbook

### Environment

Create `.env.local` from `.env.example` and set:

| Variable                      | Description                                              |
| ----------------------------- | -------------------------------------------------------- |
| `DATABASE_URL`                | Postgres connection string (e.g. `postgres://...`)       |
| `OPENAI_API_KEY`              | API key with access to `gpt-4.1` or higher               |
| `MARKET_DATA_PROVIDER`        | `polygon` (default) or `finnhub`                         |
| `POLYGON_API_KEY`             | (Optional) Quote streaming for equities                  |
| `FINNHUB_API_KEY`             | (Optional) Alternative quote source                      |

### Database

1. Ensure Postgres 14+ is running locally (Docker, Homebrew, etc.).

2. Apply schema:

   ```bash
   psql "$DATABASE_URL" -f db/schema.sql
   ```

3. Optional: Seed `theses` and `paper_trades` with demo rows to light up the community feed.

### OpenAI Prompts

- **Alignment**: `src/lib/prompts.ts > THESIS_ALIGNMENT_SCHEMA`
  - Captures sectors, tickers, rationale, and confidence notes.
  - Model: `gpt-4.1`, temperature `0.4`, JSON schema enforcement.
- **Review**: `THESIS_REVIEW_SCHEMA`
  - Produces pros/cons, related themes, counter theses, and confidence.

Both functions live in `src/lib/thesis.ts`.

### API Endpoints

| Route                  | Auth | Description                                  |
| ---------------------- | ---- | -------------------------------------------- |
| `POST /api/thesis`     | ❌   | Analyze user belief, return alignment JSON   |
| `POST /api/review`     | ❌   | Generate research brief (accepts thesis ID or summary) |
| `GET/POST /api/theses` | ❌   | List and create theses (user_id is nullable) |
| `GET/POST /api/paper-trades` | ❌ | Paper trade CRUD without ownership checks |
| `GET /api/community`   | ❌   | Aggregated community feed                      |

### Market Data

`src/lib/market-data.ts` abstracts Polygon/Finnhub. When no key is supplied the UI shows a helper message and falls back to static pricing.

### Operations

- **Error logging**: Server logs print to stdout (`console.error`). Hook metrics once observability stack is ready.
- **Deployment**: Set environment variables in Vercel/Render. Keep `DATABASE_URL` and `OPENAI_API_KEY` in encrypted secrets — never expose them client-side.

### Next Steps

1. Wire analytics (PostHog/Plausible) to track KPI targets.
2. Add cron/Edge job updating `paper_trades.current_price` using market data.
3. Implement social sharing (Open Graph cards) for saved theses.
4. Harden AI responses with additional validation and guardrails (e.g. symbol whitelist).
