import { NextResponse } from 'next/server';
import { z } from 'zod';

import { query } from '@/lib/db';

type PaperTradeRow = {
  id: string;
  thesis_id: string;
  ticker: string;
  direction: 'long' | 'short';
  quantity: number | string;
  entry_price: number | string;
  current_price: number | string | null;
  pnl: number | string | null;
  created_at: string;
};

type NormalizedPaperTrade = Omit<PaperTradeRow, 'quantity' | 'entry_price' | 'current_price' | 'pnl'> & {
  quantity: number;
  entry_price: number;
  current_price: number | null;
  pnl: number | null;
};

function normalizeTrade(row: PaperTradeRow): NormalizedPaperTrade {
  return {
    ...row,
    quantity: Number(row.quantity),
    entry_price: Number(row.entry_price),
    current_price:
      row.current_price === null || row.current_price === undefined
        ? null
        : Number(row.current_price),
    pnl:
      row.pnl === null || row.pnl === undefined ? null : Number(row.pnl),
  };
}

const tradeSchema = z.object({
  thesis_id: z.string().uuid(),
  ticker: z.string().min(1),
  direction: z.enum(['long', 'short']),
  quantity: z.number().positive(),
  entry_price: z.number().positive(),
  current_price: z.number().positive().optional(),
  pnl: z.number().optional(),
});

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const thesisId = searchParams.get('thesis_id');

    if (!thesisId) {
      return NextResponse.json(
        { error: 'thesis_id query parameter is required.' },
        { status: 400 }
      );
    }

    const rows = await query<PaperTradeRow>(
      `
        SELECT id,
               thesis_id,
               ticker,
               direction,
               quantity,
               entry_price,
               current_price,
               pnl,
               created_at
        FROM paper_trades
        WHERE thesis_id = $1
        ORDER BY created_at DESC
      `,
      [thesisId]
    );

    return NextResponse.json({ data: rows.map(normalizeTrade) });
  } catch (error) {
    console.error('[api/paper-trades] GET failed', error);
    return NextResponse.json(
      { error: 'Unable to load paper trades.' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const payload = tradeSchema.parse(await request.json());
    const rows = await query<PaperTradeRow>(
      `
        INSERT INTO paper_trades (
          thesis_id,
          ticker,
          direction,
          quantity,
          entry_price,
          current_price,
          pnl
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING id,
                  thesis_id,
                  ticker,
                  direction,
                  quantity,
                  entry_price,
                  current_price,
                  pnl,
                  created_at
      `,
      [
        payload.thesis_id,
        payload.ticker.toUpperCase(),
        payload.direction,
        payload.quantity,
        payload.entry_price,
        payload.current_price ?? payload.entry_price,
        payload.pnl ?? 0,
      ]
    );

    return NextResponse.json({ data: normalizeTrade(rows[0]) });
  } catch (error) {
    console.error('[api/paper-trades] POST failed', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: error.issues[0]?.message ?? 'Invalid payload provided.',
        },
        { status: 422 }
      );
    }

    return NextResponse.json(
      { error: 'Unable to create paper trade.' },
      { status: 500 }
    );
  }
}
