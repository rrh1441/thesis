import { NextResponse } from 'next/server';
import { z } from 'zod';

import { getSupabaseAdmin } from '@/lib/supabase/admin';
import { generateThesisReview } from '@/lib/thesis';

const requestSchema = z.object({
  thesis_id: z.string().uuid().optional(),
  summary: z.string().min(5, 'Provide a short summary for the thesis.').optional(),
});

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const { thesis_id, summary } = requestSchema.parse(json);

    let thesisSummary = summary;

    if (!thesisSummary && thesis_id) {
      const supabase = getSupabaseAdmin();

      if (!supabase) {
        return NextResponse.json(
          { error: 'Database client not configured.' },
          { status: 500 }
        );
      }

      const { data, error } = await supabase
        .from('theses')
        .select('summary')
        .eq('id', thesis_id)
        .maybeSingle();

      if (error) {
        console.error('[api/review] lookup error', error);
        return NextResponse.json(
          { error: 'Unable to load thesis summary.' },
          { status: 400 }
        );
      }

      thesisSummary = data?.summary ?? null;
    }

    if (!thesisSummary) {
      return NextResponse.json(
        { error: 'Provide a thesis summary to analyze.' },
        { status: 422 }
      );
    }

    const review = await generateThesisReview(
      thesis_id ?? 'ad-hoc',
      thesisSummary
    );

    return NextResponse.json({ review });
  } catch (error) {
    console.error('[api/review] failed', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0]?.message ?? 'Invalid request payload.' },
        { status: 422 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to generate review.' },
      { status: 500 }
    );
  }
}
