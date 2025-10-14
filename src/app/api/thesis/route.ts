import { NextResponse } from 'next/server';
import { z } from 'zod';

import { fetchQuotes } from '@/lib/market-data';
import { generateThesisAlignment } from '@/lib/thesis';
import { enforceThesisCooldown } from '@/lib/rate-limit';
import {
  sanitizeThesisInput,
  ThesisInjectionDetectedError,
  ThesisValidationError,
} from '@/lib/thesis-guards';

const requestSchema = z.object({
  text: z
    .string()
    .min(10, 'Please provide a bit more detail so we can analyze your thesis.'),
});

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const { text } = requestSchema.parse(json);

    const throttle = enforceThesisCooldown(60_000);

    if (!throttle.ok) {
      return NextResponse.json(
        { error: 'You can analyze once per minute. Please wait a bit before trying again.' },
        {
          status: 429,
          headers: throttle.retryAfter
            ? { 'Retry-After': Math.ceil(throttle.retryAfter / 1000).toString() }
            : undefined,
        }
      );
    }

    const safeText = sanitizeThesisInput(text);
    const alignment = await generateThesisAlignment(safeText);
    const uniqueSymbols = [
      ...new Set([
        ...alignment.tickers_long.map((item) => item.symbol),
        ...alignment.tickers_short.map((item) => item.symbol),
      ]),
    ];

    const quotes = uniqueSymbols.length
      ? await fetchQuotes(uniqueSymbols)
      : [];

    return NextResponse.json({
      thesis: alignment,
      quotes,
    });
  } catch (error) {
    console.error('[api/thesis] failed', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0]?.message ?? 'Invalid request' },
        { status: 422 }
      );
    }

    if (error instanceof ThesisInjectionDetectedError) {
      return NextResponse.json({ error: error.message }, { status: 422 });
    }

    if (error instanceof ThesisValidationError) {
      return NextResponse.json({ error: error.message }, { status: 422 });
    }

    return NextResponse.json(
      { error: 'Failed to analyze thesis. Please try again shortly.' },
      { status: 500 }
    );
  }
}
