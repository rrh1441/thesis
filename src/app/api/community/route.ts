import { NextResponse } from 'next/server';

import { query } from '@/lib/db';

type CommunityRow = {
  id: string;
  text: string;
  summary: string | null;
  confidence_level: 'low' | 'medium' | 'high' | null;
  created_at: string;
  total_pnl: number;
  trade_count: number;
  user_name: string | null;
};

export async function GET() {
  try {
    const rows = await query<CommunityRow>(
      `
        SELECT t.id,
               t.text,
               t.summary,
               t.confidence_level,
               t.created_at,
               COALESCE(SUM(pt.pnl), 0) AS total_pnl,
               COUNT(pt.id) AS trade_count,
               u.name AS user_name
        FROM theses t
        LEFT JOIN paper_trades pt ON pt.thesis_id = t.id
        LEFT JOIN users u ON u.id = t.user_id
        GROUP BY t.id, t.text, t.summary, t.confidence_level, t.created_at, u.name
        ORDER BY t.created_at DESC
        LIMIT 20
      `
    );

    const data = rows.map((row) => ({
      id: row.id,
      text: row.text,
      summary: row.summary,
      confidence_level: row.confidence_level,
      created_at: row.created_at,
      total_pnl: Number(row.total_pnl ?? 0),
      trade_count: Number(row.trade_count ?? 0),
      user_name: row.user_name ?? 'Anonymous analyst',
    }));

    return NextResponse.json({ data });
  } catch (error) {
    console.error('[api/community] GET failed', error);
    return NextResponse.json(
      { error: 'Unable to load community theses.' },
      { status: 500 }
    );
  }
}
