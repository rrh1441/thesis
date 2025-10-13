import { NextResponse } from 'next/server';
import { z } from 'zod';

import { getSupabaseAdmin } from '@/lib/supabase/admin';

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
    const supabase = getSupabaseAdmin();

    if (!supabase) {
      return NextResponse.json({ data: [] });
    }

    const { data, error } = await supabase
      .from('theses')
      .select('id, text, summary, created_at, confidence_level')
      .order('created_at', { ascending: false })
      .limit(20);

    if (error) {
      throw error;
    }

    return NextResponse.json({ data });
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
    const supabase = getSupabaseAdmin();

    if (!supabase) {
      return NextResponse.json(
        { error: 'Database client not configured.' },
        { status: 500 }
      );
    }

    const json = await request.json();
    const payload = thesisSchema.parse(json);

    const { data, error } = await supabase
      .from('theses')
      .insert({
        ...payload,
        user_id: null,
      })
      .select('id, created_at')
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json({ data });
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
