import { NextResponse } from 'next/server';
import { z } from 'zod';

import { query } from '@/lib/db';

type ThesisRow = {
  id: string;
  text: string;
  summary: string | null;
  tickers_long: unknown;
  tickers_short: unknown;
  rationale: string | null;
  confidence_level: 'low' | 'medium' | 'high' | null;
  created_at: string;
};

const tickerSchema = z.object({
  symbol: z.string(),
  conviction: z.enum(['low', 'medium', 'high']).optional(),
  rationale: z.string().optional(),
  suggested_weight: z.number().optional(),
  confidence: z.enum(['low', 'medium', 'high']).optional(),
});

const thesisSchema = z.object({
  text: z.string().min(10),
  summary: z.string().optional(),
  tickers_long: z.array(tickerSchema).optional(),
  tickers_short: z.array(tickerSchema).optional(),
  rationale: z.string().optional(),
  confidence_level: z.enum(['low', 'medium', 'high']).optional(),
});

export async function GET() {
  try {
    const rows = await query<Pick<ThesisRow, 'id' | 'text' | 'summary' | 'created_at' | 'confidence_level'>>(
      `
        SELECT id,
               text,
               summary,
               created_at,
               confidence_level
        FROM theses
        ORDER BY created_at DESC
        LIMIT 20
      `
    );

    return NextResponse.json({ data: rows });
  } catch (error) {
    console.error('[api/theses] GET failed', error);
    return NextResponse.json(
      { error: 'Unable to load theses.' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const payload = thesisSchema.parse(json);

    const rows = await query<Pick<ThesisRow, 'id' | 'created_at'>>(
      `
        INSERT INTO theses (
          text,
          summary,
          tickers_long,
          tickers_short,
          rationale,
          confidence_level
        )
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING id, created_at
      `,
      [
        payload.text,
        payload.summary ?? null,
        payload.tickers_long ? JSON.stringify(payload.tickers_long) : null,
        payload.tickers_short ? JSON.stringify(payload.tickers_short) : null,
        payload.rationale ?? null,
        payload.confidence_level ?? null,
      ]
    );

    return NextResponse.json({ data: rows[0] });
  } catch (error) {
    console.error('[api/theses] POST failed', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0]?.message ?? 'Invalid payload.' },
        { status: 422 }
      );
    }

    return NextResponse.json(
      { error: 'Unable to save thesis.' },
      { status: 500 }
    );
  }
}
