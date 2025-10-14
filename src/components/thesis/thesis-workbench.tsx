'use client';

import { useEffect, useState } from 'react';
import { AlertTriangle, ArrowRight, BrainCircuit, Flame, Layers } from 'lucide-react';

import type { ThesisAlignment, ThesisReview } from '@/lib/thesis';
import type { MarketQuote } from '@/lib/market-data';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ThesisResponse {
  thesis: ThesisAlignment;
  quotes: MarketQuote[];
}

type ThesisWorkbenchProps = {
  initialThesis?: string;
};

export function ThesisWorkbench({ initialThesis }: ThesisWorkbenchProps) {
  const [thesisText, setThesisText] = useState(initialThesis ?? '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<ThesisResponse | null>(null);
  const [saving, setSaving] = useState(false);
  const [savedThesisId, setSavedThesisId] = useState<string | null>(null);
  const [reviewLoading, setReviewLoading] = useState(false);
  const [review, setReview] = useState<ThesisReview | null>(null);
  const [reviewError, setReviewError] = useState<string | null>(null);

  const primarySymbol =
    analysis?.thesis.tickers_long[0]?.symbol ??
    analysis?.thesis.tickers_short[0]?.symbol ??
    '';
  const primaryQuote = analysis?.quotes.find((quote) => quote.symbol === primarySymbol);

  useEffect(() => {
    if (!initialThesis) {
      return;
    }

    setThesisText(initialThesis);
    requestAnimationFrame(() => {
      const target = document.getElementById('thesis-workbench');
      target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
    // Scroll once when prefilled from the hero.
  }, [initialThesis]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setAnalysis(null);
    setReview(null);
    setSavedThesisId(null);

    try {
      const response = await fetch('/api/thesis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: thesisText }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error ?? 'Unable to analyze thesis.');
      }

      const json = (await response.json()) as ThesisResponse;
      setAnalysis(json);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveThesis = async () => {
    if (!analysis) {
      setError('Run an analysis before saving.');
      return;
    }

    setSaving(true);
    setError(null);
    try {
      const response = await fetch('/api/theses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: thesisText,
          summary: analysis.thesis.thesis_summary,
          tickers_long: analysis.thesis.tickers_long,
          tickers_short: analysis.thesis.tickers_short,
          rationale: analysis.thesis.rationale,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error ?? 'Failed to save thesis.');
      }

      const result = (await response.json()) as { data: { id: string } };
      setSavedThesisId(result.data.id);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Unable to save thesis. Please try again.'
      );
    } finally {
      setSaving(false);
    }
  };

  const handleFetchReview = async () => {
    if (!analysis) {
      setReviewError('Run an analysis before requesting the research brief.');
      return;
    }

    setReviewLoading(true);
    setReviewError(null);

    try {
      const payload = savedThesisId
        ? { thesis_id: savedThesisId }
        : { summary: analysis.thesis.thesis_summary };

      const response = await fetch('/api/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error ?? 'Failed to load research brief.');
      }

      const { review: reviewData } = (await response.json()) as { review: ThesisReview };
      setReview(reviewData);
    } catch (err) {
      setReviewError(
        err instanceof Error ? err.message : 'Unable to load research brief.'
      );
    } finally {
      setReviewLoading(false);
    }
  };

  return (
    <section className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-6 py-16">
      <form
        onSubmit={handleSubmit}
        className="rounded-[32px] border border-zinc-900 bg-black/40 p-10 shadow-[0_40px_140px_rgba(0,0,0,0.45)] backdrop-blur"
      >
        <div className="mb-6 flex items-center gap-3 text-sm uppercase tracking-[0.3em] text-zinc-500">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-green-500/10 text-green-400">
            Ƭ
          </span>
          I think...
        </div>

        <Textarea
          value={thesisText}
          onChange={(event) => setThesisText(event.target.value)}
          placeholder="the economy is going to get better"
          rows={4}
          required
        />

        <div className="mt-6 flex flex-wrap items-center gap-4">
          <Button type="submit" size="lg" isLoading={loading}>
            See what that would mean
            <ArrowRight size={18} className="ml-2" />
          </Button>
          <p className="text-sm text-zinc-500">
            Thesis runs on AI guidance. We never place real trades without permission.
          </p>
        </div>

        {error && (
          <p className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {error}
          </p>
        )}
      </form>

      {analysis && (
        <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
          <div className="flex flex-col gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-xl">
                  <BrainCircuit size={20} className="text-green-400" />
                  If that&apos;s true, here&apos;s how markets react
                </CardTitle>
                <p className="text-sm text-zinc-400">
                  Thesis summary: {analysis.thesis.thesis_summary}
                </p>
              </CardHeader>
              <CardContent className="grid gap-6">
                <div className="grid gap-3">
                  <h4 className="text-sm font-semibold uppercase tracking-wide text-zinc-400">
                    Sectors most sensitive
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {analysis.thesis.sectors_affected.map((sector) => (
                      <Badge
                        key={sector.name}
                        tone={
                          sector.direction === 'positive'
                            ? 'positive'
                            : sector.direction === 'negative'
                              ? 'negative'
                              : 'neutral'
                        }
                      >
                        {sector.name}
                      </Badge>
                    ))}
                    {!analysis.thesis.sectors_affected.length && (
                      <p className="text-sm text-zinc-500">
                        No specific sectors flagged.
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid gap-4">
                  <h4 className="text-sm font-semibold uppercase tracking-wide text-zinc-400">
                    Suggested positions
                  </h4>
                  <div className="grid gap-4 md:grid-cols-2">
                    <PositionList
                      label="Go long"
                      positions={analysis.thesis.tickers_long}
                      accent="positive"
                    />
                    <PositionList
                      label="Go short"
                      positions={analysis.thesis.tickers_short}
                      accent="negative"
                    />
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-semibold uppercase tracking-wide text-zinc-400">
                    Core rationale
                  </h4>
                  <p className="mt-2 text-sm leading-relaxed text-zinc-200">
                    {analysis.thesis.rationale}
                  </p>
                </div>

                {!!analysis.thesis.confidence_notes.length && (
                  <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-amber-200">
                    <p className="mb-2 flex items-center gap-2 font-semibold uppercase tracking-wide">
                      <AlertTriangle size={16} />
                      Confidence notes
                    </p>
                    <ul className="list-disc pl-5">
                      {analysis.thesis.confidence_notes.map((note) => (
                        <li key={note} className="leading-relaxed">
                          {note}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-lg text-white">
                  <Layers size={18} className="text-green-400" />
                  AI Research Brief
                </CardTitle>
                <p className="text-sm text-zinc-400">
                  Save to keep your thesis and unlock a deeper pros/cons breakdown.
                </p>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                <div className="flex flex-wrap gap-3">
                  <Button
                    variant="secondary"
                    onClick={handleSaveThesis}
                    isLoading={saving}
                    disabled={!!savedThesisId}
                  >
                    {savedThesisId ? 'Thesis saved' : 'Save thesis'}
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={handleFetchReview}
                    isLoading={reviewLoading}
                  >
                    View pros &amp; cons
                  </Button>
                </div>

                {reviewError && (
                  <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                    {reviewError}
                  </p>
                )}

                {review && (
                  <div className="grid gap-4 md:grid-cols-2">
                    <ReviewList title="Pros" items={review.pros} tone="positive" />
                    <ReviewList title="Cons" items={review.cons} tone="negative" />
                    <ReviewList
                      title="Related themes"
                      items={review.related_themes}
                    />
                    <ReviewList
                      title="Counter theses"
                      items={review.counter_theses}
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <aside className="flex flex-col gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base text-white">
                  <Flame size={16} className="text-green-400" />
                  Market glance
                </CardTitle>
                <p className="text-xs uppercase tracking-wide text-zinc-500">
                  Live quotes for suggested tickers
                </p>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                {analysis.quotes.length ? (
                  analysis.quotes.map((quote) => (
                    <div
                      key={quote.symbol}
                      className="flex items-center justify-between rounded-2xl border border-zinc-900 bg-zinc-950/40 px-4 py-3"
                    >
                      <div>
                        <p className="text-sm font-semibold text-white">{quote.symbol}</p>
                        <p className="text-xs text-zinc-500">
                          Updated {new Date(quote.updatedAt).toLocaleTimeString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-white">
                          ${quote.price.toFixed(2)}
                        </p>
                        {quote.changePercent !== null ? (
                          <span
                            className={`text-xs font-medium ${
                              quote.changePercent >= 0
                                ? 'text-green-400'
                                : 'text-red-400'
                            }`}
                          >
                            {quote.changePercent >= 0 ? '+' : ''}
                            {quote.changePercent.toFixed(2)}%
                          </span>
                        ) : (
                          <span className="text-xs text-zinc-500">n/a</span>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-zinc-500">
                    Connect Polygon or Finnhub API keys to stream live quotes.
                  </p>
                )}
              </CardContent>
            </Card>

            {savedThesisId && (
              <PaperTradingPanel
                thesisId={savedThesisId}
                defaultTicker={primarySymbol}
                defaultPrice={primaryQuote?.price ?? analysis.quotes[0]?.price}
              />
            )}
          </aside>
        </div>
      )}
    </section>
  );
}

function PositionList({
  label,
  positions,
  accent,
}: {
  label: string;
  positions: ThesisAlignment['tickers_long'];
  accent: 'positive' | 'negative';
}) {
  return (
    <div className="rounded-2xl border border-zinc-900 bg-zinc-950/40 p-4">
      <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-zinc-500">
        {label}
      </p>
      <div className="flex flex-col gap-3">
        {positions.map((position) => (
          <div key={position.symbol} className="flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-white">
                {position.symbol}
              </span>
              <Badge tone={accent} className="text-[10px]">
                {(position.conviction ?? 'medium').toUpperCase()} conviction
              </Badge>
            </div>
            {typeof position.suggested_weight === 'number' && (
              <p className="text-[11px] text-zinc-500">
                Suggested allocation: {(position.suggested_weight * 100).toFixed(0)}%
              </p>
            )}
            <p className="text-xs leading-relaxed text-zinc-400">
              {position.rationale}
            </p>
          </div>
        ))}
        {!positions.length && (
          <p className="text-xs text-zinc-500">No clear positions identified.</p>
        )}
      </div>
    </div>
  );
}

function ReviewList({
  title,
  items,
  tone = 'neutral',
}: {
  title: string;
  items: string[];
  tone?: 'neutral' | 'positive' | 'negative';
}) {
  if (!items.length) return null;

  return (
    <div className="rounded-2xl border border-zinc-900 bg-zinc-950/40 p-4">
      <p className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-zinc-500">
        {title}
      </p>
      <ul className="flex flex-col gap-2 text-sm text-zinc-300">
        {items.map((item) => (
          <li
            key={item}
            className={`rounded-xl border px-3 py-2 ${
              tone === 'positive'
                ? 'border-green-500/30 bg-green-500/5 text-green-200'
                : tone === 'negative'
                  ? 'border-red-500/30 bg-red-500/5 text-red-200'
                  : 'border-zinc-800 bg-zinc-900/40'
            }`}
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

function PaperTradingPanel({
  thesisId,
  defaultTicker,
  defaultPrice,
}: {
  thesisId: string;
  defaultTicker?: string;
  defaultPrice?: number;
}) {
  const [loading, setLoading] = useState(false);
  const [trades, setTrades] = useState<
    Array<{
      id: string;
      ticker: string;
      direction: 'long' | 'short';
      quantity: number;
      entry_price: number;
      pnl: number | null;
    }>
  >([]);
  const [error, setError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [ticker, setTicker] = useState(defaultTicker ?? '');
  const [direction, setDirection] = useState<'long' | 'short'>('long');
  const [quantity, setQuantity] = useState(100);
  const fallbackPrice = defaultPrice && defaultPrice > 0 ? defaultPrice : 1;
  const [entryPrice, setEntryPrice] = useState(fallbackPrice);

  const refreshTrades = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/paper-trades?thesis_id=${thesisId}`);
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error ?? 'Unable to load paper trades.');
      }

      const { data } = (await response.json()) as {
        data: Array<{
          id: string;
          ticker: string;
          direction: 'long' | 'short';
          quantity: number;
          entry_price: number;
          pnl: number | null;
        }>;
      };

      setTrades(data ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load paper trades.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setTicker(defaultTicker ?? '');
    const nextPrice = defaultPrice && defaultPrice > 0 ? defaultPrice : 1;
    setEntryPrice(nextPrice);
    void refreshTrades();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [thesisId, defaultTicker, defaultPrice]);

  const handleCreateTrade = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setCreating(true);
    setError(null);

    try {
      const response = await fetch('/api/paper-trades', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          thesis_id: thesisId,
          ticker,
          direction,
          quantity,
          entry_price: entryPrice,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error ?? 'Failed to create trade.');
      }

      setTicker('');
      setQuantity(100);
      setEntryPrice(defaultPrice && defaultPrice > 0 ? defaultPrice : 1);
      await refreshTrades();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to create trade.');
    } finally {
      setCreating(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base text-white">
          Paper trades
        </CardTitle>
        <p className="text-xs text-zinc-500">
          Track how this thesis performs against live market prices.
        </p>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <form
          onSubmit={handleCreateTrade}
          className="grid grid-cols-2 gap-3 rounded-2xl border border-zinc-900 bg-zinc-950/40 p-4 text-sm"
        >
          <div className="col-span-2 flex items-center gap-2 text-xs uppercase tracking-wide text-zinc-500">
            Size a trade
          </div>
          <div className="col-span-1">
            <label className="mb-1 block text-xs text-zinc-500">Ticker</label>
            <input
              value={ticker}
              onChange={(event) => setTicker(event.target.value.toUpperCase())}
              className="w-full rounded-lg border border-zinc-800 bg-black/40 px-3 py-2 text-sm text-white focus:border-green-500 focus:outline-none"
              placeholder="IWM"
              required
            />
          </div>
          <div className="col-span-1">
            <label className="mb-1 block text-xs text-zinc-500">Direction</label>
            <select
              value={direction}
              onChange={(event) => setDirection(event.target.value as 'long' | 'short')}
              className="w-full rounded-lg border border-zinc-800 bg-black/40 px-3 py-2 text-sm text-white focus:border-green-500 focus:outline-none"
            >
              <option value="long">Long</option>
              <option value="short">Short</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs text-zinc-500">Quantity</label>
            <input
              type="number"
              min={1}
              value={quantity}
              onChange={(event) => setQuantity(Number(event.target.value))}
              className="w-full rounded-lg border border-zinc-800 bg-black/40 px-3 py-2 text-sm text-white focus:border-green-500 focus:outline-none"
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-xs text-zinc-500">Entry price</label>
            <input
              type="number"
              min={0}
              step="0.01"
              value={entryPrice}
              onChange={(event) => setEntryPrice(Number(event.target.value))}
              className="w-full rounded-lg border border-zinc-800 bg-black/40 px-3 py-2 text-sm text-white focus:border-green-500 focus:outline-none"
              required
            />
          </div>
          <div className="col-span-2 flex justify-end">
            <Button type="submit" size="sm" isLoading={creating}>
              Simulate trade
            </Button>
          </div>
        </form>
        <Button
          variant="secondary"
          size="sm"
          onClick={refreshTrades}
          isLoading={loading}
          className="self-start"
        >
          Refresh P/L
        </Button>
        {error && (
          <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-xs text-red-200">
            {error}
          </p>
        )}
        <div className="flex flex-col gap-3">
          {trades.length ? (
            trades.map((trade) => (
              <div
                key={trade.id}
                className="flex items-center justify-between rounded-2xl border border-zinc-900 bg-zinc-950/40 px-4 py-3 text-sm"
              >
                <div>
                  <p className="font-semibold text-white">
                    {trade.direction.toUpperCase()} {trade.ticker}
                  </p>
                  <p className="text-xs text-zinc-500">
                    Qty {trade.quantity} @ ${trade.entry_price.toFixed(2)}
                  </p>
                </div>
                <div className="text-right">
                  <p
                    className={`text-sm font-semibold ${
                      (trade.pnl ?? 0) >= 0 ? 'text-green-400' : 'text-red-400'
                    }`}
                  >
                    {(trade.pnl ?? 0) >= 0 ? '+' : ''}
                    {(trade.pnl ?? 0).toFixed(2)}
                  </p>
                  <p className="text-xs text-zinc-500">Unrealized P/L</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-xs text-zinc-500">
              No trades yet. Use the simulator (coming soon) to size your positions.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
