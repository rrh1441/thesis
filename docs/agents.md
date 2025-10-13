Excellent — that’s the right instinct.
Leading with the *“I think → paper trade”* brokerage model makes Thesis immediately tangible, investable, and media-friendly, while still skirting regulatory exposure since no real trades or advice are executed.

Below is a **full PRD** (Product Requirements Document) for *Thesis* as a paper-trading brokerage prototype — ready for handoff to your agent or engineering team. It’s structured for direct implementation, covering UX, architecture, and data flow.

---

# **Product Requirements Document: Thesis**

**Version:** 1.0
**Date:** 2025-10-12
**Owner:** Ryan Heger
**Goal:** MVP web app enabling users to express investment theses in natural language and receive AI-generated investment implications, research insights, and paper-trading options.

---

## **1. Overview**

### **Concept**

**Thesis** turns beliefs about the world into simulated portfolios.
Users start with an opinion — “I think…” — and Thesis translates it into investable implications powered by the OpenAI API and real market data.

**Example:**

> “I think the economy is going to get better.”

→ AI response:
“If this were true, you’d expect cyclical stocks and small caps to outperform.
Suggested positions: Long XLF, XLI, IWM; Short TLT.”

From there, users can:

* Save the thesis
* Simulate trades (paper trading)
* Review pros & cons behind the thesis (locked behind account creation)

---

## **2. Goals and Success Metrics**

### **Primary Goals**

* Deliver a seamless “belief → investment simulation” experience.
* Generate early engagement and user-created theses for PR and investor traction.
* Build a clean technical foundation for future live-trading expansion.

### **Success Metrics (MVP)**

| Metric                                   | Target  |
| ---------------------------------------- | ------- |
| Landing page conversion to first thesis  | ≥ 30 %  |
| Avg. session length                      | ≥ 3 min |
| % of users who sign up for deeper review | ≥ 25 %  |
| Avg. # of theses per user                | ≥ 2     |

---

## **3. User Personas**

| Persona                    | Description                                                          | Goals                                                     |
| -------------------------- | -------------------------------------------------------------------- | --------------------------------------------------------- |
| **Curious Investor**       | Non-professional user who wants to test ideas like “AI is overhyped” | Explore AI-driven reasoning; test investment ideas safely |
| **Retail Trader**          | Familiar with stocks/options                                         | Use paper trading to simulate outcomes                    |
| **Financial Professional** | Advisor, RIA, or fintech founder                                     | Assess Thesis for integration or investment               |

---

## **4. User Experience Flow**

### **Landing Page (“I think…”)**

* Minimal hero section:

  * Large text: **“I think”**
  * Free-text input box (placeholder: *the economy is going to get better*)
  * Button: “See what that would mean”

#### **Below the fold:**

* Example community theses (auto-rotating cards):

  * “AI will replace coders.” → *Long NVDA, Short IBM*
  * “Rates will stay high.” → *Long XLF, Short QQQ*
* CTA: *Try your own thesis.*

---

### **Step 1: Thesis → AI Analysis**

User submits belief → API pipeline:

1. Normalize language (strip fluff)
2. Send to OpenAI with structured prompt:

   ```
   If this were true, what investments would align?
   Return structured JSON with:
   - thesis_summary
   - sectors_affected
   - tickers_long
   - tickers_short
   - rationale
   ```
3. Display output with clear visual mapping:

   * “If true…” header
   * “Investments that would align” cards (ticker + rationale + 1-line description)

**Actions:**

* “Save Thesis” (requires account)
* “Simulate Trades” (creates paper portfolio)
* “View Pros & Cons” (requires login / subscription)

---

### **Step 2: Thesis Review (Login-Only)**

* Deeper GPT call for:

  * Pros / Cons summary
  * Historical analogs
  * Counter-theses
* Shown as collapsible “Research Brief”

  * Pros (green)
  * Cons (red)
  * Related macro signals (optional)

---

### **Step 3: Paper Trading**

* Pre-filled with AI-suggested tickers
* User sets position size / direction / duration
* Portfolio simulator tracks:

  * Hypothetical P/L
  * Thesis success rate
* Stored per user via Supabase or Firebase

---

### **Step 4: Community Layer**

* Public feed of popular theses:

  * Username, thesis summary, return %, confidence score
* Sort by *Trending*, *Most Accurate*, *Newest*
* Encourage sharing to social (OpenGraph cards)

---

## **5. Functional Requirements**

| Category                 | Requirement                             | Details                                   |
| ------------------------ | --------------------------------------- | ----------------------------------------- |
| **Auth**                 | Supabase Auth (email + OAuth)           | Required for saving & paper trading       |
| **Database**             | Supabase Postgres                       | Tables: users, theses, trades, portfolios |
| **AI Integration**       | OpenAI GPT-4o / GPT-5                   | Two endpoints: Alignment & Review         |
| **Market Data**          | Polygon.io / Finnhub API                | Prices + sectors + symbols                |
| **Paper Trading Engine** | Local simulation                        | Track prices vs timestamps daily          |
| **UI Framework**         | Next.js + Tailwind (shadcn/ui optional) | Responsive web / mobile                   |
| **Payments (future)**    | Stripe Subscription                     | Monetize research layer                   |
| **Analytics**            | PostHog or Plausible                    | Engagement + conversion                   |

---

## **6. Non-Functional Requirements**

| Category        | Requirement                                              |
| --------------- | -------------------------------------------------------- |
| **Scalability** | 1 000 DAU minimum on Supabase free tier                  |
| **Latency**     | < 4 s AI response average                                |
| **Compliance**  | Paper-trade only — include “Not Financial Advice” footer |
| **Security**    | Secure API key storage via Supabase Vault or .env        |

---

## **7. Data Model (Simplified)**

### **Table: `users`**

| Field      | Type      |
| ---------- | --------- |
| id         | uuid (PK) |
| email      | text      |
| name       | text      |
| created_at | timestamp |

### **Table: `theses`**

| Field         | Type      |
| ------------- | --------- |
| id            | uuid      |
| user_id       | uuid (FK) |
| text          | text      |
| summary       | text      |
| tickers_long  | jsonb     |
| tickers_short | jsonb     |
| rationale     | text      |
| created_at    | timestamp |

### **Table: `paper_trades`**

| Field         | Type             |
| ------------- | ---------------- |
| id            | uuid             |
| thesis_id     | uuid (FK)        |
| ticker        | text             |
| direction     | enum(long/short) |
| quantity      | numeric          |
| entry_price   | numeric          |
| current_price | numeric          |
| pnl           | numeric          |
| created_at    | timestamp        |

---

## **8. API Flow**

### **POST /api/thesis**

**Input:**

```json
{ "text": "the economy is going to get better" }
```

**Output:**

```json
{
  "summary": "Expectation of economic recovery",
  "longs": ["XLF", "XLI", "IWM"],
  "shorts": ["TLT"],
  "rationale": "Improving growth benefits cyclicals and small caps."
}
```

### **POST /api/review** *(Auth Required)*

**Input:**

```json
{ "thesis_id": "uuid" }
```

**Output:**

```json
{
  "pros": ["Falling inflation", "Rate cuts expected"],
  "cons": ["Geopolitical shocks", "Recession lag effects"],
  "related_themes": ["Consumer sentiment", "Industrial production"]
}
```

---

## **9. Visual & Brand**

| Element               | Style                                                                                   |
| --------------------- | --------------------------------------------------------------------------------------- |
| **Logo / Typography** | Sans-serif (Inter / Neue Haas Grotesk)                                                  |
| **Palette**           | Deep charcoal (#0E0E0E), white (#FFFFFF), signal green (#00C853), muted amber (#FFB300) |
| **Tone**              | Confident, modern, cerebral                                                             |
| **Hero Copy**         | “I think…” → “If that’s true, here’s what it means.”                                    |
| **CTA**               | “Start your Thesis”                                                                     |

---

## **10. Future Extensions**

* Real brokerage API integration (Alpaca / DriveWealth)
* AI-generated “Contrarian Radar” (aggregate inverse correlations)
* Portfolio tracking + alerts
* Institutional dashboards (multi-thesis analytics)
* Social features: follow, comment, compare performance

---

## **11. Open Questions**

* Which GPT model version to use (4o vs 5) for JSON reliability?
* How to visually show confidence / uncertainty in suggestions?
* Should the landing input require examples or allow any topic (politics, tech, macro)?
* How to seed community theses (manual or generated)?

---

Would you like me to append a **technical architecture diagram (API + data flow + frontend)** and a **prompt spec** for the OpenAI calls next? Those would complete what an engineering agent would need to start building the MVP.
