import { NextResponse } from 'next/server';
import { z } from 'zod';

import { generateThesisReview } from '@/lib/thesis';
import { query } from '@/lib/db';

const requestSchema = z.object({
  thesis_id: z.string().uuid().optional(),
  summary: z.string().min(5, 'Provide a short summary for the thesis.').optional(),
});

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const { thesis_id, summary } = requestSchema.parse(json);

    let thesisSummary: string | undefined = summary;

    if (!thesisSummary && thesis_id) {
      const rows = await query<{ summary: string | null }>(
        'SELECT summary FROM theses WHERE id = $1 LIMIT 1',
        [thesis_id]
      );

      const dbSummary = rows[0]?.summary ?? undefined;
      thesisSummary = dbSummary ?? undefined;
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
