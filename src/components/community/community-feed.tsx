import { Suspense } from 'react';
import { ArrowUpRightSquare } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getSupabaseAdmin } from '@/lib/supabase/admin';
import type { Database } from '@/types/database';

interface CommunityThesis {
  id: string;
  text: string;
  summary: string | null;
  confidence_level: string | null;
  created_at: string;
  total_pnl: number;
  trade_count: number;
  user_name: string;
}

type CommunityThesisRow = Database['public']['Tables']['theses']['Row'] & {
  paper_trades: Array<
    Pick<Database['public']['Tables']['paper_trades']['Row'], 'pnl'>
  > | null;
  users: Pick<Database['public']['Tables']['users']['Row'], 'name'> | null;
};

async function loadCommunityTheses(): Promise<CommunityThesis[]> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return [];

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
          name
        )
      `
    )
    .order('created_at', { ascending: false })
    .limit(10);

  if (error || !data) {
    console.warn('[community-feed] unable to load data', error);
    return [];
  }

  return (data as CommunityThesisRow[]).map((item) => {
    const trades = item.paper_trades ?? [];
    const totalPnl = trades.reduce((accumulator, trade) => accumulator + (trade.pnl ?? 0), 0);

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
}

function ConfidenceBadge({ level }: { level: string | null }) {
  if (!level) return null;
  const normalized = level.toLowerCase();
  return (
    <Badge
      tone={
        normalized === 'high'
          ? 'positive'
          : normalized === 'low'
            ? 'negative'
            : 'neutral'
      }
      className="text-[10px]"
    >
      {normalized} confidence
    </Badge>
  );
}

async function CommunityFeedList() {
  const theses = await loadCommunityTheses();

  if (!theses.length) {
    return (
      <Card className="border-dashed border-zinc-800">
        <CardContent className="py-12 text-center text-sm text-zinc-500">
          Seed theses will show up here once Supabase is configured.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {theses.map((thesis) => (
        <Card key={thesis.id} className="hover:border-green-500/40">
          <CardHeader>
            <CardTitle className="flex items-center justify-between text-base text-white">
              <span className="line-clamp-2">{thesis.summary ?? thesis.text}</span>
              <ConfidenceBadge level={thesis.confidence_level} />
            </CardTitle>
            <p className="text-xs uppercase tracking-wide text-zinc-500">
              by {thesis.user_name}
            </p>
          </CardHeader>
          <CardContent className="flex flex-col gap-3 text-sm text-zinc-300">
            <p className="line-clamp-3 text-zinc-400">{thesis.text}</p>
            <div className="flex items-center justify-between rounded-2xl border border-zinc-900 bg-zinc-950/40 px-3 py-2 text-xs">
              <div className="flex items-center gap-3">
                <span className="font-semibold text-green-400">
                  {thesis.total_pnl >= 0 ? '+' : ''}
                  {thesis.total_pnl.toFixed(2)}%
                </span>
                <span className="text-zinc-500">
                  {thesis.trade_count} paper trade{thesis.trade_count === 1 ? '' : 's'}
                </span>
              </div>
              <button className="inline-flex items-center gap-1 text-xs text-green-400">
                View thesis
                <ArrowUpRightSquare size={14} />
              </button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export function CommunityFeed() {
  return (
    <section id="community" className="mx-auto mt-20 w-full max-w-6xl px-6">
      <div className="mb-8 flex items-end justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-zinc-500">
            Community layer
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-white">
            Trending theses from the Thesis network
          </h2>
        </div>
      </div>
      <Suspense
        fallback={
          <Card>
            <CardContent className="py-12 text-center text-sm text-zinc-500">
              Loading community theses…
            </CardContent>
          </Card>
        }
      >
        {/* @ts-expect-error Async Server Component */}
        <CommunityFeedList />
      </Suspense>
    </section>
  );
}
