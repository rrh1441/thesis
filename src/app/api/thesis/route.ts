import { NextResponse } from 'next/server';
import { z } from 'zod';

import { fetchQuotes } from '@/lib/market-data';
import { generateThesisAlignment } from '@/lib/thesis';

const requestSchema = z.object({
  text: z
    .string()
    .min(10, 'Please provide a bit more detail so we can analyze your thesis.'),
});

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const { text } = requestSchema.parse(json);

    const alignment = await generateThesisAlignment(text);
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

    return NextResponse.json(
      { error: 'Failed to analyze thesis. Please try again shortly.' },
      { status: 500 }
    );
  }
}
