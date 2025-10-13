import { NextResponse } from 'next/server';

import { getSupabaseAdmin } from '@/lib/supabase/admin';
import type { Database } from '@/types/database';

type CommunityThesisRow = Database['public']['Tables']['theses']['Row'] & {
  paper_trades: Array<
    Pick<Database['public']['Tables']['paper_trades']['Row'], 'pnl'>
  > | null;
  users: Pick<Database['public']['Tables']['users']['Row'], 'id' | 'name'> | null;
};

export async function GET() {
  try {
    const supabase = getSupabaseAdmin();

    if (!supabase) {
      return NextResponse.json({ data: [] });
    }

    const { data, error } = await supabase
      .from('theses')
      .select(
        `
        id,
        text,
        summary,
        confidence_level,
        created_at,
        paper_trades (
          pnl
        ),
        users (
          id,
          name
        )
      `
      )
      .order('created_at', { ascending: false })
      .limit(20);

    if (error) {
      throw error;
    }

    const enriched = (data as CommunityThesisRow[]).map((item) => {
      const trades = item.paper_trades ?? [];
      const totalPnl = trades.reduce(
        (accumulator, trade) => accumulator + (trade.pnl ?? 0),
        0
      );

      return {
        id: item.id,
        text: item.text,
        summary: item.summary,
        confidence_level: item.confidence_level,
        created_at: item.created_at,
        total_pnl: totalPnl,
        trade_count: trades.length,
        user_name: item.users?.name ?? 'Anonymous analyst',
      };
    });

    return NextResponse.json({ data: enriched });
  } catch (error) {
    console.error('[api/community] GET failed', error);
    return NextResponse.json(
      { error: 'Unable to load community theses.' },
      { status: 500 }
    );
  }
}
