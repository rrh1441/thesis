import { z } from 'zod';

import { getOpenAIClient } from '@/lib/openai';
import {
  THESIS_ALIGNMENT_SCHEMA,
  THESIS_ALIGNMENT_SYSTEM_PROMPT,
  THESIS_REVIEW_SCHEMA,
  THESIS_REVIEW_SYSTEM_PROMPT,
} from '@/lib/prompts';

const thesisAlignmentSchema = z.object({
  thesis_summary: z.string(),
  sectors_affected: z
    .array(
      z.object({
        name: z.string(),
        direction: z.enum(['positive', 'negative', 'neutral']),
        notes: z.string().optional(),
      })
    )
    .default([]),
  tickers_long: z
    .array(
      z.object({
        symbol: z.string(),
        conviction: z.enum(['low', 'medium', 'high']),
        rationale: z.string(),
        suggested_weight: z.number().optional(),
        confidence: z.enum(['low', 'medium', 'high']).optional(),
      })
    )
    .default([]),
  tickers_short: z
    .array(
      z.object({
        symbol: z.string(),
        conviction: z.enum(['low', 'medium', 'high']),
        rationale: z.string(),
        suggested_weight: z.number().optional(),
        confidence: z.enum(['low', 'medium', 'high']).optional(),
      })
    )
    .default([]),
  rationale: z.string().default(''),
  confidence_notes: z.array(z.string()).default([]),
  macro_signals: z.array(z.string()).default([]),
});

const thesisReviewSchema = z.object({
  pros: z.array(z.string()).default([]),
  cons: z.array(z.string()).default([]),
  related_themes: z.array(z.string()).default([]),
  historical_analogs: z.array(z.string()).default([]),
  counter_theses: z.array(z.string()).default([]),
  confidence_level: z.enum(['low', 'medium', 'high']).default('medium'),
});

export type ThesisAlignment = z.infer<typeof thesisAlignmentSchema>;
export type ThesisReview = z.infer<typeof thesisReviewSchema>;

export async function generateThesisAlignment(userThesis: string) {
  const client = getOpenAIClient();

  const response = await client.responses.create({
    model: 'gpt-4.1',
    temperature: 0.4,
    top_p: 0.9,
    text: {
      format: THESIS_ALIGNMENT_SCHEMA,
    },
    input: [
      { role: 'system', content: THESIS_ALIGNMENT_SYSTEM_PROMPT },
      {
        role: 'user',
        content: `The user believes: "${userThesis}". Analyze it.`,
      },
    ],
  });

  const output =
    response.output_text ??
    (Array.isArray(response.output)
      ? response.output.find((item) => 'content' in item && Array.isArray(item.content))
          ?.content?.find((chunk) => 'text' in chunk)?.['text'] ?? null
      : null);

  if (!output) {
    throw new Error('OpenAI returned an empty response for thesis alignment.');
  }

  let payload: unknown;
  try {
    payload = JSON.parse(output);
  } catch (error) {
    console.error('[thesis] Failed to parse alignment JSON', error, output);
    throw new Error('Invalid response format from AI alignment call.');
  }

  return thesisAlignmentSchema.parse(payload);
}

export async function generateThesisReview(
  thesisId: string,
  thesisSummary: string
) {
  const client = getOpenAIClient();

  const response = await client.responses.create({
    model: 'gpt-4.1',
    temperature: 0.3,
    text: {
      format: THESIS_REVIEW_SCHEMA,
    },
    input: [
      { role: 'system', content: THESIS_REVIEW_SYSTEM_PROMPT },
      {
        role: 'user',
        content: `Provide a balanced review for the thesis (${thesisId}): "${thesisSummary}"`,
      },
    ],
  });

  const output =
    response.output_text ??
    (Array.isArray(response.output)
      ? response.output.find((item) => 'content' in item && Array.isArray(item.content))
          ?.content?.find((chunk) => 'text' in chunk)?.['text'] ?? null
      : null);

  if (!output) {
    throw new Error('OpenAI returned an empty response for thesis review.');
  }

  let payload: unknown;
  try {
    payload = JSON.parse(output);
  } catch (error) {
    console.error('[thesis] Failed to parse review JSON', error, output);
    throw new Error('Invalid response format from AI review call.');
  }

  return thesisReviewSchema.parse(payload);
}

export type PaperTrade = {
  id: string;
  thesis_id: string;
  ticker: string;
  direction: 'long' | 'short';
  quantity: number;
  entry_price: number;
  current_price: number | null;
  pnl: number | null;
  created_at: string;
};
