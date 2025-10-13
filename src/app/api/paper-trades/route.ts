import { NextResponse } from 'next/server';
import { z } from 'zod';

import { getSupabaseAdmin } from '@/lib/supabase/admin';

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

    const supabase = getSupabaseAdmin();

    if (!supabase) {
      return NextResponse.json(
        { error: 'Database client not configured.' },
        { status: 500 }
      );
    }

    const { data, error } = await supabase
      .from('paper_trades')
      .select('*')
      .eq('thesis_id', thesisId)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return NextResponse.json({ data });
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
    const supabase = getSupabaseAdmin();

    if (!supabase) {
      return NextResponse.json(
        { error: 'Database client not configured.' },
        { status: 500 }
      );
    }

    const { data, error } = await supabase
      .from('paper_trades')
      .insert({
        thesis_id: payload.thesis_id,
        ticker: payload.ticker.toUpperCase(),
        direction: payload.direction,
        quantity: payload.quantity,
        entry_price: payload.entry_price,
        current_price: payload.current_price ?? payload.entry_price,
        pnl: payload.pnl ?? 0,
      })
      .select('*')
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json({ data });
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
